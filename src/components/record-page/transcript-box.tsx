import React, { useEffect, useRef } from 'react';

interface TranscriptBoxProps {
  className?: string;
  transcript?: string;
  isRecording?: boolean;
  initialText?: string;
  speechStatus?: 'ready' | 'listening' | 'stopped' | 'not-supported';
}

const TranscriptBox: React.FC<TranscriptBoxProps> = ({ className, transcript, isRecording, initialText, speechStatus = 'ready' }) => {
  // Default transcript content if none provided
  const defaultTranscript = {
    intro: initialText || "Script of the conversation can be here",
    you: "Buenos días, doctor. Me gustaría hablar sobre el nuevo sistema de monitores cardíacos que están considerando para la unidad de cuidados intensivos.",
    other: "Sí, estamos evaluando varias opciones. ¿Qué información tiene sobre los diferentes modelos disponibles?",
    you2: "Nuestro modelo más avanzado es el CardioTrack Pro, que ofrece monitorización continua de ritmo cardíaco, presión arterial y niveles de oxígeno. Permite alertas personalizadas y se integra con el sistema de historias clínicas electrónicas del hospital.",
    other2: "Suena interesante. ¿Qué hay sobre la capacitación del personal y el soporte técnico?",
    you3: "Ofrecemos programas de capacitación completos para todo el personal médico y soporte técnico disponible las 24 horas. También podemos proporcionar actualizaciones de software regulares sin costo adicional durante el primer año."
  };

  // Reference to the transcript container for auto-scrolling
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when transcript updates
  useEffect(() => {
    if (transcriptContainerRef.current && transcript) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcript]);

  // Show real-time transcript if provided or default content
  const displayTranscript = transcript ? { intro: transcript } : defaultTranscript;
  
  // Apply blinking cursor effect when recording
  const recordingClass = isRecording ? 'after:content-["|_"] after:animate-pulse after:ml-1 after:font-bold' : '';

  // Format the transcript for better readability - split by sentences
  const formatTranscript = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\. /g, '.\n')  // Add line break after periods
      .replace(/\? /g, '?\n')  // Add line break after question marks
      .replace(/! /g, '!\n'); // Add line break after exclamation marks
  };

  return (
    <div 
      ref={transcriptContainerRef}
      className={`text-left text-base font-normal overflow-y-auto max-h-[calc(70vh-80px)] ${className || ''}`}
    >
      {isRecording && (
        <div className="mb-4">
          <p className="text-red-600 font-medium mb-2 flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2 animate-pulse"></span>
            Recording in progress...
          </p>
          {speechStatus === 'listening' && <SpeechFeedbackIndicator />}
        </div>
      )}
      
      {transcript ? (
        <div className={`bg-gray-50 p-4 rounded-lg border border-gray-300 shadow-sm ${isRecording ? recordingClass : ''}`}>
          <p className="text-gray-900 font-medium whitespace-pre-line">
            {formatTranscript(transcript)}
          </p>
        </div>
      ) : (
        <>
          <p className={`text-gray-800 font-medium mb-4 p-4 bg-gray-200 rounded-lg border border-gray-300 ${isRecording ? recordingClass : ''}`}>
            {displayTranscript.intro || 'Your speech will appear here as you speak...'}
          </p>
          
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg border border-gray-300 shadow-sm">
            <p className="leading-relaxed text-gray-900">
              <span className="font-semibold text-blue-700">You: </span>
              {defaultTranscript.you}
            </p>
            
            <p className="leading-relaxed text-gray-900">
              <span className="font-semibold text-purple-700">Other: </span>
              {defaultTranscript.other}
            </p>
            
            <p className="leading-relaxed text-gray-900">
              <span className="font-semibold text-blue-700">You: </span>
              {defaultTranscript.you2}
            </p>
            
            <p className="leading-relaxed text-gray-900">
              <span className="font-semibold text-purple-700">Other: </span>
              {defaultTranscript.other2}
            </p>
            
            <p className="leading-relaxed text-gray-900">
              <span className="font-semibold text-blue-700">You: </span>
              {defaultTranscript.you3}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

// Add speech feedback visual indicators
const SpeechFeedbackIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 mb-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i}
          className={`h-1.5 w-${i <= 3 ? '2' : '1.5'} rounded-full animate-pulse bg-blue-500`}
          style={{ 
            animationDelay: `${i * 0.15}s`,
            animationDuration: `${0.8 + (i * 0.1)}s` 
          }}
        />
      ))}
      <span className="ml-2 text-sm text-blue-600 flex items-center">
        <svg className="w-3 h-3 mr-1 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.34998 9.6499V11.3499C4.34998 15.5699 7.77998 18.9999 12 18.9999C16.22 18.9999 19.65 15.5699 19.65 11.3499V9.6499" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Processing speech...
      </span>
    </div>
  );
};

export default TranscriptBox;