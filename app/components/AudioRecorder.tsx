"use client";

import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
  isProcessing: boolean;
}

export default function AudioRecorder({ onRecordingComplete, isProcessing }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
        onRecordingComplete(audioFile);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Error accessing microphone. Please ensure you have granted microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (isProcessing) {
    return (
      <button
        disabled
        className="w-full h-full flex items-center justify-center border border-gray-300 rounded-full bg-gray-50"
      >
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </button>
    );
  }

  if (isRecording) {
    return (
      <button
        onClick={stopRecording}
        className="w-full h-full flex items-center justify-center border border-gray-300 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
      >
        <Square className="h-8 w-8 text-white" />
      </button>
    );
  }

  return (
    <button
      onClick={startRecording}
      className="w-full h-full flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
    >
      <Mic className="h-8 w-8 text-gray-500" />
    </button>
  );
} 