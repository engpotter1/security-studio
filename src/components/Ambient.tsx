import { useEffect, useRef } from "react";

type P = { x: number; y: number; vx: number; vy: number; r: number };

/**
 * Ambient layer: particle network + gold horizon glows + isometric grid.
 * Sits behind everything and reacts subtly to the pointer.
 */
export default function Ambient({ accent = "#F5B82E" }: { accent?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const accentRef = useRef(accent);
  accentRef.current = accent;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: P[] = [];
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;

    const seed = () => {
      const count = Math.max(34, Math.min(84, Math.round((w * h) / 26000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.5 + 0.5,
      }));
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const hexToRgb = (hex: string) => {
      const n = parseInt(hex.replace("#", ""), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const [cr, cg, cb] = hexToRgb(accentRef.current);

      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;

          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 16000 && d2 > 0.01) {
            const f = 1 - d2 / 16000;
            p.x += (dx / Math.sqrt(d2)) * f * 0.9;
            p.y += (dy / Math.sqrt(d2)) * f * 0.9;
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < 145) {
            const alpha = (1 - d / 145) * 0.2;
            ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.fillStyle = `rgba(${cr},${cg},${cb},0.5)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0B0D14]">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div
        className="anim-flicker absolute -top-[22vh] start-[8vw] h-[60vh] w-[60vw] rounded-full opacity-[0.16] blur-[130px]"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 68%)` }}
      />
      <div
        className="absolute bottom-[-24vh] end-[-10vw] h-[62vh] w-[52vw] rounded-full opacity-[0.12] blur-[140px]"
        style={{ background: "radial-gradient(circle, #57B8FF, transparent 70%)" }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F5B82E]/35 to-transparent" />
      <canvas ref={ref} className="absolute inset-0" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 0%, transparent 40%, rgba(4,5,9,0.82) 100%)" }} />
    </div>
  );
}
