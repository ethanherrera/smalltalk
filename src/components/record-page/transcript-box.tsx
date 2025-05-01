import React, { useState, useEffect, useRef } from 'react';

interface Message {
  speaker: string;
  text: string;
  timestamp: Date;
}

interface TranscriptBoxProps {
  isRecording: boolean;
  transcript: string;
  liveTranscript: string;
  forceNewLine?: boolean;
  onNewLineCreated?: () => void;
}

const TranscriptBox: React.FC<TranscriptBoxProps> = ({ 
  isRecording, 
  transcript, 
  liveTranscript,
  forceNewLine = false,
  onNewLineCreated
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const transcriptBoxRef = useRef<HTMLDivElement>(null);
  const prevLiveTranscriptRef = useRef<string>('');

  // Add the final transcript as a message when recording stops
  useEffect(() => {
    if (!isRecording && transcript) {
      setMessages(prev => [...prev, { 
        speaker: 'You', 
        text: transcript,
        timestamp: new Date()
      }]);
      setCurrentMessage(null);
    }
  }, [transcript, isRecording]);

  // Handle forced new line creation
  useEffect(() => {
    if (forceNewLine && currentMessage && liveTranscript) {
      console.log("Creating new line due to force flag");
      
      // Add the current message to messages and create a new one
      setMessages(prev => [...prev, currentMessage]);
      
      // Create a new message with the current transcription
      setCurrentMessage({ 
        speaker: 'You (live)', 
        text: liveTranscript,
        timestamp: new Date()
      });
      
      // Notify parent that we've created a new line
      if (onNewLineCreated) {
        onNewLineCreated();
      }
    }
  }, [forceNewLine, currentMessage, liveTranscript, onNewLineCreated]);

  // Handle live transcription updates
  useEffect(() => {
    if (isRecording && liveTranscript && liveTranscript !== prevLiveTranscriptRef.current) {
      console.log(`Transcript changed: "${prevLiveTranscriptRef.current}" -> "${liveTranscript}"`);
      
      // Check for sentence breaks or significant pauses
      const endsWithPunctuation = /[.!?]\s*$/.test(liveTranscript.trim());
      const previousEndsWithPunctuation = /[.!?]\s*$/.test(prevLiveTranscriptRef.current.trim());
      const hasNewSentence = endsWithPunctuation && !previousEndsWithPunctuation;
      
      // If transcript has changed significantly, create a new message
      // This helps avoid continuous updates to the same line
      const shouldCreateNewMessage = 
        !currentMessage || 
        // Create a new line if the transcript is very different (indicating a new sentence)
        liveTranscript.length < prevLiveTranscriptRef.current.length || 
        Math.abs(liveTranscript.length - prevLiveTranscriptRef.current.length) > 20 ||
        hasNewSentence ||
        forceNewLine;
      
      if (shouldCreateNewMessage) {
        console.log(`Creating new message. Reason: ${!currentMessage ? 'No current message' : 
          liveTranscript.length < prevLiveTranscriptRef.current.length ? 'Shorter transcript' : 
          Math.abs(liveTranscript.length - prevLiveTranscriptRef.current.length) > 20 ? 'Significant change' : 
          hasNewSentence ? 'New sentence detected' : 'Force flag'}`);
        
        // Create a new message
        const newMessage = { 
          speaker: 'You (live)', 
          text: liveTranscript,
          timestamp: new Date()
        };
        
        // If we already have a current message, add it to the messages array
        if (currentMessage) {
          setMessages(prev => [...prev, currentMessage]);
        }
        
        setCurrentMessage(newMessage);
        
        // Notify parent that we've created a new line
        if (forceNewLine && onNewLineCreated) {
          onNewLineCreated();
        }
      } else if (currentMessage) {
        // Update the existing message
        setCurrentMessage({
          ...currentMessage,
          text: liveTranscript
        });
      }
      
      prevLiveTranscriptRef.current = liveTranscript;
    }
  }, [liveTranscript, isRecording, currentMessage, forceNewLine, onNewLineCreated]);

  // Clear messages when starting a new recording
  useEffect(() => {
    if (isRecording) {
      setMessages([]);
      setCurrentMessage(null);
      prevLiveTranscriptRef.current = '';
    }
  }, [isRecording]);

  // Scroll to bottom when messages change or live transcript updates
  useEffect(() => {
    if (transcriptBoxRef.current) {
      transcriptBoxRef.current.scrollTop = transcriptBoxRef.current.scrollHeight;
    }
  }, [messages, currentMessage]);

  // Get all messages to display
  const allMessages = [...messages];
  if (currentMessage) {
    allMessages.push(currentMessage);
  }

  return (
    <div className="w-full flex flex-col items-center mt-4">
      <div className="w-[90%] max-w-3xl">
        <h2 className="text-xl font-semibold mb-3">Live Transcript</h2>
        <div 
          ref={transcriptBoxRef}
          className="h-[60vh] overflow-y-auto border rounded-lg p-4 bg-muted/30"
        >
          <div className="flex flex-col items-start gap-4">
            {allMessages.length > 0 ? (
              allMessages.map((message, index) => (
                <div key={index} className="flex flex-col items-start">
                  <span className="font-medium text-primary">{message.speaker}:</span>
                  <p className="pl-0">{message.text}</p>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">
                {isRecording 
                  ? "Speaking will appear here..." 
                  : "No transcript available. Click 'Start Recording' to begin."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptBox; 