import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Start at 0 seconds
  const [duration, setDuration] = useState(0); // Will be updated with actual audio duration
  const [progress, setProgress] = useState(0); // Start with 0 progress
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  
  // Generate random scores between 1-5
  const scores = {
    pronunciation: 2,
    grammar: 3,
    terminology: 3,
    fluency: 4
  };

  const handleTimeUpdate = React.useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(Math.floor(audioRef.current.currentTime));
      // Ensure progress stays within bounds and handle invalid duration
      if (duration > 0 && isFinite(duration) && !isNaN(duration)) {
        const calculatedProgress = Math.min(Math.max((audioRef.current.currentTime / duration) * 100, 0), 100);
        setProgress(calculatedProgress);
      } else {
        setProgress(0);
      }
    }
  }, [duration]);
  
  const handleEnded = React.useCallback(() => {
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    // Get recorded audio from local storage if available
    const audioURL = localStorage.getItem('recordedAudioURL');
    
    const audio = new Audio();
    
    // Get the actual duration when metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
        console.log('Audio duration loaded:', audio.duration);
      } else {
        // Try to get stored duration from localStorage if available
        const storedDuration = localStorage.getItem('recordedAudioDuration');
        if (storedDuration && !isNaN(parseFloat(storedDuration)) && isFinite(parseFloat(storedDuration))) {
          setDuration(parseFloat(storedDuration));
          console.log('Using stored audio duration:', parseFloat(storedDuration));
        } else {
          // Only use a default as last resort
          setDuration(30); // Setting a default of 30 seconds if no better option
          console.log('No valid duration available, using default duration');
        }
      }
    });
    
    // Only set src if we actually have a recording
    if (audioURL) {
      audio.src = audioURL;
      audio.load(); // Force loading metadata to get duration
    } else {
      // Create a dummy audio context for simulation if no recording exists
      console.log('No recorded audio found, using fallback');
      // Define AudioContext with proper typing
      interface AudioContextWindow extends Window {
        webkitAudioContext?: typeof AudioContext;
      }
      const windowWithAudio = window as AudioContextWindow;
      const audioContext = new (window.AudioContext || windowWithAudio.webkitAudioContext || AudioContext)();
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.connect(audioContext.destination);
      setTimeout(() => oscillator.start(), 500);
      setTimeout(() => oscillator.stop(), 2000);
      
      // Set a default duration for the fallback audio
      setDuration(2); // 2 seconds for fallback audio
    };
    audioRef.current = audio;
    
    // Create local reference to the current audio element
    const currentAudio = audio;
    // Store the current interval reference for cleanup
    const currentIntervalRef = progressIntervalRef.current;
    
    // Set up event listeners
    currentAudio.addEventListener('timeupdate', handleTimeUpdate);
    currentAudio.addEventListener('ended', handleEnded);
    
    return () => {
      if (currentIntervalRef) {
        clearInterval(currentIntervalRef);
      }
      currentAudio.removeEventListener('timeupdate', handleTimeUpdate);
      currentAudio.removeEventListener('ended', handleEnded);
    };
  }, [handleTimeUpdate, handleEnded]);
  
  const formatTime = (timeInSeconds: number) => {
    // Handle invalid values
    if (!isFinite(timeInSeconds) || isNaN(timeInSeconds)) {
      return '0:00';
    }
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error('Error playing audio:', e));
      }
    }
  };
  
  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
      
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error('Error playing audio:', e));
      }
    }
  };
  
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPositionX = e.clientX - rect.left;
    const percentageClicked = clickPositionX / rect.width;
    
    const newTime = percentageClicked * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(Math.floor(newTime));
    setProgress(percentageClicked * 100);
  };

  const handleSpecificFeedback = (feedback: string) => {
    navigate(`/specific-feedback/${feedback}`);
  };
  
  const handlePractice = () => {
    navigate('/practice');
  };
  
  const handleViewAnnotatedScript = () => {
    navigate('/grammar-feedback');
  };
  
  return (
    <div className="flex flex-col gap-6 pb-32 p-6 bg-black min-h-screen">
      <div className="sticky top-0 z-10 bg-black flex items-center gap-2 py-4 mb-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/record')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-center flex-1 text-white">Feedback</h1>
      </div>
      
      <div className="flex flex-col gap-3 items-start bg-black p-4 rounded-xl border border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
        <h2 className="text-lg font-bold text-primary">Summary</h2>
        <p className="text-base text-left leading-relaxed text-white">
          Your conversation demonstrated strong <span className="font-semibold text-blue-400">fluency</span>, with accurate use of <span className="font-semibold text-green-400">common medical phrases</span>; however, minor grammar errors were detected in <span className="font-semibold text-yellow-400">verb conjugation</span> and <span className="font-semibold text-yellow-400">article usage</span>.
        </p>
      </div>
      
      <div className="flex flex-col gap-4 items-start mt-6">
        <h2 className="text-lg font-bold text-primary">Mistakes</h2>
        <div className="grid grid-cols-2 gap-4 w-full">
          <div 
            className="border-2 border-pink-100 rounded-2xl p-4 flex flex-col items-center justify-between h-40 shadow-sm bg-white hover:border-pink-300 hover:bg-pink-50 cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => handleSpecificFeedback("Pronunciation")}
          >
            <div className="text-5xl font-semibold text-pink-600 mt-auto">
              {scores.pronunciation}
            </div>
            <div className="text-pink-700 font-semibold mb-2">
              Pronunciation
            </div>
          </div>
          
          <div 
            className="border-2 border-yellow-100 rounded-2xl p-4 flex flex-col items-center justify-between h-40 shadow-sm bg-white hover:border-yellow-300 hover:bg-yellow-50 cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => handleSpecificFeedback("Grammar")}
          >
            <div className="text-5xl font-semibold text-yellow-600 mt-auto">
              {scores.grammar}
            </div>
            <div className="text-yellow-700 font-semibold mb-2">
              Grammar
            </div>
          </div>
          
          <div 
            className="border-2 border-green-100 rounded-2xl p-4 flex flex-col items-center justify-between h-40 shadow-sm bg-white hover:border-green-300 hover:bg-green-50 cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => handleSpecificFeedback("Terminology")}
          >
            <div className="text-5xl font-semibold text-green-600 mt-auto">
              {scores.terminology}
            </div>
            <div className="text-green-700 font-semibold mb-2">
              Terminology
            </div>
          </div>
          
          <div 
            className="border-2 border-blue-100 rounded-2xl p-4 flex flex-col items-center justify-between h-40 shadow-sm bg-white hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => handleSpecificFeedback("Fluency")}
          >
            <div className="text-5xl font-semibold text-blue-600 mt-auto">
              {scores.fluency}
            </div>
            <div className="text-blue-700 font-semibold mb-2">
              Fluency
            </div>
          </div>
        </div>
      </div>
      
      <Button
        className="w-full py-6 text-lg font-bold rounded-full bg-primary hover:bg-primary/90 text-white mt-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        onClick={handlePractice}
      >
        Practice Now
      </Button>
      
      <div className="flex flex-col gap-1 items-start mt-6">
        <h2 
          className="text-base font-bold border-b-2 border-primary inline-block cursor-pointer text-primary transition-all duration-300 hover:text-primary/80 hover:border-primary/80 hover:translate-x-1 flex items-center gap-1"
          onClick={handleViewAnnotatedScript}
        >
          View annotated script
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </h2>
      </div>
      
      <div className="flex items-center gap-4 p-4 mt-2 border-2 border-blue-200 rounded-full bg-black shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-1" />
          )}
        </Button>
        
        <div className="flex-1">
          <div 
            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
            onClick={handleProgressBarClick}
          >
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRestart}
          className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <RotateCcw className="h-4 w-4 text-gray-700" />
        </Button>
        
        <div className="text-sm font-medium text-white">
          {formatTime(currentTime)}/{formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;