"use client";

import { useState } from "react";
import { Loader2, Download } from "lucide-react";

interface Segment {
  start: number;
  end: number;
  originalText: string;
  translatedText: string;
}

export default function Home() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setError("");
      handleSubmit(selectedFile);
    }
  };

  const handleSubmit = async (file: File) => {
    try {
      setIsLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSegments(data.segments);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 space-y-8">
      <h1 className="text-2xl font-bold">Audio Transcription & Translation</h1>

      <div className="w-full max-w-2xl">
        <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          ) : (
            <span className="text-gray-500">Click to upload audio file</span>
          )}
        </label>

        {error && (
          <p className="text-red-500 mt-2 text-sm text-center">{error}</p>
        )}
      </div>

      {segments.length > 0 && (
        <div className="w-full max-w-2xl space-y-4">
          {segments.map((segment, index) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-4 last:border-0"
            >
              <div className="text-xs text-gray-400 mb-1">
                [{formatTime(segment.start)} - {formatTime(segment.end)}]
              </div>
              <p className="text-sm mb-2">{segment.originalText}</p>
              <p className="text-sm text-gray-600">{segment.translatedText}</p>
            </div>
          ))}

          <button
            onClick={handleDownload}
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Results
          </button>
        </div>
      )}
    </div>
  );
}
