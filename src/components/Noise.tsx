import { useRef, useEffect } from 'react';

interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
}

const FRAME_COUNT = 10;
const CANVAS_SIZE = 256;

export default function Noise({
  patternAlpha = 15,
}: NoiseProps) {
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    // Pre-generate N offscreen frames once on mount
    const frames: ImageData[] = [];
    for (let f = 0; f < FRAME_COUNT; f++) {
      const imageData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = patternAlpha;
      }
      frames.push(imageData);
    }

    let currentFrame = 0;
    let intervalId: ReturnType<typeof setInterval>;

    // Cycle through pre-built frames — no per-frame pixel work
    intervalId = setInterval(() => {
      ctx.putImageData(frames[currentFrame], 0, 0);
      currentFrame = (currentFrame + 1) % FRAME_COUNT;
    }, 80); // ~12fps is plenty for grain effect

    return () => {
      clearInterval(intervalId);
    };
  }, [patternAlpha]);

  return (
    <canvas
      ref={grainRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        imageRendering: 'pixelated',
      }}
    />
  );
}
