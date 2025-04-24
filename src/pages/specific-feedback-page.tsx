import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SpecificFeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { feedback } = useParams();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  
  // Mock feedback data for each category
  const feedbackData = {
    Pronunciation: [
      {
        title: "Vowel Sounds",
        description: "Work on the distinction between 'e' and 'i' sounds. In words like 'siguiente' and 'paciente', you're using a more closed 'e' sound when it should be more open.",
        timestamp: "0:08/0:34"
      },
      {
        title: "Stress Patterns",
        description: "Remember that most Spanish words are stressed on the second-to-last syllable. You placed the stress on the first syllable in 'monitor' when it should be 'moniTOR'.",
        timestamp: "0:18/0:34"
      }
    ],
    Grammar: [
      {
        title: "Verb Conjugation",
        description: "Try using the subjunctive for expressing uncertainty—'Espero que podamos reunirnos' instead of 'Espero que podemos reunirnos'.",
        timestamp: "0:12/0:34"
      },
      {
        title: "Preposition Usage",
        description: "In Spanish, 'en' is used for locations rather than 'a'. Instead of 'Nos vemos a la oficina', say 'Nos vemos en la oficina'.",
        timestamp: "0:20/0:34"
      },
      {
        title: "Sentence Structure",
        description: "For smoother phrasing, consider 'Podemos coordinar la reunión para el viernes a las 3 PM' instead of 'Podemos para el viernes coordinar la reunión a las 3 PM'.",
        timestamp: "0:28/0:34"
      }
    ],
    Terminology: [
      {
        title: "Medical Vocabulary",
        description: "The term 'presión arterial' (blood pressure) was pronounced correctly, but 'niveles de oxígeno' should be 'niveles de oxígeno en la sangre' for complete medical accuracy.",
        timestamp: "0:15/0:34"
      },
      {
        title: "Technical Terms",
        description: "When discussing electronic medical records, the preferred term is 'historia clínica electrónica' rather than 'registros médicos electrónicos'.",
        timestamp: "0:22/0:34"
      }
    ],
    Fluency: [
      {
        title: "Speech Rate",
        description: "Your overall speaking pace is good, but you tend to slow down too much when encountering complex medical terminology. Try to maintain a more consistent pace.",
        timestamp: "0:10/0:34" 
      },
      {
        title: "Hesitation",
        description: "You used several filler words like 'um' and 'eh'. Practice speaking with fewer pauses by preparing phrases ahead of time.",
        timestamp: "0:25/0:34"
      }
    ]
  };
  
  const currentFeedback = feedback && feedback in feedbackData 
    ? feedbackData[feedback as keyof typeof feedbackData]
    : [];
  
  const handlePlayPause = (index: number) => {
    if (playingIndex === index) {
      setPlayingIndex(null);
    } else {
      setPlayingIndex(index);
    }
    // In a real implementation, this would control audio playback
  };
  
  return (
    <div className="flex flex-col gap-4 pb-32 p-10">
      <div className="sticky top-0 z-10 bg-background flex items-center gap-2 py-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/feedback')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-white">{feedback} Feedback</h1>
      </div>
      
      <div className="flex flex-col gap-8 mt-4">
        {currentFeedback.map((item, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-base">{item.description}</p>
            </div>
            
            <div className="flex items-center p-3 mt-2 border-2 border-gray-300 rounded-full">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => handlePlayPause(index)}
              >
                {playingIndex === index ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              
              <div className="flex-1 h-2 mx-4 bg-gray-200 rounded-full">
                <div className="relative">
                  {/* Audio visualization (static for now) */}
                  <div className="absolute inset-0 flex items-center space-x-1">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-black rounded-full"
                        style={{ 
                          height: `${Math.random() * 10 + 5}px`,
                          opacity: i < 8 ? 1 : 0.3
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <span className="text-sm font-semibold">{item.timestamp}</span>
            </div>
          </div>
        ))}
        
        {currentFeedback.length === 0 && (
          <p>No specific feedback available for {feedback}.</p>
        )}
      </div>
    </div>
  );
};

export default SpecificFeedbackPage;