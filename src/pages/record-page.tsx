import { Button } from "@/components/ui/button";
import { ArrowLeft, Mic, Square, RotateCcw, Send } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TranscriptBox from "@/components/record-page/transcript-box";
import AudioVisualizer from "@/components/record-page/audio-visualizer";

const RecordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (isRecording) {
      id = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    }
    return () => id && clearInterval(id);
  }, [isRecording]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const start = () => {
    setIsRecording(true);
    setElapsedTime(0);
  };
  const stop = () => {
    setIsRecording(false);
    setShowControls(true);
  };
  const retry = () => {
    setShowControls(false);
    setElapsedTime(0);
    setIsRecording(false);
  };
  const submit = () => navigate("/feedback");

  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="sticky top-0 z-10 bg-background flex items-center gap-2 py-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Record Conversation</h1>
      </div>

      <TranscriptBox />
      <div className="flex justify-center mb-4">
<<<<<<< HEAD
        <Button 
          variant="outline" 
          className="flex items-center gap-2 px-6 py-2 border-blue-500 text-blue-500 hover:bg-blue-50"
          onClick={() => navigate('/practice')}
=======
        <Button
          variant="outline"
          className="flex items-center gap-2 px-6 py-2 border-blue-500 text-blue-500 hover:bg-blue-50"
          onClick={() => navigate("/practice")}
>>>>>>> x1
        >
          <span className="font-medium">Switch to Practice Mode</span>
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {!isRecording && !showControls && (
          <Button
            onClick={start}
            className="w-full h-20 rounded-full bg-primary text-lg flex items-center justify-center gap-2"
          >
            <Mic className="h-6 w-6" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <div className="flex items-center gap-4">
            <div className="flex-1 h-20 rounded-lg overflow-hidden">
              <AudioVisualizer isRecording={true} />
            </div>
            <div className="text-lg font-medium text-primary">
              {formatTime(elapsedTime)}
            </div>
            <Button
              onClick={stop}
              className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex-shrink-0"
            >
              <Square className="h-6 w-6" />
            </Button>
          </div>
        )}

        {showControls && (
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={retry}
              className="flex-1 h-20 rounded-full flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-6 w-6" />
              Try Again
            </Button>
            <Button
              variant="default"
              onClick={submit}
              className="flex-1 h-20 rounded-full flex items-center justify-center gap-2"
            >
              <Send className="h-6 w-6" />
              Submit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordPage;
