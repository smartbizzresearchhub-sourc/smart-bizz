import { useEffect, useRef } from "react";
import { isLowPowerDevice, usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Lightweight canvas particle layer.
 * mode: "float" | "rise" | "fall" | "erupt" | "twinkle" | "network"
 */
export default function ParticleField({
  mode = "float",
  colors = ["#D6A84B"],
  count = 60,
  speed = 1,
  size = [0.6, 2.2],
  origin = [0.5, 0.5],
  active = true,
  className = "",
  glow = true,
}) {
  const canvasRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lowPower = isLowPowerDevice();
    const total = Math.max(8, Math.round(count * (lowPower ? 0.45 : 1)));
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5);

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let last = performance.now();

    const rand = (min, max) => min + Math.random() * (max - min);
    const pickColor = () => colors[Math.floor(Math.random() * colors.length)];

    const spawn = (initial) => {
      const p = {
        x: rand(0, width),
        y: rand(0, height),
        vx: 0,
        vy: 0,
        r: rand(size[0], size[1]),
        c: pickColor(),
        a: rand(0.3, 1),
        phase: rand(0, Math.PI * 2),
        life: 0,
        maxLife: rand(4, 9),
      };
      switch (mode) {
        case "rise":
          p.y = initial ? rand(0, height) : height + 10;
          p.vx = rand(-0.15, 0.15);
          p.vy = -rand(0.25, 0.9);
          break;
        case "fall":
          p.y = initial ? rand(0, height) : -10;
          p.vx = rand(-0.2, 0.2);
          p.vy = rand(0.15, 0.5);
          break;
        case "erupt": {
          p.x = origin[0] * width + rand(-6, 6);
          p.y = origin[1] * height;
          const angle = -Math.PI / 2 + rand(-0.45, 0.45);
          const velocity = rand(1.2, 3.2);
          p.vx = Math.cos(angle) * velocity;
          p.vy = Math.sin(angle) * velocity;
          p.maxLife = rand(2.2, 4.2);
          if (initial) p.life = rand(0, p.maxLife);
          break;
        }
        case "twinkle":
          p.vx = rand(-0.02, 0.02);
          p.vy = rand(-0.02, 0.02);
          break;
        case "network":
          p.vx = rand(-0.25, 0.25);
          p.vy = rand(-0.25, 0.25);
          break;
        default:
          p.vx = rand(-0.18, 0.18);
          p.vy = rand(-0.22, 0.06);
      }
      return p;
    };

    let particles = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: total }, () => spawn(true));
    };

    const draw = (time, dt) => {
      ctx.clearRect(0, 0, width, height);
      const step = speed * dt * 60;

      if (mode === "network") {
        const maxDist = Math.min(150, width * 0.14);
        ctx.lineWidth = 0.6;
        for (let i = 0; i < particles.length; i++)
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < maxDist) {
              ctx.strokeStyle = particles[i].c;
              ctx.globalAlpha = (1 - dist / maxDist) * 0.35;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * step;
        p.y += p.vy * step;
        let alpha = p.a;

        if (mode === "erupt") {
          p.vy += 0.035 * step;
          p.life += dt;
          const progress = p.life / p.maxLife;
          alpha = Math.max(0, 1 - progress) * p.a;
          if (progress >= 1) particles[i] = spawn(false);
        } else if (mode === "twinkle") {
          alpha = p.a * (0.45 + 0.55 * Math.sin(time * 0.0015 + p.phase) ** 2);
        } else if (mode === "rise" || mode === "float") {
          p.x += Math.sin(time * 0.001 + p.phase) * 0.15 * step;
        }

        if (mode !== "erupt" && (p.y < -12 || p.y > height + 12 || p.x < -12 || p.x > width + 12)) {
          if (mode === "network" || mode === "twinkle") {
            p.x = (p.x + width) % width;
            p.y = (p.y + height) % height;
          } else {
            particles[i] = spawn(false);
          }
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.c;
        if (glow) {
          ctx.shadowBlur = p.r * 5;
          ctx.shadowColor = p.c;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
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
      if (reducedMotion || !active || !visible) {
        draw(performance.now(), 0);
        return;
      }
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };

    resize();
    start();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      start();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        start();
      },
      { rootMargin: "100px" },
    );
    intersectionObserver.observe(canvas);

    const onVisibility = () => {
      visible = !document.hidden;
      start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, count, speed, active, reducedMotion, origin[0], origin[1]]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
