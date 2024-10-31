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
import { Loader2, Download } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [originalText, setOriginalText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
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
      formData.append('file', file);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setOriginalText(data.originalText);
      setTranslatedText(data.translatedText);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const content = `Original Text:\n${originalText}\n\nEnglish Translation:\n${translatedText}`;
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 p-1 border-2"
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!file || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Transcribe & Translate"
                  )}
                </Button>
              </form>
              {error && (
                <p className="text-red-500 mt-2 text-sm">{error}</p>
              )}
            </div>
            <div className="flex-1 mt-4 md:mt-0">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow min-h-[100px] max-h-[200px] overflow-y-auto">
                  <h3 className="font-semibold mb-2">Original Transcription:</h3>
                  {originalText ? (
                    <p className="text-sm">{originalText}</p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Original transcription will appear here...
                    </p>
                  )}
                </div>
                <div className="bg-white p-4 rounded-lg shadow min-h-[100px] max-h-[200px] overflow-y-auto">
                  <h3 className="font-semibold mb-2">English Translation:</h3>
                  {translatedText ? (
                    <p className="text-sm">{translatedText}</p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      English translation will appear here...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            onClick={handleDownload}
            disabled={!originalText || !translatedText}
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
