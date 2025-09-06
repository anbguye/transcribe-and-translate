# AI Audio Transcription & Translation

A secure web application that transcribes audio files and translates non-English content to English using OpenAI's Whisper and Groq's API with built-in rate limiting protection.

## Features

- Audio file upload and processing
- Live audio recording with microphone
- Transcription using Whisper Large v3 model
- Automatic translation of non-English content to English using Llama 3.1 8B Instant
- Rate limiting (10 requests per minute per IP) to prevent abuse
- Timestamp-based segmentation of audio content
- Download transcription and translation results as text file
- Real-time loading states and comprehensive error handling
- Secure file handling with automatic cleanup

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

## Security & Rate Limiting

- **Rate Limiting**: 10 requests per minute per IP address to prevent abuse
- **Secure File Handling**: Automatic cleanup of temporary files
- **Input Validation**: Proper validation of file uploads and API responses
- **Error Handling**: Comprehensive error handling with user-friendly messages

## API Endpoints

### POST /api/transcribe
Handles audio file transcription and translation:
- Accepts audio files via FormData
- Transcribes audio using Whisper Large v3
- Translates non-English content to English using Llama 3.1 8B Instant
- Implements rate limiting (10 requests per minute per IP)
- Returns transcription results with automatic cleanup
- Secure file handling with temporary file management

## Enhancement Roadmap

### Phase 1: Core User Experience Improvements (High Priority)
- [ ] Implement batch file upload (multiple files selection and processing queue)
- [ ] Add multiple output formats (SRT, VTT, JSON, DOCX export options)
- [ ] Create progress tracking system with real-time updates and ETA
- [ ] Build transcription history dashboard with search and organization
- [ ] Add target language selection dropdown (20+ languages)

### Phase 2: Advanced Features (Medium Priority)
- [ ] Implement real-time streaming transcription during recording
- [ ] Add audio quality analysis and preprocessing suggestions
- [ ] Create cost estimation feature showing API usage before processing
- [ ] Build usage tracking dashboard with analytics
- [ ] Add keyboard shortcuts for power users (upload, play/pause, etc.)

### Phase 3: User Interface Enhancements (Medium Priority)
- [ ] Implement dark mode with system preference detection
- [ ] Add drag-and-drop file upload area
- [ ] Create file preview with audio waveform visualization
- [ ] Build transcription editor with inline corrections
- [ ] Add export customization options (timestamps, formatting)

### Phase 4: Collaboration & Sharing (Lower Priority)
- [ ] Implement transcription sharing with public links
- [ ] Add team collaboration features (shared workspaces)
- [ ] Create API access for integrations
- [ ] Build webhook notifications for completed transcriptions
- [ ] Add Zapier integration for workflow automation

### Phase 5: Enterprise Features (Future)
- [ ] Implement user authentication and accounts
- [ ] Add team management and role-based access
- [ ] Create admin dashboard for usage monitoring
- [ ] Build custom model training options
- [ ] Add compliance features (data retention, GDPR)

### Technical Debt & Optimization
- [ ] Implement proper database for transcription storage
- [ ] Add comprehensive error logging and monitoring
- [ ] Optimize file processing for large audio files
- [ ] Implement caching for repeated requests
- [ ] Add comprehensive testing suite

### Mobile & Accessibility
- [ ] Create responsive mobile-optimized interface
- [ ] Add PWA capabilities for offline functionality
- [ ] Implement accessibility features (screen reader support)
- [ ] Add voice commands for hands-free operation
- [ ] Create mobile app version

Each phase builds upon the previous one, starting with immediate user value and progressing to advanced enterprise features. The roadmap prioritizes features that provide the most user value with reasonable implementation effort.

## License

MIT
