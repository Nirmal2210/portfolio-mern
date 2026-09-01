import { useEffect, useRef } from 'react';

const STATS = [
  { label: 'Projects', count: 48 },
  { label: 'Years Exp.', count: 6 },
  { label: 'Awards', count: 12 },
  { label: '% Passion', count: 100 },
];

const SKILLS = [
  { name: 'WebGL / Three.js', w: 92 },
  { name: 'Creative JS / GSAP', w: 88 },
  { name: 'React / Next.js', w: 85 },
  { name: 'Blender / Cinema 4D', w: 78 },
  { name: 'GLSL Shaders', w: 70 },
  { name: 'Motion Design', w: 82 },
];

function StatCounter({ target }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let cur = 0;
            const step = target / 40;
            const iv = setInterval(() => {
              cur = Math.min(cur + step, target);
              el.textContent = Math.floor(cur);
              if (cur >= target) clearInterval(iv);
            }, 30);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <div className="stat-num" ref={ref}>0</div>;
}

function SkillBars() {
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-bar-fill').forEach((b) => {
              b.style.width = b.dataset.w + '%';
            });
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <ul className="skill-list" ref={listRef}>
      {SKILLS.map((s) => (
        <li className="skill-item" key={s.name}>
          <span className="skill-name">{s.name}</span>
          <div className="skill-bar">
            <div className="skill-bar-fill" data-w={s.w}></div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function About() {
  return (
    <section id="about">
      <div>
        <div className="section-label"><span className="section-num">01</span>About</div>
        <h2 className="reveal">WHO<br />AM I</h2>
        <p className="about-text reveal">
          I'm <strong>Nirmal Chaudhary</strong> — a developer crafting{' '}
          <strong>interactive digital experiences</strong> at the intersection of code and creativity.
          From real-time WebGL to motion-driven interfaces, I push pixels with purpose.<br /><br />
          Building <strong>award-worthy websites</strong> and <strong>CG art</strong> that
          blur the line between design and technology.
        </p>
        <div className="about-stats reveal">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <StatCounter target={s.count} />
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="about-right reveal">
        <div className="section-label"><span className="section-num">02</span>Skills</div>
        <SkillBars />
      </div>
    </section>
  );
}
