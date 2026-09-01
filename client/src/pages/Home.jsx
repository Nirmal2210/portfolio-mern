import { useRef } from 'react';
import Cursor from '../components/Cursor';
import Loader from '../components/Loader';
import Nav from '../components/Nav';
import BgCanvas from '../components/BgCanvas';
import Hero from '../components/Hero';
import About from '../components/About';
import Works from '../components/Works';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import HandMode from '../components/HandMode';

export default function Home() {
  // Shared mutable pointer position - read by Cursor, BgCanvas, and written
  // to by both real mouse movement and MediaPipe hand tracking.
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const handleMouseMove = (e) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <Cursor mousePos={mousePos} />
      <Loader />
      <BgCanvas mousePos={mousePos} />
      <HandMode mousePos={mousePos} />

      <Nav />

      <main>
        <Hero mousePos={mousePos} />
        <About />
        <Works />
        <Contact />
      </main>

      <Footer />

      <div className="scroll-ind">
        <div className="scroll-text">Scroll</div>
        <div className="scroll-line"></div>
      </div>
    </div>
  );
}
