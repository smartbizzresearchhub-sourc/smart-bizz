import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { isLowPowerDevice, usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const causticTexture = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>
    <filter id='c' x='0' y='0'>
      <feTurbulence type='turbulence' baseFrequency='0.011 0.016' numOctaves='2' seed='7' stitchTiles='stitch'/>
      <feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -2.6 -2.6 -2.6 0 2.05'/>
      <feGaussianBlur stdDeviation='1.2'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#c)'/>
  </svg>`)}")`;

const rays = [
  [260, 90, 0],
  [560, 140, 2.5],
  [860, 110, 1.2],
  [1120, 160, 3.6],
  [1380, 100, 0.6],
];

const bands = [
  { top: "28%", dur: 34, op: 0.55, delay: 0 },
  { top: "55%", dur: 42, op: 0.45, delay: -12 },
  { top: "80%", dur: 50, op: 0.4, delay: -24 },
];

const surfacePath = (n) => {
  const y = 90 - n * 20;
  let d = `M0 ${y} Q100 ${55 - n * 20} 200 ${y}`;
  for (let x = 400; x <= 3200; x += 200) d += ` T${x} ${y}`;
  return `${d} V0 H0 Z`;
};

/** Rising bubbles drawn on a fixed full-screen canvas. */
function Bubbles() {
  const canvasRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const lowPower = isLowPowerDevice();
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5);
    const total = lowPower ? 10 : 18;
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = performance.now();

    const rand = (min, max) => min + Math.random() * (max - min);
    const spawn = (initial) => ({
      x: rand(0, width),
      y: initial ? rand(0, height) : height + rand(10, 60),
      r: rand(2, 6.5),
      v: rand(14, 34),
      ph: rand(0, Math.PI * 2),
      amp: rand(6, 18),
    });

    let bubbles = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bubbles = Array.from({ length: total }, () => spawn(true));
    };

    const draw = (time, dt) => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.y -= b.v * dt;
        const x = b.x + Math.sin(time / 1400 + b.ph) * b.amp;
        if (b.y < -20) bubbles[i] = spawn(false);
        const fade = Math.min(1, (height - b.y) / 160) * Math.min(1, b.y / 140);
        ctx.globalAlpha = Math.max(0, fade) * 0.9;
        ctx.beginPath();
        ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.28)";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(70,150,200,0.45)";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time) => {
      const dt = Math.min(0.05, (time - last) / 1000);
      last = time;
      draw(time, dt);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (reducedMotion || document.hidden) {
        draw(performance.now(), 0);
        return;
      }
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };

    resize();
    start();

    const onResize = () => {
      resize();
      start();
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", start);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", start);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0" />;
}

/** Fixed underwater backdrop behind the whole site. */
export default function OceanBackground() {
  const { scrollYProgress } = useScroll();
  const deepen = useTransform(scrollYProgress, [0, 1], [0, 0.55]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#F4FBFE_0%,#E3F4FB_30%,#D0EBF7_65%,#BFE2F2_100%)]" />
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(176,218,238,0)_0%,rgba(150,203,230,.55)_100%)]"
        style={{ opacity: deepen }}
      />
      <div className="absolute -top-[30vh] left-1/2 h-[80vh] w-[140vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse,rgba(255,255,255,.9),rgba(255,255,255,0)_65%)]" />

      {/* Light rays */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity=".75" />
            <stop offset=".7" stopColor="#FFFFFF" stopOpacity=".08" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="raysoft">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        <g filter="url(#raysoft)">
          {rays.map(([x, w, delay], i) => (
            <g
              key={i}
              className="ocean-ray"
              style={{ animationDelay: `${-delay * 3}s`, transformOrigin: `${x}px 0px` }}
            >
              <polygon
                points={`${x - w / 2},-20 ${x + w / 2},-20 ${x + w * 1.7 - 140},920 ${x - w * 0.6 - 140},920`}
                fill="url(#ray)"
              />
            </g>
          ))}
        </g>
      </svg>

      {/* Caustics */}
      <div
        className="ocean-caustic absolute -inset-[20%] opacity-[0.26]"
        style={{ backgroundImage: causticTexture, backgroundSize: "600px 600px" }}
      />
      <div
        className="ocean-caustic-2 absolute -inset-[20%] opacity-[0.16]"
        style={{ backgroundImage: causticTexture, backgroundSize: "820px 820px" }}
      />

      {/* Water surface */}
      <div className="absolute inset-x-0 top-0 h-[18vh] overflow-hidden opacity-70">
        {[0, 1].map((n) => (
          <svg
            key={n}
            viewBox="0 0 3200 160"
            preserveAspectRatio="none"
            className="ocean-surface absolute top-0 h-full w-[200%]"
            style={{
              animationDuration: `${26 + n * 14}s`,
              animationDirection: n ? "reverse" : "normal",
            }}
          >
            <path d={surfacePath(n)} fill="#FFFFFF" opacity={0.45 - n * 0.15} />
          </svg>
        ))}
      </div>

      {/* Drifting light bands */}
      {bands.map((band, i) => (
        <div
          key={i}
          className="ocean-band absolute left-0 h-[22vh] w-[200%]"
          style={{
            top: band.top,
            animationDuration: `${band.dur}s`,
            animationDelay: `${band.delay}s`,
            opacity: band.op,
          }}
        >
          <svg viewBox="0 0 3200 200" preserveAspectRatio="none" className="h-full w-full">
            <defs>
              <linearGradient id={`band${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset=".5" stopColor="#FFFFFF" stopOpacity=".55" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 100 C400 40 800 160 1200 100 S2000 40 2400 100 S2900 150 3200 100 V200 H0 Z"
              fill={`url(#band${i})`}
            />
          </svg>
        </div>
      ))}

      <Bubbles />
    </div>
  );
}
