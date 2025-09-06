# 🎙️ AI Audio Transcription & Translation

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)](https://openai.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, secure web application that transcribes audio files and translates non-English content to English using cutting-edge AI models with intelligent features and built-in protection.

## ✨ Features

### 🎵 Audio Processing
- **File Upload**: Support for various audio formats
- **Live Recording**: Record directly from your microphone
- **Intelligent Auto-Stop**: Automatically stops recording after 2 seconds of silence
- **Smart Detection**: Uses Web Audio API for real-time silence detection

### 🤖 AI-Powered Transcription & Translation
- **Whisper Large v3**: State-of-the-art speech recognition
- **Llama 3.1 8B Instant**: Fast and accurate translation
- **Multi-language Support**: Automatic language detection and translation
- **Timestamp Segmentation**: Precise timing for all transcribed content

### 🛡️ Security & Performance
- **Rate Limiting**: 10 requests per minute per IP to prevent abuse
- **Secure File Handling**: Automatic cleanup of temporary files
- **Input Validation**: Comprehensive validation and sanitization
- **Error Handling**: User-friendly error messages and recovery

### 📊 User Experience
- **Real-time Feedback**: Loading states and progress indicators
- **Export Options**: Download results as formatted text files
- **Responsive Design**: Works seamlessly on all devices
- **Intuitive Interface**: Clean, modern UI with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **Icons**: Lucide React icon set
- **AI APIs**:
  - OpenAI Whisper API (transcription)
  - Groq API with Llama 3.1 8B Instant (translation)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Groq API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/anbguye/transcribe-and-translate.git
cd transcribe-and-translate
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API key:
```env
GROQ_API_KEY=your_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Recording Audio
1. **Click the microphone icon** to start recording
2. **Speak clearly** into your microphone
3. **Recording automatically stops** after 2 seconds of silence
4. **Or manually stop** by clicking the stop button anytime

### Uploading Files
1. **Click the upload icon** to select an audio file
2. **Choose your audio file** (supports MP3, WAV, M4A, etc.)
3. **Wait for processing** - transcription and translation happen automatically

### Viewing Results
- **Real-time updates** show processing status
- **Timestamped segments** for precise navigation
- **Original text** and **English translation** side by side
- **Download button** to save results as a text file

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
