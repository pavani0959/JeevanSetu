import { useEffect, useRef } from 'react';

/**
 * RainCanvas — animated rain-drop background
 * Draws subtle falling rain lines on a canvas to reinforce the flood/rain theme
 */
export default function RainCanvas({ intensity = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize canvas to fill window
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create drops
    const dropCount = Math.floor(80 * intensity);
    const drops = Array.from({ length: dropCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      len: 8 + Math.random() * 14,
      speed: 4 + Math.random() * 6,
      opacity: 0.15 + Math.random() * 0.35,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 0.8;

      drops.forEach(drop => {
        ctx.globalAlpha = drop.opacity;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + 2, drop.y + drop.len);
        ctx.stroke();

        drop.y += drop.speed;
        drop.x += 0.8;

        if (drop.y > canvas.height) {
          drop.y = -drop.len;
          drop.x = Math.random() * canvas.width;
        }
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      id="rain-canvas"
      aria-hidden="true"
    />
  );
}
