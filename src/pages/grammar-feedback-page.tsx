import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for grammar feedback
const grammarFeedbackData = [
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
];

const GrammarFeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState<number[]>([30, 50, 70]); // Initial progress for each section
  const [currentTimes, setCurrentTimes] = useState<number[]>([12, 20, 28]); // Initial times in seconds
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([null, null, null]);
  const progressIntervalRefs = useRef<(number | null)[]>([null, null, null]);
  const duration = 34; // Total duration in seconds
  
  useEffect(() => {
    // Create audio elements for each section
    const audioElements = grammarFeedbackData.map(() => {
      const audio = new Audio('/sample-audio.mp3');
      return audio;
    });
    
    audioRefs.current = audioElements;
    
    // Store the current refs for cleanup
    const currentProgressIntervals = [...progressIntervalRefs.current];
    
    // Clean up on component unmount
    return () => {
      currentProgressIntervals.forEach(interval => {
        if (interval) clearInterval(interval);
      });
      audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handlePlayPause = (index: number) => {
    if (playingIndex === index) {
      // Pause current audio
      if (audioRefs.current[index]) {
        audioRefs.current[index]?.pause();
      }
      if (progressIntervalRefs.current[index]) {
        clearInterval(progressIntervalRefs.current[index] as number);
        progressIntervalRefs.current[index] = null;
      }
      setPlayingIndex(null);
    } else {
      // Pause any currently playing audio
      if (playingIndex !== null) {
        if (audioRefs.current[playingIndex]) {
          audioRefs.current[playingIndex]?.pause();
        }
        if (progressIntervalRefs.current[playingIndex]) {
          clearInterval(progressIntervalRefs.current[playingIndex] as number);
          progressIntervalRefs.current[playingIndex] = null;
        }
      }
      
      // Play the new audio
      if (audioRefs.current[index]) {
        const audio = audioRefs.current[index]!;
        audio.play().catch(e => console.error('Error playing audio:', e));
        
        // Update progress periodically
        progressIntervalRefs.current[index] = window.setInterval(() => {
          const newTime = audio.currentTime;
          const newProgress = (newTime / duration) * 100;
          
          setCurrentTimes(prev => {
            const updated = [...prev];
            updated[index] = newTime;
            return updated;
          });
          
          setProgress(prev => {
            const updated = [...prev];
            updated[index] = newProgress;
            return updated;
          });
          
          if (newTime >= duration) {
            if (progressIntervalRefs.current[index]) {
              clearInterval(progressIntervalRefs.current[index] as number);
              progressIntervalRefs.current[index] = null;
            }
            setPlayingIndex(null);
          }
        }, 100);
      }
      setPlayingIndex(index);
    }
  };
  
  const handleRestart = (index: number) => {
    if (audioRefs.current[index]) {
      audioRefs.current[index]!.currentTime = 0;
      
      setCurrentTimes(prev => {
        const updated = [...prev];
        updated[index] = 0;
        return updated;
      });
      
      setProgress(prev => {
        const updated = [...prev];
        updated[index] = 0;
        return updated;
      });
      
      if (playingIndex === index) {
        audioRefs.current[index]!.play().catch(e => console.error('Error playing audio:', e));
      }
    }
  };
  
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!audioRefs.current[index]) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPositionX = e.clientX - rect.left;
    const percentageClicked = clickPositionX / rect.width;
    
    const newTime = percentageClicked * duration;
    audioRefs.current[index]!.currentTime = newTime;
    
    setCurrentTimes(prev => {
      const updated = [...prev];
      updated[index] = newTime;
      return updated;
    });
    
    setProgress(prev => {
      const updated = [...prev];
      updated[index] = percentageClicked * 100;
      return updated;
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-32 p-6 min-h-screen">
      <div className="sticky top-0 z-10 bg-background flex items-center justify-between py-4 mb-2">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/feedback')}
            className="bg-black text-white hover:bg-gray-800 border border-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Grammar Feedback</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-sm bg-black text-white hover:bg-gray-800 border border-gray-700"
            onClick={() => navigate('/home')}
          >
            Home
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {grammarFeedbackData.map((item, index) => (
          <div key={index} className="flex flex-col gap-3 bg-black text-white p-5 rounded-xl border border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="mb-2">
              <h2 className="text-lg font-bold text-white">{item.title}</h2>
              <p className="text-base leading-relaxed mt-1">{item.description}</p>
            </div>
            
            <div className="flex items-center gap-4 p-3 mt-1 border border-gray-700 rounded-full bg-black text-white shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 transition-colors"
                onClick={() => handlePlayPause(index)}
              >
                {playingIndex === index ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              
              <div className="flex-1">
                <div 
                  className="w-full h-2 bg-gray-700 rounded-full cursor-pointer"
                  onClick={(e) => handleProgressBarClick(e, index)}
                >
                  <div 
                    className="h-full bg-gray-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress[index]}%` }}
                  ></div>
                </div>
                <div className="relative">
                  {/* Audio visualization - animated when playing */}
                  <div className="absolute inset-0 flex items-center justify-center space-x-1 mt-2">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 bg-gray-500 rounded-full transition-all duration-300 ${playingIndex === index ? 'animate-pulse' : ''}`}
                        style={{ 
                          height: playingIndex === index 
                            ? `${Math.random() * 12 + 5}px` 
                            : `${Math.sin(i/3) * 5 + 5}px`,
                          opacity: i < progress[index] / 5 ? 0.8 : 0.2,
                          maxHeight: '15px'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRestart(index)}
                className="h-8 w-8 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-colors"
              >
                <RotateCcw className="h-4 w-4 text-white" />
              </Button>
              
              <span className="text-sm font-medium text-white w-16 text-right">
                {formatTime(currentTimes[index])}/{formatTime(duration)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <Button
          className="bg-black text-white hover:bg-gray-800 border border-gray-700"
          onClick={() => navigate('/practice')}
        >
          Start Practice
        </Button>
      </div>
    </div>
  );
};

export default GrammarFeedbackPage;