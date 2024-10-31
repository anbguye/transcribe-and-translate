import OpenAI from "openai";
import { NextResponse } from "next/server";

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

    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: file.type });

    console.log("Sending transcription request to Whisper");

    const transcription = await openai.audio.transcriptions.create({
      file: new File([blob], "audio.mp3", { type: file.type }),
      model: "whisper-large-v3",
      response_format: "verbose_json"
    });

    if (!transcription.segments) {
      return NextResponse.json({ error: "No segments found in transcription" }, { status: 400 });
    }

    console.log("Received transcription:", transcription);

    // Translate each segment
    const segments = await Promise.all(
      transcription.segments.map(async (segment) => {
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content:
                "You are a translator. Translate the following text to English if it's not already in English. If it's already in English, return it as is. Just return the translated text without any additional comments. Dont mention anything about the language of the text. Just return the translated text.",
            },
            {
              role: "user",
              content: segment.text,
            },
          ],
          model: "mixtral-8x7b-32768",
          temperature: 0.3,
        });

        return {
          start: segment.start,
          end: segment.end,
          originalText: segment.text,
          translatedText: completion.choices[0].message.content,
        };
      })
    );

    console.log("Translation completed for all segments");

    return NextResponse.json({ segments });
  } catch (error) {
    console.error("Error in transcription/translation:", error);
    return NextResponse.json(
      { error: "Error processing transcription/translation" },
      { status: 500 }
    );
  }
}
