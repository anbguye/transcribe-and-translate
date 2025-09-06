"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
  isProcessing: boolean;
}

const AUTO_STOP_DELAY = 2000; // 2 seconds
const COUNTDOWN_INTERVAL = 1000; // 1 second
const SILENCE_THRESHOLD = 1; // Audio level threshold for silence detection
const SILENCE_DURATION = 2000; // 2 seconds of silence before auto-stop
const AUDIO_CHECK_INTERVAL = 100; // Check audio levels every 100ms

export default function AudioRecorder({ onRecordingComplete, isProcessing }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * Gets the current audio level from the analyser
   */
  const getAudioLevel = (): number => {
    if (!analyserRef.current) return 0;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume level
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    return sum / bufferLength;
  };

  /**
   * Monitors audio levels and handles silence detection
   */
  const monitorAudioLevels = () => {
    const audioLevel = getAudioLevel();

    if (audioLevel < SILENCE_THRESHOLD) {
      // Audio is below threshold (silence)
      if (!silenceTimeoutRef.current) {
        // Start silence timer
        silenceTimeoutRef.current = setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            console.log('Auto-stopping due to 2 seconds of silence');
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            cleanupAudioMonitoring();
          }
        }, SILENCE_DURATION);
      }
    } else {
      // Audio detected, clear silence timer
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    }
  };

  /**
   * Sets up Web Audio API for silence detection
   */
  const setupAudioMonitoring = async (stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Resume audio context if needed (required in some browsers)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      analyserRef.current.fftSize = 2048; // Increased for better frequency resolution
      analyserRef.current.smoothingTimeConstant = 0.8; // Increased smoothing
      analyserRef.current.minDecibels = -90;
      analyserRef.current.maxDecibels = -10;
      source.connect(analyserRef.current);



      // Start monitoring audio levels
      const monitorInterval = setInterval(() => {
        monitorAudioLevels();
      }, AUDIO_CHECK_INTERVAL);

      // Store interval for cleanup
      (analyserRef.current as any).monitorInterval = monitorInterval;
    } catch (error) {
      console.warn('Web Audio API setup failed:', error);
    }
  };

  /**
   * Cleans up audio monitoring resources
   */
  const cleanupAudioMonitoring = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    if (analyserRef.current && (analyserRef.current as any).monitorInterval) {
      clearInterval((analyserRef.current as any).monitorInterval);
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }

    audioContextRef.current = null;
    analyserRef.current = null;
  };

  /**
   * Starts audio recording using the user's microphone
   */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

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

        // Clean up
        cleanupAudioMonitoring();
        stream.getTracks().forEach(track => track.stop());
      };

      // Set up silence detection
      setupAudioMonitoring(stream);

      mediaRecorder.start();
      setIsRecording(true);


    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Error accessing microphone. Please ensure you have granted microphone permissions.');
    }
  };

  /**
   * Stops recording immediately when called
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Clear any existing timeout
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
      }

      // Clear silence detection
      cleanupAudioMonitoring();

      // Stop recording immediately
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };



  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
      }
    };
  }, []);

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
