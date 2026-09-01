import { useEffect, useRef } from 'react';

export default function BgCanvas({ mousePos }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let t = 0;
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.005;
      const { x: mx, y: my } = mousePos.current;
      for (let x = 0; x < canvas.width + 40; x += 40) {
        for (let y = 0; y < canvas.height + 40; y += 40) {
          const a = Math.max(
            0,
            0.08 - Math.hypot(x - mx, y - my) / 3000 + Math.sin(t + x * 0.02 + y * 0.02) * 0.02
          );
          ctx.fillStyle = `rgba(200,255,0,${a})`;
          ctx.fillRect(x - 1, y - 1, 1.5, 1.5);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [mousePos]);

  return <canvas id="bg-canvas" ref={canvasRef}></canvas>;
}
