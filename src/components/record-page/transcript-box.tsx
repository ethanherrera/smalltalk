import React from 'react';

interface Message {
  speaker: string;
  text: string;
}

const TranscriptBox: React.FC = () => {
  const sampleMessages: Message[] = [
    { speaker: 'Tú',      text: '¡Hola! ¿Cómo estás hoy?' },
    { speaker: 'Orador 1', text: 'Estoy bien, ¡gracias por preguntar!' },
    { speaker: 'Orador 2', text: 'Es genial estar aquí con todos.' },
    { speaker: 'Tú',      text: '¿Deberíamos comenzar nuestra discusión?' },
    { speaker: 'Orador 1', text: 'Sí, empecemos.' },
  ];

  // 2. Map each speaker to a Tailwind text color
  const speakerColors: Record<string, string> = {
    Tú:         'text-purple-500',
    'Orador 1': 'text-green-500',
    'Orador 2': 'text-blue-500',
  };

  return (
    <div className="w-full flex flex-col items-start mt-4">
      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-3 text-center">Transcript</h2>
        <div className="h-[60vh] overflow-y-auto border rounded-lg p-4 bg-muted/30">
          <div className="flex flex-col items-start gap-4">
            {sampleMessages.map((message, index) => {
              const nameClass = speakerColors[message.speaker] ?? 'text-primary';
              return (
                <div key={index} className="flex flex-col items-start text-left">
                  <span className={`${nameClass} font-medium`}>
                    {message.speaker}:
                  </span>
                  <p className="mt-1">{message.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptBox;
