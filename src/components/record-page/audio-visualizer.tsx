import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isRecording }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !isRecording) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = Date.now();

    const draw = () => {
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      // Draw multiple sine waves with different frequencies and phases
      ctx.beginPath();
      ctx.strokeStyle = '#8b5cf6'; 
      ctx.lineWidth = 2;

      for (let x = 0; x < canvas.width; x++) {
        const y = Math.sin((x + elapsed) * 0.02) * 20 + // Main wave
                 Math.sin((x + elapsed) * 0.01) * 10 + // Slower wave
                 Math.sin((x + elapsed) * 0.03) * 5; // Faster wave
        
        if (x === 0) {
          ctx.moveTo(x, canvas.height / 2 + y);
        } else {
          ctx.lineTo(x, canvas.height / 2 + y);
        }
      }

      ctx.stroke();
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRecording]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={100}
      className="w-full h-[100px] rounded-lg bg-muted/30"
    />
  );
};

export default AudioVisualizer; 