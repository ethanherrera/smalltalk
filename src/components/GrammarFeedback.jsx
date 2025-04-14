import React from 'react';
import AudioPlayer from './AudioPlayer';
import { useAppContext } from '../context/AppContext';

function GrammarFeedback() {
  const { recordingData } = useAppContext();
  
  // Mock feedback data
  const grammarFeedback = [
    {
      id: 1,
      title: "Verb Conjugation",
      description: "Try using the subjunctive for expressing uncertainty—'Espero que podamos reunirnos' instead of 'Espero que podemos reunirnos'.",
      audioTime: "0:12/0:34",
      timestamp: 12
    },
    {
      id: 2,
      title: "Preposition Usage",
      description: "In Spanish, 'en' is used for locations rather than 'a'. Instead of 'Nos vemos a la oficina', say 'Nos vemos en la oficina'.",
      audioTime: "0:20/0:34",
      timestamp: 20
    },
    {
      id: 3,
      title: "Sentence Structure",
      description: "For smoother phrasing, consider 'Podemos coordinar la reunión para el viernes a las 3 PM' instead of 'Podemos para el viernes coordinar la reunión a las 3 PM'.",
      audioTime: "0:28/0:34",
      timestamp: 28
    }
  ];

  return (
    <div className="flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md">
        {grammarFeedback.map((feedback) => (
          <div key={feedback.id} className="mb-8">
            <h2 className="text-black font-semibold mb-1">{feedback.title}</h2>
            <p className="text-black mb-4">{feedback.description}</p>
            
            <div className="w-full h-[42px] border-2 border-[#D9D9D9] rounded-[20px] flex items-center justify-between px-4">
              <AudioPlayer 
                audioUrl={recordingData?.audio} 
                timestamp={feedback.timestamp}
                totalDuration={recordingData?.duration || 34}
                compact={true}
              />
              <span className="text-sm font-semibold text-[#111111]">{feedback.audioTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GrammarFeedback;