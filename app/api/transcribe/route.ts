import OpenAI from "openai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Polyfill File for Node.js
if (typeof File === 'undefined') {
  (global as any).File = class File {
    name: string;
    type: string;
    size: number;
    lastModified: number;
    _buffer: Buffer;

    constructor(parts: any[], filename: string, options: { type?: string } = {}) {
      this.name = filename;
      this.type = options.type || '';
      this.size = parts.reduce((size, part) => size + (Buffer.isBuffer(part) ? part.length : part.length || 0), 0);
      this.lastModified = Date.now();
      this._buffer = Buffer.concat(parts.map(p => Buffer.isBuffer(p) ? p : Buffer.from(p)));
    }

    arrayBuffer() {
      return Promise.resolve(this._buffer.buffer as ArrayBuffer);
    }

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
