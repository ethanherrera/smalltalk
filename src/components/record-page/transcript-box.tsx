import React, { useState, useEffect, useRef } from 'react';

interface Message {
  speaker: string;
  text: string;
  isLive?: boolean;
  displaySpeaker?: string;
}

interface TranscriptBoxProps {
  isRecording: boolean;
  transcript: string;
  liveTranscript: string;
  liveMessages: Message[];
}

const TranscriptBox: React.FC<TranscriptBoxProps> = ({ 
  isRecording, 
  transcript, 
  liveTranscript,
  liveMessages
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const transcriptBoxRef = useRef<HTMLDivElement>(null);

  // Add the final transcript as a message when recording stops
  useEffect(() => {
    if (!isRecording && transcript) {
      setMessages(prev => [...prev, { speaker: 'You', text: transcript }]);
    }
  }, [transcript, isRecording]);

  // Clear messages when starting a new recording
  useEffect(() => {
    if (isRecording) {
      setMessages([]);
    }
  }, [isRecording]);

  // Scroll to bottom when messages change or live transcript updates
  useEffect(() => {
    if (transcriptBoxRef.current) {
      transcriptBoxRef.current.scrollTop = transcriptBoxRef.current.scrollHeight;
    }
  }, [messages, liveTranscript, liveMessages]);

  return (
    <div className="w-full flex flex-col items-center mt-4">
      <div className="w-[90%] max-w-3xl">
        <h2 className="text-xl font-semibold mb-3">Transcript</h2>
        <div 
          ref={transcriptBoxRef}
          className="h-[60vh] overflow-y-auto border rounded-lg p-4 bg-muted/30"
        >
          <div className="flex flex-col items-start gap-4">
            {messages.map((message, index) => (
              <div key={index} className="flex flex-col items-start">
                <span className="font-medium text-primary">{message.speaker}:</span>
                <p className="pl-0">
                  {message.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            ))}
            
            {/* Show live messages with separate headers for each utterance */}
            {liveMessages.length > 0 && liveMessages.map((message, index) => (
              <div key={`live-${index}`} className="flex flex-col items-start">
                <span className="font-medium text-primary">
                  {message.displaySpeaker || message.speaker}:
                </span>
                <p className="pl-0">
                  {message.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            ))}
            
            {/* This is the old implementation, keep it as a fallback if no live messages are available */}
            {liveMessages.length === 0 && liveTranscript && (
              <div className="flex flex-col items-start">
                <span className="font-medium text-primary">You (live):</span>
                <p className="pl-0">
                  {liveTranscript.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptBox; 