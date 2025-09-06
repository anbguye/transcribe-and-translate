"use client";

import { useState, useRef } from "react";
import { Loader2, Download, Upload } from "lucide-react";
import AudioRecorder from "./components/AudioRecorder";

interface Segment {
  start: number;
  end: number;
  originalText: string;
  translatedText: string;
}

const SECONDS_PER_MINUTE = 60;
const TIME_PADDING = 2;

export default function Home() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setError("");
      handleSubmit(selectedFile);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRecordingComplete = async (audioFile: File) => {
    console.log('handleRecordingComplete called - setting isRecording to false');
    setIsRecording(false);
    handleSubmit(audioFile);
  };

  /**
   * Transcribes and translates an audio file using the API
   * @param audioFile - The audio file to process
   * @returns Promise resolving to transcription segments
   */
  const transcribeAudio = async (audioFile: File): Promise<Segment[]> => {
    const formData = new FormData();
    formData.append("file", audioFile);

    const response = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please wait a minute before trying again.");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.segments;
  };

  const handleSubmit = async (audioFile: File) => {
    try {
      setIsLoading(true);
      setError("");
      setSegments([]);

      const segments = await transcribeAudio(audioFile);
      setSegments(segments);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
    const remainingSeconds = Math.floor(seconds % SECONDS_PER_MINUTE);
    return `${minutes}:${remainingSeconds.toString().padStart(TIME_PADDING, "0")}`;
  };

  const handleDownload = () => {
    const content = segments
      .map(
        (segment) =>
          `[${formatTime(segment.start)} - ${formatTime(segment.end)}]\n` +
          `Original: ${segment.originalText}\n` +
          `English: ${segment.translatedText}\n\n`
      )
      .join("");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcription-and-translation.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">
        Audio Transcription & Translation
      </h1>

      <div className="w-full max-w-md">
        <div className="flex justify-center items-end space-x-8 mb-8">
          {/* Upload Section */}
          <div className="flex flex-col items-center min-h-[5rem]">
            <div className="w-16 h-16 mb-2">
              <label className="w-full h-full flex items-center justify-center border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isLoading || isRecording}
                />
                <Upload className="w-8 h-8 text-gray-500" />
              </label>
            </div>
            <span className="text-sm text-gray-600 text-center">Upload Audio</span>
          </div>

          {/* Record Section */}
          <div className="flex flex-col items-center min-h-[5rem]">
            <div className="w-16 h-16 mb-2">
              <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                isProcessing={isLoading}
              />
            </div>
            <span className="text-sm text-gray-600 text-center">Record Audio</span>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500 mr-2" />
            <span className="text-gray-600">Processing audio...</span>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {segments.length > 0 && (
          <div className="space-y-4 mb-8">
            {segments.map((segment, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="text-xs text-gray-400 mb-1">
                  [{formatTime(segment.start)} - {formatTime(segment.end)}]
                </div>
                <p className="text-sm mb-2">{segment.originalText}</p>
                <p className="text-sm text-gray-600">
                  {segment.translatedText}
                </p>
              </div>
            ))}
          </div>
        )}

        {segments.length > 0 && (
          <button
            onClick={handleDownload}
            className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Results
          </button>
        )}
      </div>
    </div>
  );
}
