import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client with Groq's base URL
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(request: Request) {
  try {
    // Log the incoming request
    console.log('Received transcription request');

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Log file details
    console.log('File received:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: file.type });

    console.log('Sending request to Groq API');
    
    const transcription = await openai.audio.transcriptions.create({
      file: new File([blob], 'audio.mp3', { type: file.type }),
      model: 'whisper-large-v3',
    });

    console.log('Received response from Groq API:', transcription);

    return NextResponse.json({ 
      text: transcription.text 
    });

  } catch (error) {
    console.error('Error in transcription:', error);
    return NextResponse.json(
      { error: 'Error processing transcription' },
      { status: 500 }
    );
  }
} 