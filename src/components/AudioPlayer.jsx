import React, { useState, useEffect, useRef } from 'react';

function AudioPlayer({ audioUrl, duration = 0, timestamp = 0, totalDuration = 0, compact = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(timestamp);
  const audioRef = useRef(null);
  const durationToUse = totalDuration > 0 ? totalDuration : duration;

  // Define event handlers outside of useEffect
  const updateTimeHandler = () => {
    if (audioRef.current) {
      setCurrentTime(Math.floor(audioRef.current.currentTime));
    }
  };
  
  const endedHandler = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };
  
  useEffect(() => {
    if (!audioUrl) return;
    
    // Clean up previous audio instance
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('timeupdate', updateTimeHandler);
      audioRef.current.removeEventListener('ended', endedHandler);
      
      // If it was a blob URL, revoke it
      if (audioRef.current.src && audioRef.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      audioRef.current.src = '';
    }
    
    let audio = new Audio();
    
    // Handle both URL strings and Blob objects
    if (typeof audioUrl === 'string') {
      audio.src = audioUrl;
    } else if (audioUrl instanceof Blob) {
      audio.src = URL.createObjectURL(audioUrl);
    } else {
      console.error('Unsupported audio format');
      return;
    }
    
    audioRef.current = audio;
    audio.addEventListener('timeupdate', updateTimeHandler);
    audio.addEventListener('ended', endedHandler);
    
    // If a timestamp is provided, seek to that position
    if (timestamp > 0) {
      audio.currentTime = timestamp;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateTimeHandler);
        audioRef.current.removeEventListener('ended', endedHandler);
        
        // If it was a blob URL, revoke it
        if (audioRef.current.src && audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current.src = '';
      }
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center ${compact ? 'gap-4' : 'gap-6'}`}>
      <button 
        onClick={togglePlayPause} 
        className={`text-black ${compact ? 'h-8 w-8' : 'h-12 w-12'} flex items-center justify-center border border-gray-300 rounded-full`}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      {!compact && (
        <div className="flex-1 h-2 bg-gray-300 rounded-full">
          <div 
            className="h-full bg-black rounded-full" 
            style={{ width: `${(currentTime / durationToUse) * 100}%` }}
          ></div>
        </div>
      )}
      
      {compact ? (
        <></>
      ) : (
        <span className="font-semibold text-lg text-[#111111]">
          {formatTime(currentTime)}/{formatTime(durationToUse)}
        </span>
      )}
    </div>
  );
}

export default AudioPlayer;