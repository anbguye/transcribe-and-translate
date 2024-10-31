# AI Audio Transcription & Translation

A web application that transcribes audio files and translates non-English content to English using OpenAI's Whisper and Groq's API.

## Features

- Audio file upload and processing
- Live audio recording with microphone
- Transcription using Whisper Large v3 model
- Automatic translation of non-English segments to English using Mixtral-8x7b
- Timestamp-based segmentation of audio content
- Download transcription and translation results as text file
- Real-time loading states and error handling

## Tech Stack

- **Framework**: Next.js 15
- **UI Components**: 
  - Shadcn/ui
  - Lucide React icons
  - Tailwind CSS
  - Geist Font
- **API Integration**: 
  - OpenAI Whisper API (transcription)
  - Groq API (translation)
- **Language**: TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
GROQ_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Choose your input method:
   - Click the upload icon to select an audio file
   - Click the microphone icon to record audio directly
2. Wait for the transcription and translation process
3. View the results with timestamps, original text, and translations
4. Download the complete results as a text file

## API Endpoints

### POST /api/transcribe
Handles audio file transcription and translation:
- Accepts audio files via FormData
- Transcribes audio using Whisper Large v3
- Translates non-English content to English using Mixtral-8x7b
- Returns segmented transcriptions with timestamps

## License

MIT
