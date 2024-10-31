"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Download, Upload } from "lucide-react";

interface Segment {
  start: number;
  end: number;
  originalText: string;
  translatedText: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

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
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const content = segments.map(segment => (
      `[${formatTime(segment.start)} - ${formatTime(segment.end)}]\n` +
      `Original: ${segment.originalText}\n` +
      `English: ${segment.translatedText}\n\n`
    )).join('');

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Audio Transcription & Translation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-grow">
                      <Input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="file:mr-4 file:px-4 file:py-1 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={!file || isLoading}
                      className="min-w-[120px]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Submit
                        </>
                      )}
                    </Button>
                  </div>
                </form>
                {error && (
                  <p className="text-destructive mt-2 text-sm">{error}</p>
                )}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Original Transcription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-md min-h-[150px] max-h-[300px] overflow-y-auto">
                    {segments.length > 0 ? (
                      <div className="space-y-4">
                        {segments.map((segment, index) => (
                          <div key={index} className="border-b border-border pb-2 last:border-0">
                            <div className="text-xs text-muted-foreground mb-1">
                              [{formatTime(segment.start)} - {formatTime(segment.end)}]
                            </div>
                            <p className="text-sm">{segment.originalText}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Original transcription will appear here...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">English Translation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-md min-h-[150px] max-h-[300px] overflow-y-auto">
                    {segments.length > 0 ? (
                      <div className="space-y-4">
                        {segments.map((segment, index) => (
                          <div key={index} className="border-b border-border pb-2 last:border-0">
                            <div className="text-xs text-muted-foreground mb-1">
                              [{formatTime(segment.start)} - {formatTime(segment.end)}]
                            </div>
                            <p className="text-sm">{segment.translatedText}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        English translation will appear here...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            onClick={handleDownload}
            disabled={segments.length === 0}
            variant="outline"
            className="mt-4"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Results
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
