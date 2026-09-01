import { useEffect, useState } from 'react';

export default function Loader() {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(100, current + Math.random() * 8);
      setPct(Math.floor(current));
      if (current >= 100) {
        clearInterval(timer);
        setTimeout(() => setGone(true), 400);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="loader" className={gone ? 'gone' : ''}>
      <div className="load-label">// Initializing</div>
      <div className="load-line">&gt; Loading environment...</div>
      <div className="load-line">&gt; Setting up WebGL context...</div>
      <div className="load-line">&gt; Compiling shaders...</div>
      <div className="load-line">&gt; Mounting scene graph...</div>
      <div className="load-line">&gt; Ready.</div>
      <div className="load-bar-wrap"><div className="load-bar"></div></div>
      <div className="load-pct">{pct} / 100</div>
    </div>
  );
}
