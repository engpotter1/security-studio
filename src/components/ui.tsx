import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, Copy } from "lucide-react";

/* ---------------- 3D tilt wrapper ---------------- */
export function Tilt({
  children,
  className = "",
  intensity = 9,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [intensity, -intensity]), { stiffness: 220, damping: 22 });
  const ry = useSpring(useTransform(mx, [0, 1], [-intensity, intensity]), { stiffness: 220, damping: 22 });
  const [hover, setHover] = useState(false);
  const gx = useTransform(mx, [0, 1], ["0%", "100%"]);
  const gy = useTransform(my, [0, 1], ["0%", "100%"]);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, #ffe9b0, transparent 62%)`;

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        mx.set(0.5);
        my.set(0.5);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      className={`tilt-card relative ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: hover ? 0.16 : 0,
            background: glareBg,
          }}
        />
      )}
    </motion.div>
  );
}

/* ---------------- scroll reveal ---------------- */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.8, 0.24, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- always-LTR formula box ---------------- */
export function FormulaBox({ text, caption, accent = "#F5B82E" }: { text: string; caption?: string; accent?: string }) {
  return (
    <div className="relative w-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[#070910]/85">
      <div className="absolute inset-y-0 start-0 w-[3px]" style={{ background: `linear-gradient(180deg, ${accent}, transparent)` }} />
      <div className="flex items-center gap-2 border-b border-white/5 px-3 sm:px-4 py-2">
        <span className="mono text-[10px] tracking-[0.22em] text-white/35">FORMULA</span>
        <span className="h-px flex-1 bg-gradient-to-r from-white/12 to-transparent" />
        <span className="mono text-[10px] tracking-[0.18em]" style={{ color: accent }}>
          LTR
        </span>
      </div>
      <pre
        dir="ltr"
        className="ltr mono w-full max-w-full overflow-x-auto px-4 sm:px-5 py-3.5 sm:py-4 text-[13px] sm:text-[15px] leading-7 whitespace-pre text-[#f4e9cf]"
        style={{ textShadow: `0 0 26px ${accent}44` }}
      >
        {text}
      </pre>
      {caption && <p dir="ltr" className="ltr border-t border-white/5 px-4 sm:px-5 py-2.5 text-[11.5px] sm:text-[12px] text-white/40">{caption}</p>}
    </div>
  );
}

/* ---------------- chip ---------------- */
export function Chip({
  children,
  color = "#F5B82E",
  filled = false,
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`chip mono ${className}`}
      style={
        filled
          ? { background: `${color}1f`, borderColor: `${color}66`, color }
          : { borderColor: `${color}33`, color: `${color}dd` }
      }
    >
      {children}
    </span>
  );
}

/* ---------------- section heading ---------------- */
export function SectionHead({
  kicker,
  title,
  accent = "#F5B82E",
  icon,
}: {
  kicker?: string;
  title: string;
  accent?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-4 sm:mb-5 flex w-full max-w-full items-center gap-2.5 sm:gap-3">
      {icon && (
        <span
          className="grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-xl border"
          style={{ borderColor: `${accent}44`, background: `${accent}14`, color: accent }}
        >
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1 sm:flex-initial">
        {kicker && <div className="section-label mb-0.5 truncate" style={{ color: accent }}>{kicker}</div>}
        <h3 className="truncate text-[17px] sm:text-[21px] font-bold tracking-tight text-white/95">{title}</h3>
      </div>
      <span className="rule-gold hidden flex-1 sm:block" />
    </div>
  );
}

/* ---------------- strength meter ---------------- */
export function StrengthMeter({ value, accent = "#F5B82E", max = 5 }: { value: number; accent?: string; max?: number }) {
  return (
    <div className="flex shrink-0 items-center gap-[4px] sm:gap-[5px]" title={`${value}/${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className="h-[13px] sm:h-[14px] w-[4.5px] sm:w-[5px] rounded-full transition-all duration-500"
          style={{
            background: i < value ? accent : "rgba(255,255,255,0.1)",
            boxShadow: i < value ? `0 0 10px ${accent}99` : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ---------------- copy button ---------------- */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-gold shrink-0 !px-2.5 sm:!px-3.5 !py-1.5 !text-[11px] sm:!text-[12.5px]"
      disabled={!value}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = value;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
        setDone(true);
        setTimeout(() => setDone(false), 1600);
      }}
    >
      {done ? <Check size={13} className="sm:w-[15px] sm:h-[15px]" /> : <Copy size={13} className="sm:w-[15px] sm:h-[15px]" />}
      <span>{done ? "✓" : label}</span>
    </button>
  );
}

/* ---------------- animated number ---------------- */
export function Stat({ value, label, accent = "#F5B82E" }: { value: string; label: string; accent?: string }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] px-3 sm:px-4 py-2.5 sm:py-3 transition-colors hover:border-white/15">
      <div className="mono text-[19px] sm:text-[22px] font-bold leading-none" style={{ color: accent }}>
        {value}
      </div>
      <div className="mt-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-white/40 truncate">{label}</div>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: accent }} />
    </div>
  );
}