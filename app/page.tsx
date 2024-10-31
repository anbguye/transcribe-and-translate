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
  const [transcription, setTranscription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    setIsLoading(true);
    // Simulating transcription and translation process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setTranscription(
      "This is a simulated transcription and translation of the uploaded audio file. In a real application, this would be the actual transcribed and translated text from the audio file."
    );
    setIsLoading(false);
  };

  const handleDownload = () => {
    const blob = new Blob([transcription], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcription.txt";
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
            Audio Transcription
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
                    "Transcribe and Translate"
                  )}
                </Button>
              </form>
            </div>
            <div className="flex-1 mt-4 md:mt-0">
              <div className="bg-white p-4 rounded-lg shadow min-h-[200px] max-h-[400px] overflow-y-auto">
                {transcription ? (
                  <p className="text-sm">{transcription}</p>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Transcription will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            onClick={handleDownload}
            disabled={!transcription}
            variant="outline"
            className="mt-4"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Transcription
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
