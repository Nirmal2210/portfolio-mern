import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#works', label: 'Works' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [active, setActive] = useState('#hero');

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive('#' + e.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <nav>
      <a href="#hero" className="nav-logo">NC</a>
      <div className="nav-links">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className={active === l.href ? 'active' : ''}>
            {l.label}
          </a>
        ))}
      </div>
      <div className="nav-bottom">©2025</div>
    </nav>
  );
}
