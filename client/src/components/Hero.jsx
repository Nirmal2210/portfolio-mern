import { useEffect, useRef, useState } from 'react';

export default function Hero({ mousePos }) {
  const canvasRef = useRef(null);
  const [frame, setFrame] = useState(0);
  const [coords, setCoords] = useState('X:0000 Y:0000');
  const heroRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hx = canvas.getContext('2d');
    let ht = 0;
    let fn = 0;
    let raf;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const points = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.001,
      vy: (Math.random() - 0.5) * 0.001,
      r: Math.random() * 2 + 0.5,
      a: Math.random(),
    }));

    const draw = () => {
      hx.fillStyle = 'rgba(5,5,5,.15)';
      hx.fillRect(0, 0, canvas.width, canvas.height);
      ht += 0.012;
      fn++;
      if (fn % 3 === 0) setFrame(fn);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x = (p.x + p.vx + 1) % 1;
        p.y = (p.y + p.vy + 1) % 1;
        const px = p.x * canvas.width;
        const py = p.y * canvas.height;
        for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          const d = Math.hypot(px - q.x * canvas.width, py - q.y * canvas.height);
          if (d < 80) {
            hx.strokeStyle = `rgba(200,255,0,${(1 - d / 80) * 0.15})`;
            hx.lineWidth = 0.5;
            hx.beginPath();
            hx.moveTo(px, py);
            hx.lineTo(q.x * canvas.width, q.y * canvas.height);
            hx.stroke();
          }
        }
        hx.fillStyle = `rgba(200,255,0,${((Math.sin(ht + p.a * 6) + 1) / 2) * 0.6 + 0.2})`;
        hx.beginPath();
        hx.arc(px, py, p.r, 0, Math.PI * 2);
        hx.fill();
      }

      hx.font = `bold ${canvas.width * 0.12}px 'Bebas Neue'`;
      hx.textAlign = 'center';
      hx.fillStyle = `rgba(200,255,0,${0.04 + Math.sin(ht) * 0.01})`;
      hx.fillText('NC', canvas.width / 2, canvas.height / 2 + canvas.width * 0.06);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleMouseMove = (e) => {
    const r = heroRef.current.getBoundingClientRect();
    const x = String(Math.round(e.clientX - r.left)).padStart(4, '0');
    const y = String(Math.round(e.clientY - r.top)).padStart(4, '0');
    setCoords(`X:${x} Y:${y}`);
  };

  return (
    <section id="hero" ref={heroRef} onMouseMove={handleMouseMove}>
      <div className="hero-left">
        <div className="hero-tag">// Interactive Developer &amp; CG Creator</div>
        <h1 className="hero-name glitch" data-text="NIRMAL CHAUDHARY">
          NIRMAL<br /><span>CHAUDHARY</span>
        </h1>
        <div className="hero-role">
          NAME: <strong>Nirmal Chaudhary</strong><br />
          ROLE: <strong>Developer</strong><br />
          FIELD: <strong>Interactive / Website / CG</strong><br />
          FROM: <strong>Nepal</strong>
        </div>
        <div className="hero-cta">
          <a href="#works" className="btn">View Works</a>
          <a href="#contact" className="btn btn-ghost">Contact</a>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-glitch-wrap">
          <div className="coords">{coords}</div>
          <div className="hero-frame">
            <canvas ref={canvasRef}></canvas>
            <div className="scan-line"></div>
            <div className="corner corner--tl"></div>
            <div className="corner corner--tr"></div>
            <div className="corner corner--bl"></div>
            <div className="corner corner--br"></div>
            <div className="frame-label">
              <span>NC_RENDER_01</span>
              <span>FRAME: {String(frame).padStart(4, '0')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
