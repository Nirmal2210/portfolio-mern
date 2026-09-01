import { useEffect, useRef } from 'react';

export default function Cursor({ handModeActive, mousePos }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const posRef = useRef({ rx: window.innerWidth / 2, ry: window.innerHeight / 2 });

  useEffect(() => {
    let raf;
    const animate = () => {
      const { x, y } = mousePos.current;
      if (dotRef.current) {
        dotRef.current.style.left = x + 'px';
        dotRef.current.style.top = y + 'px';
      }
      const p = posRef.current;
      p.rx += (x - p.rx) * 0.12;
      p.ry += (y - p.ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = p.rx + 'px';
        ringRef.current.style.top = p.ry + 'px';
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [mousePos]);

  return (
    <>
      <div id="cursor">
        <div className="cur-dot" ref={dotRef}></div>
      </div>
      <div className="cur-ring" ref={ringRef}></div>
    </>
  );
}
