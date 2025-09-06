import OpenAI from "openai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

/**
 * Checks if the client IP is within rate limits
 * @param clientIP - The client's IP address
 * @returns true if request is allowed, false if rate limited
 */
function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize rate limit data
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  clientData.count++;
  return true;
}

// Polyfill File for Node.js
if (typeof File === 'undefined') {
  /**
   * Polyfill for the File API in Node.js environments
   * Provides basic File functionality for server-side file handling with OpenAI SDK
   */
  (global as any).File = class File {
    name: string;
    type: string;
    size: number;
    lastModified: number;
    _buffer: Buffer;

    /**
     * Creates a new File instance from buffer parts
     * @param parts - Array of Buffer or other data parts
     * @param filename - Name of the file
     * @param options - Additional options like MIME type
     */
    constructor(parts: any[], filename: string, options: { type?: string } = {}) {
      this.name = filename;
      this.type = options.type || '';
      this.size = parts.reduce((size, part) => size + (Buffer.isBuffer(part) ? part.length : part.length || 0), 0);
      this.lastModified = Date.now();
      this._buffer = Buffer.concat(parts.map(p => Buffer.isBuffer(p) ? p : Buffer.from(p)));
    }

    /**
     * Returns the file contents as an ArrayBuffer
     * @returns Promise resolving to ArrayBuffer
     */
    arrayBuffer() {
      return Promise.resolve(this._buffer.buffer as ArrayBuffer);
    }

    /**
     * Returns the file contents as a string
     * @returns Promise resolving to string
     */
    text() {
      return Promise.resolve(this._buffer.toString());
    }
  };
}

// Initialize OpenAI client with Groq's base URL
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Log the incoming request
    console.log("Received transcription request");

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Log file details
    console.log("File received:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Write to temporary file
    const tempDir = '/tmp';
    const tempFileName = `audio-${Date.now()}.webm`;
    const tempPath = path.join(tempDir, tempFileName);
    fs.writeFileSync(tempPath, buffer);

    console.log("Sending transcription request to Whisper");

    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempPath),
        model: "whisper-large-v3",
        response_format: "json"
      });

      if (!transcription.text) {
        return NextResponse.json({ error: "No text found in transcription" }, { status: 400 });
      }

      console.log("Received transcription:", transcription);

      // Translate the full text as a single segment
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content:
              "You are a translator. Translate the following text to English if it's not already in English. If it's already in English, return it as is. Just return the translated text without any additional comments. Dont mention anything about the language of the text. Just return the translated text. ",
          },
          {
            role: "user",
            content: transcription.text,
          },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
      });

      const segments = [{
        start: 0,
        end: 0,
        originalText: transcription.text,
        translatedText: completion.choices[0].message.content,
      }];

      console.log("Translation completed for all segments");

      return NextResponse.json({ segments });
    } finally {
      // Clean up temp file
      fs.unlinkSync(tempPath);
    }
  } catch (error) {
    console.error("Error in transcription/translation:", error);
    return NextResponse.json(
      { error: "Error processing transcription/translation" },
      { status: 500 }
    );
  }
}
