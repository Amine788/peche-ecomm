import { useState, useEffect } from 'react';

interface ParallaxPos {
  x: number; // -1 to 1
  y: number; // -1 to 1
}

export function useMouseParallax(): ParallaxPos {
  const [pos, setPos] = useState<ParallaxPos>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return pos;
}
