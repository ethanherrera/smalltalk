import React from 'react';

interface Message {
  speaker: string;
  text: string;
}

const TranscriptBox: React.FC = () => {
  const sampleMessages: Message[] = [
    { speaker: 'You', text: 'Hello, how are you today?' },
    { speaker: 'Speaker 1', text: 'I\'m doing well, thank you for asking!' },
    { speaker: 'Speaker 2', text: 'Great to be here with everyone.' },
    { speaker: 'You', text: 'Shall we begin our discussion?' },
    { speaker: 'Speaker 1', text: 'Yes, let\'s get started.' },
  ];

  return (
    <div className="w-full flex flex-col items-center mt-4">
      <div className="w-[90%] max-w-3xl">
        <h2 className="text-xl font-semibold mb-3">Live Transcript</h2>
        <div 
          className="h-[60vh] overflow-y-auto border rounded-lg p-4 bg-muted/30"
        >
          <div className="flex flex-col items-start gap-4">
            {sampleMessages.map((message, index) => (
              <div key={index} className="flex flex-col items-start">
                <span className="font-medium text-primary">{message.speaker}:</span>
                <p className="pl-0">{message.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptBox; 