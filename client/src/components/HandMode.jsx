import { useEffect, useRef, useState } from 'react';

const CONN = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9],
  [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.crossOrigin = 'anonymous';
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

// mousePos: ref object { current: { x, y } } shared with Cursor/BgCanvas so
// hand-tracking can drive the pointer the same way real mouse movement does.
export default function HandMode({ mousePos }) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [statusErr, setStatusErr] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [pinching, setPinching] = useState(false);

  const handsRef = useRef(null);
  const camRef = useRef(null);
  const lastPinchRef = useRef(false);
  const lastPinchYRef = useRef(null);
  const clickCooldownRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('hand-mode', active);
  }, [active]);

  useEffect(() => {
    document.body.classList.toggle('pinching', pinching);
  }, [pinching]);

  const fireClick = (x, y) => {
    const rip = document.createElement('div');
    rip.className = 'pinch-ripple';
    rip.style.left = x + 'px';
    rip.style.top = y + 'px';
    document.body.appendChild(rip);
    setTimeout(() => rip.remove(), 500);

    const el = document.elementFromPoint(x, y);
    if (!el) return;
    const link = el.tagName === 'A' ? el : el.closest('a');
    const btn = el.tagName === 'BUTTON' ? el : el.closest('button');
    if (link) link.click();
    else if (btn) btn.click();
  };

  const onResults = (res) => {
    const hCtx = canvasRef.current.getContext('2d');
    hCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (!res.multiHandLandmarks || !res.multiHandLandmarks.length) {
      setStatusText('● HAND: SEARCHING…');
      setStatusErr(false);
      return;
    }

    const lm = res.multiHandLandmarks[0];
    const th = lm[4];
    const ix = lm[8];

    const thX = (1 - th.x) * window.innerWidth;
    const thY = th.y * window.innerHeight;
    const ixX = (1 - ix.x) * window.innerWidth;
    const ixY = ix.y * window.innerHeight;

    mousePos.current = { x: thX, y: thY };

    const dist = Math.hypot(th.x - ix.x, th.y - ix.y);
    const isPinching = dist < 0.065;
    setPinching(isPinching);

    if (isPinching && !lastPinchRef.current && !clickCooldownRef.current) {
      clickCooldownRef.current = true;
      fireClick(thX, thY);
      setTimeout(() => (clickCooldownRef.current = false), 420);
    }

    if (isPinching) {
      if (lastPinchYRef.current !== null) {
        const dy = thY - lastPinchYRef.current;
        if (Math.abs(dy) > 3) window.scrollBy(0, -dy * 2.5);
      }
      lastPinchYRef.current = thY;
    } else {
      lastPinchYRef.current = null;
    }
    lastPinchRef.current = isPinching;

    for (const [a, b] of CONN) {
      const ax = (1 - lm[a].x) * window.innerWidth;
      const ay = lm[a].y * window.innerHeight;
      const bx = (1 - lm[b].x) * window.innerWidth;
      const by = lm[b].y * window.innerHeight;
      hCtx.beginPath();
      hCtx.moveTo(ax, ay);
      hCtx.lineTo(bx, by);
      hCtx.strokeStyle = 'rgba(200,255,0,.2)';
      hCtx.lineWidth = 1;
      hCtx.stroke();
    }
    for (let i = 0; i < lm.length; i++) {
      const x = (1 - lm[i].x) * window.innerWidth;
      const y = lm[i].y * window.innerHeight;
      const highlight = i === 4 || i === 8;
      hCtx.beginPath();
      hCtx.arc(x, y, highlight ? 5 : 2.5, 0, Math.PI * 2);
      hCtx.fillStyle = highlight ? 'rgba(200,255,0,.9)' : 'rgba(200,255,0,.35)';
      hCtx.fill();
    }

    hCtx.beginPath();
    hCtx.moveTo(thX, thY);
    hCtx.lineTo(ixX, ixY);
    hCtx.strokeStyle = isPinching ? 'rgba(0,255,200,.7)' : 'rgba(200,255,0,.4)';
    hCtx.lineWidth = isPinching ? 2 : 1;
    hCtx.stroke();

    hCtx.beginPath();
    hCtx.arc(thX, thY, isPinching ? 9 : 13, 0, Math.PI * 2);
    hCtx.strokeStyle = isPinching ? '#00ffc8' : '#c8ff00';
    hCtx.lineWidth = 1.5;
    hCtx.stroke();
    if (isPinching) {
      hCtx.beginPath();
      hCtx.arc(thX, thY, 5, 0, Math.PI * 2);
      hCtx.fillStyle = 'rgba(0,255,200,.6)';
      hCtx.fill();
    }

    setStatusText(isPinching ? '● HAND: PINCH ✓  — SCROLLING' : '● HAND: READY — POINT TO INTERACT');
    setStatusErr(false);
  };

  const toggleHand = async () => {
    if (active) {
      setActive(false);
      setPinching(false);
      setStatusText('');
      if (camRef.current) {
        camRef.current.stop();
        camRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      const hCtx = canvasRef.current.getContext('2d');
      hCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      return;
    }

    setStatusText('● REQUESTING CAMERA…');
    setStatusErr(false);

    try {
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');

      if (!handsRef.current) {
        // eslint-disable-next-line no-undef
        handsRef.current = new Hands({
          locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
        });
        handsRef.current.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.6,
        });
        handsRef.current.onResults(onResults);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      videoRef.current.srcObject = stream;

      // eslint-disable-next-line no-undef
      camRef.current = new Camera(videoRef.current, {
        onFrame: async () => await handsRef.current.send({ image: videoRef.current }),
        width: 640,
        height: 480,
      });
      await camRef.current.start();

      setActive(true);
      setStatusText('● HAND MODE: ACTIVE — SHOW YOUR HAND');
    } catch (err) {
      console.error(err);
      setActive(false);
      setStatusText('● CAMERA ACCESS DENIED');
      setStatusErr(true);
      setTimeout(() => setStatusText(''), 3500);
    }
  };

  return (
    <>
      <canvas id="hand-canvas" ref={canvasRef} style={{ display: active ? 'block' : 'none' }}></canvas>
      <video
        id="hand-video"
        ref={videoRef}
        className={active ? 'on' : ''}
        autoPlay
        playsInline
        muted
      ></video>
      <div id="hand-status" className={statusText ? (statusErr ? 'on err' : 'on') : ''}>
        {statusText}
      </div>
      <div id="hand-ui">
        <button className={`hand-btn${active ? ' active' : ''}`} onClick={toggleHand}>
          Hand: {active ? 'On' : 'Off'}
        </button>
        <button
          className={`hand-btn${soundOn ? ' active' : ''}`}
          onClick={() => setSoundOn((s) => !s)}
        >
          Sound: {soundOn ? 'On' : 'Off'}
        </button>
      </div>
    </>
  );
}
