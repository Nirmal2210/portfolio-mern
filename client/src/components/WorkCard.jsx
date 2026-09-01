import { useEffect, useRef } from 'react';

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

export default function WorkCard({ project }) {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const par = canvas.parentElement;
    canvas.width = par.clientWidth;
    canvas.height = par.clientHeight;
    const ctx = canvas.getContext('2d');
    const [r, g, b] = hexToRgb(project.color || 'c8ff00');
    const type = project.type;
    let t = 0;
    let raf;

    const draw = () => {
      ctx.fillStyle = 'rgba(5,5,5,.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      t += 0.02;

      if (type === 'particles') {
        for (let i = 0; i < 5; i++) {
          const x = (Math.sin(t * 0.7 + i * 1.3) * 0.4 + 0.5) * canvas.width;
          const y = (Math.cos(t * 0.5 + i * 2.1) * 0.4 + 0.5) * canvas.height;
          const s = 80 + Math.sin(t + i) * 40;
          const grad = ctx.createRadialGradient(x, y, 0, x, y, s);
          grad.addColorStop(0, `rgba(${r},${g},${b},.15)`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, s, 0, Math.PI * 2);
          ctx.fill();
        }
        for (let y2 = 0; y2 < canvas.height; y2 += 4) {
          ctx.fillStyle = 'rgba(0,0,0,.06)';
          ctx.fillRect(0, y2, canvas.width, 1);
        }
      } else if (type === 'grid') {
        for (let x2 = 0; x2 < canvas.width; x2 += 40) {
          for (let y2 = 0; y2 < canvas.height; y2 += 40) {
            ctx.strokeStyle = `rgba(${r},${g},${b},${((Math.sin(x2 * 0.05 + t) * Math.cos(y2 * 0.05 + t * 0.7) + 1) / 2) * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x2, y2, 40, 40);
          }
        }
      } else if (type === 'wave') {
        ctx.lineWidth = 1.5;
        for (let k = 0; k < 6; k++) {
          ctx.beginPath();
          for (let x2 = 0; x2 <= canvas.width; x2 += 2) {
            const y2 = canvas.height / 2 + Math.sin(x2 * 0.02 + t + k * 0.5) * (20 + k * 8);
            x2 === 0 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
          }
          ctx.globalAlpha = ((6 - k) / 6) * 0.6;
          ctx.strokeStyle = `rgba(${r},${g},${b},1)`;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      } else if (type === 'noise') {
        for (let i = 0; i < 60; i++) {
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.random() * 0.08})`;
          ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3, Math.random() * 3);
        }
        for (let i = 0; i < 3; i++) {
          const x = (Math.sin(t * 0.3 + i * 2) * 0.3 + 0.5) * canvas.width;
          const y = (Math.cos(t * 0.4 + i * 1.5) * 0.3 + 0.5) * canvas.height;
          const grad = ctx.createRadialGradient(x, y, 0, x, y, 60);
          grad.addColorStop(0, `rgba(${r},${g},${b},.12)`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else if (type === 'scan') {
        const lx = ((t * 0.3) % 1) * canvas.width;
        ctx.strokeStyle = `rgba(${r},${g},${b},.6)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, canvas.height);
        ctx.stroke();
        const grad = ctx.createLinearGradient(lx - 80, 0, lx, 0);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, `rgba(${r},${g},${b},.05)`);
        ctx.fillStyle = grad;
        ctx.fillRect(lx - 80, 0, 80, canvas.height);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      canvas.width = par.clientWidth;
      canvas.height = par.clientHeight;
    });
    ro.observe(par);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [project.color, project.type]);

  const CardTag = project.link ? 'a' : 'div';
  const linkProps = project.link ? { href: project.link, target: '_blank', rel: 'noreferrer' } : {};

  return (
    <CardTag
      className={`work-card reveal${project.large ? ' large' : ''}`}
      ref={cardRef}
      {...linkProps}
    >
      <canvas className="work-canvas" ref={canvasRef}></canvas>
      <div className="work-info">
        <div className="work-year">{project.year}</div>
        <div className="work-title glitch" data-text={project.title}>{project.title}</div>
        <div className="work-role">{project.role}</div>
      </div>
    </CardTag>
  );
}
