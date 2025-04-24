import React, { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
  audioElement?: HTMLAudioElement | null;
  recordingComplete?: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isRecording, audioElement }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [barCount] = useState(60); // Increased bar count for smoother visualization
  const [barWidth, setBarWidth] = useState(3);
  const [barGap, setBarGap] = useState(1); // Smaller gap for more continuous appearance
  const analysisRef = useRef<{ analyzer: AnalyserNode | null; dataArray: Uint8Array | null }>({ 
    analyzer: null, 
    dataArray: null 
  });

  // Set up Web Audio API for real-time visualization
  useEffect(() => {
    const animationId = 0;
    let audioContext: AudioContext | null = null;
    let analyserNode: AnalyserNode | null = null;
    let microphoneStream: MediaStream | null = null;
    let source: MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null = null;

    const initializeAudioAnalyser = async () => {
      try {
        // Create audio context with TypeScript-safe approach
        audioContext = new (window.AudioContext || 
          ((window as Window & typeof globalThis & { webkitAudioContext?: AudioContext }).webkitAudioContext))();
        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 256; // Power of 2, controls the frequency data array size
        analyserNode.smoothingTimeConstant = 0.8; // Makes transitions smoother
        
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Store in ref for animation access
        analysisRef.current = {
          analyzer: analyserNode,
          dataArray: dataArray
        };

        if (isRecording) {
          // Get microphone stream for recording mode
          microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          source = audioContext.createMediaStreamSource(microphoneStream);
        } else if (audioElement && audioElement.src) {
          // Use audio element for playback visualization
          source = audioContext.createMediaElementSource(audioElement);
          // Connect to destination so we can hear it (only for playback, not for recording)
          source.connect(audioContext.destination);
        }

        // Connect source to analyser if we have a source
        if (source) {
          source.connect(analyserNode);
        }
      } catch (error) {
        console.error('Error initializing audio analyzer:', error);
      }
    };

    // Only initialize if recording or we have an audio element to visualize
    if (isRecording || (audioElement && audioElement.src)) {
      initializeAudioAnalyser();
    }

    return () => {
      // Clean up audio resources
      if (audioContext) {
        audioContext.close().catch(err => console.error('Error closing audio context:', err));
      }
      if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isRecording, audioElement]);  // Add audioElement as dependency

  // Drawing animation
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get dimensions and adjust for device pixel ratio
    const width = canvas.width;
    const height = canvas.height;
    
    // Update bar dimensions based on canvas size
    setBarWidth(Math.max(2, (width / barCount) * 0.6));
    setBarGap(Math.max(1, (width / barCount) * 0.4));

    let animationId = 0;
    const bars: number[] = Array(barCount).fill(0);
    
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Check if we have active analyzer data (either from recording or audio playback)
      const hasAnalyzerData = analysisRef.current.analyzer && analysisRef.current.dataArray;
      
      if (hasAnalyzerData) {
        // Get real-time frequency data
        analysisRef.current.analyzer!.getByteFrequencyData(analysisRef.current.dataArray!);
        const dataArray = analysisRef.current.dataArray!;
        
        // Draw bars based on audio frequency data
        const totalBarWidth = barWidth + barGap;
        const totalWidth = barCount * totalBarWidth - barGap;
        const startX = (width - totalWidth) / 2;
        
        // Choose color based on recording state
        ctx.fillStyle = isRecording ? '#FF4557' : '#4C87FF'; // Red for recording, Blue for playback
        
        for (let i = 0; i < barCount; i++) {
          // Use real audio data with frequency distribution
          // Sample the frequency data with an exponential distribution to emphasize bass/mid frequencies
          const frequencyIndex = Math.min(
            Math.floor(Math.pow(i / barCount, 2) * dataArray.length),
            dataArray.length - 1
          );
          
          // Map frequency data (0-255) to bar height
          let targetHeight = (dataArray[frequencyIndex] / 255) * height * 0.8;
          
          // Add slight randomness for more natural look when sound is very quiet
          if (targetHeight < 2) targetHeight += Math.random() * 2;
          
          // Smooth transition between values (slower for larger changes)
          const changeSpeed = 0.3;
          bars[i] = bars[i] + (targetHeight - bars[i]) * changeSpeed;
          
          const x = startX + i * (barWidth + barGap);
          const barHeight = Math.max(2, bars[i]); // Ensure minimum visibility
          const y = height / 2 - barHeight / 2;
          
          // Draw with slight rounding for smoother look
          ctx.beginPath();
          // Use fillRect instead of roundRect since it's not widely supported
          ctx.fillRect(x, y, barWidth, barHeight);
          ctx.fill();
        }
      } else {
        // For inactive state, animate gentle waves instead of flat line
        ctx.strokeStyle = '#757575';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        
        const amplitude = height * 0.05;
        const frequency = 0.05;
        const phase = Date.now() * 0.002; // Moving phase for animation
        
        ctx.moveTo(0, height / 2);
        
        for (let x = 0; x < width; x += 3) { // Smoother curve with smaller steps
          const y = height / 2 + Math.sin(x * frequency + phase) * amplitude;
          ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      }
      
      animationId = requestAnimationFrame(render);
    };
    
    // Start rendering
    render();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isRecording, barCount, barWidth, barGap]);

  return (
    <canvas 
      ref={canvasRef} 
      width={600} 
      height={50} 
      className="w-full h-[50px]"
    />
  );
};

export default AudioVisualizer;