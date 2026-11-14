import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ALPHABET, mod, type ColumnarLayout, type PlayfairGrid } from "../lib/ciphers";

const cap = (s: string, n: number) => (s.length > n ? s.slice(0, n) : s);

/* ========================= Caesar / ROT13 wheel ========================= */
export function CaesarWheel({ shift, accent, hot }: { shift: number; accent: string; hot?: string }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 20;
  const r = R - 40;
  const step = 360 / 26;

  return (
    <div className="w-full max-w-full overflow-hidden">
      <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto block w-full max-w-[260px] sm:max-w-[300px]">
        <defs>
          <radialGradient id="disc" cx="50%" cy="38%">
            <stop offset="0%" stopColor="#1d2433" />
            <stop offset="100%" stopColor="#0a0d15" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={R + 12} fill="url(#disc)" stroke="rgba(255,255,255,0.07)" />
        <circle cx={cx} cy={cy} r={r - 16} fill="none" stroke={`${accent}22`} strokeDasharray="2 6" className="anim-spin-slow" style={{ transformBox: "view-box", transformOrigin: "50% 50%" }} />

        {ALPHABET.split("").map((ch, i) => {
          const a = ((i * step - 90) * Math.PI) / 180;
          const on = hot?.toUpperCase() === ch;
          return (
            <text
              key={`o${i}`}
              x={cx + Math.cos(a) * R}
              y={cy + Math.sin(a) * R + 4}
              textAnchor="middle"
              className="mono"
              fontSize={on ? 13 : 10}
              fontWeight={on ? 800 : 500}
              fill={on ? "#fff" : "rgba(255,255,255,0.55)"}
            >
              {ch}
            </text>
          );
        })}

        <motion.g
          animate={{ rotate: -shift * step }}
          transition={{ type: "spring", stiffness: 70, damping: 15 }}
          style={{ transformBox: "view-box", transformOrigin: "50% 50%" }}
        >
          <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={`${accent}55`} strokeWidth={1.4} />
          {ALPHABET.split("").map((ch, i) => {
            const a = ((i * step - 90) * Math.PI) / 180;
            return (
              <g key={`i${i}`}>
                <circle cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={9} fill={`${accent}18`} stroke={`${accent}55`} />
                <text
                  x={cx + Math.cos(a) * r}
                  y={cy + Math.sin(a) * r + 4}
                  textAnchor="middle"
                  className="mono"
                  fontSize={10}
                  fontWeight={700}
                  fill={accent}
                >
                  {ch}
                </text>
              </g>
            );
          })}
        </motion.g>

        <text x={cx} y={cy - 4} textAnchor="middle" className="mono" fontSize={26} fontWeight={800} fill={accent}>
          {shift}
        </text>
        <text x={cx} y={cy + 15} textAnchor="middle" className="mono" fontSize={9} letterSpacing="2" fill="rgba(255,255,255,0.35)">
          SHIFT
        </text>
      </svg>
    </div>
  );
}

/* ========================= Atbash mirror ========================= */
export function AtbashMirror({ accent }: { accent: string }) {
  const w = 560;
  const top = ALPHABET.split("");
  return (
    <div className="w-full max-w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} 118`} className="block w-full min-w-[460px]">
        <line x1={10} y1={59} x2={w - 10} y2={59} stroke={`${accent}33`} strokeDasharray="4 6" className="anim-dash" />
        {top.map((ch, i) => {
          const x = 18 + (i * (w - 36)) / 25;
          const mirror = ALPHABET[25 - i];
          return (
            <g key={i}>
              <motion.line
                x1={x}
                y1={30}
                x2={x}
                y2={88}
                stroke={`${accent}22`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.02, duration: 0.4 }}
              />
              <text x={x} y={22} textAnchor="middle" className="mono" fontSize={11} fontWeight={700} fill="rgba(255,255,255,0.72)">
                {ch}
              </text>
              <text x={x} y={106} textAnchor="middle" className="mono" fontSize={11} fontWeight={700} fill={accent}>
                {mirror}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ========================= Vigenère key stream ========================= */
export function VigenereStream({ text, keyword, accent, mode }: { text: string; keyword: string; accent: string; mode: "encrypt" | "decrypt" }) {
  const chars = cap(text.replace(/\s+/g, " "), 34).split("");
  const kw = keyword.toUpperCase().replace(/[^A-Z]/g, "") || "A";
  let k = 0;
  return (
    <div className="w-full max-w-full overflow-x-auto pb-1">
      <div dir="ltr" className="ltr flex w-max gap-[3px]">
        {chars.map((ch, i) => {
          const isA = /[A-Za-z]/.test(ch);
          const kc = isA ? kw[k++ % kw.length] : "";
          const s = isA ? ALPHABET.indexOf(kc) : -1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.5) }}
              className="flex w-[26px] shrink-0 flex-col items-center gap-1"
            >
              <span className="mono text-[13px] font-bold text-white/90">{ch === " " ? "␣" : ch}</span>
              <span className="mono grid h-[22px] w-full place-items-center rounded-[5px] text-[11px] font-bold" style={{ background: isA ? `${accent}1c` : "transparent", color: isA ? accent : "transparent", border: isA ? `1px solid ${accent}44` : "1px solid transparent" }}>
                {isA ? kc : "·"}
              </span>
              <span className="mono text-[9px] text-white/30">{isA ? (mode === "decrypt" ? `−${s}` : `+${s}`) : ""}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ========================= Playfair grid ========================= */
export function PlayfairGridViz({ grid, text, mode, accent }: { grid: PlayfairGrid; text: string; mode: "encrypt" | "decrypt"; accent: string }) {
  const prepared = useMemo(() => {
    let clean = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "").split("");
    if (mode === "encrypt") {
      const out: string[] = [];
      let i = 0;
      while (i < clean.length) {
        const a = clean[i];
        const b = clean[i + 1];
        out.push(a);
        if (b === undefined || a === b) {
          out.push(a === "X" ? "Q" : "X");
          i += 1;
        } else {
          out.push(b);
          i += 2;
        }
      }
      clean = out;
    } else if (clean.length % 2 === 1) clean.push("X");
    const pairs: string[][] = [];
    for (let i = 0; i < clean.length; i += 2) pairs.push([clean[i], clean[i + 1]]);
    return pairs.slice(0, 14);
  }, [text, mode]);

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (prepared.length <= 1) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % prepared.length), 1400);
    return () => clearInterval(t);
  }, [prepared.length]);

  const pair = prepared[Math.min(idx, prepared.length - 1)];
  if (!pair) return <div className="mono text-center text-xs text-white/30">A–Z only</div>;
  const [r1, c1] = grid.pos[pair[0]];
  const [r2, c2] = grid.pos[pair[1]];
  const rule = r1 === r2 ? "sameRow" : c1 === c2 ? "sameCol" : "rectangle";

  return (
    <div className="flex w-full max-w-full flex-col items-center gap-3 overflow-hidden">
      <div dir="ltr" className="ltr relative grid grid-cols-5 gap-[5px] sm:gap-[6px]">
        {grid.cells.map((c, i) => {
          const r = Math.floor(i / 5);
          const col = i % 5;
          const isA = c === pair[0];
          const isB = c === pair[1];
          const inRow = r === r1 || r === r2;
          const inCol = col === c1 || col === c2;
          return (
            <motion.div
              key={c}
              data-hot={isA || isB}
              data-warm={!isA && !isB && rule === "rectangle" && inRow && inCol}
              className="cell-tile h-[42px] w-[42px] text-[14px] sm:h-[52px] sm:w-[52px] sm:text-[17px]"
              animate={isA || isB ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ duration: 0.6 }}
              style={isA || isB ? { boxShadow: `0 0 26px -4px ${accent}` } : undefined}
            >
              {c}
              {isA && <span className="absolute -top-1.5 -start-1.5 mono text-[9px]" style={{ color: accent }}>1</span>}
              {isB && <span className="absolute -bottom-1.5 -end-1.5 mono text-[9px]" style={{ color: accent }}>2</span>}
            </motion.div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <AnimatePresence mode="wait">
          <motion.span
            key={pair.join("") + rule}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mono rounded-lg px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-[12px] font-bold text-center"
            style={{ background: `${accent}18`, border: `1px solid ${accent}55`, color: accent }}
          >
            {pair.join("")} · {rule === "sameRow" ? "same row → right" : rule === "sameCol" ? "same column → down" : "rectangle → swap columns"}
          </motion.span>
        </AnimatePresence>
        <div className="mono flex flex-wrap justify-center gap-1">
          {prepared.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="h-1.5 w-3.5 sm:w-4 rounded-full transition-all"
              style={{ background: i === idx ? accent : "rgba(255,255,255,0.14)" }}
              aria-label={`pair ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ========================= Rail fence ========================= */
export function RailFenceViz({ text, rails, offset, accent, mode }: { text: string; rails: number; offset: number; accent: string; mode: "encrypt" | "decrypt" }) {
  const chars = cap(text, 46).split("");
  const k = Math.max(2, Math.min(9, rails));
  const cycle = 2 * (k - 1);
  const railOfChar = (i: number) => {
    const p = mod(i + offset, cycle);
    return p < k ? p : cycle - p;
  };
  const colW = 26;
  const rowH = 34;
  const w = Math.max(chars.length * colW + 20, 200);
  const h = (k - 1) * rowH + 40;
  const pts = chars.map((_, i) => [10 + i * colW + colW / 2, 20 + railOfChar(i) * rowH] as const);

  const order = mode === "encrypt"
    ? Array.from({ length: k }, (_, r) => chars.map((c, i) => ({ c, i })).filter((o) => railOfChar(o.i) === r)).flat()
    : chars.map((c, i) => ({ c, i }));

  return (
    <div className="ltr w-full max-w-full overflow-x-auto" dir="ltr">
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: w, height: h }}>
        {Array.from({ length: k }).map((_, r) => (
          <g key={r}>
            <line x1={0} y1={20 + r * rowH} x2={w} y2={20 + r * rowH} stroke="rgba(255,255,255,0.07)" />
            <text x={2} y={20 + r * rowH - 6} className="mono" fontSize={8} fill="rgba(255,255,255,0.28)">RAIL {r + 1}</text>
          </g>
        ))}
        <motion.polyline
          points={pts.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke={accent}
          strokeWidth={1.6}
          strokeOpacity={0.55}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        {pts.map(([x, y], i) => {
          const readAt = order.findIndex((o) => o.i === i);
          return (
            <motion.g key={i} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.02 * i }}>
              <circle cx={x} cy={y} r={11} fill="#0d1220" stroke={`${accent}66`} />
              <text x={x} y={y + 4} textAnchor="middle" className="mono" fontSize={11} fontWeight={700} fill="#fff">
                {chars[i] === " " ? "␣" : chars[i]}
              </text>
              <text x={x} y={y - 15} textAnchor="middle" className="mono" fontSize={7} fill="rgba(255,255,255,0.35)">
                {readAt + 1}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

/* ========================= Columnar grid ========================= */
export function ColumnarViz({ layout, keyword, accent }: { layout: ColumnarLayout; keyword: string; accent: string }) {
  const kw = keyword.toUpperCase().replace(/[^A-Z]/g, "");
  const [step, setStep] = useState(-1);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % (layout.cols + 1)), 1300);
    return () => clearInterval(t);
  }, [layout.cols]);
  const activeCol = step >= 0 && step < layout.cols ? layout.order[step] : -1;

  return (
    <div className="w-full max-w-full overflow-x-auto">
      <div dir="ltr" className="ltr inline-block min-w-full">
        <div className="grid gap-[5px]" style={{ gridTemplateColumns: `repeat(${layout.cols}, minmax(30px, 1fr))` }}>
          {Array.from({ length: layout.cols }).map((_, c) => (
            <div key={`h${c}`} className="flex flex-col items-center gap-1">
              <span className="mono text-[11px] font-bold text-white/70">{kw[c] ?? "·"}</span>
              <motion.span
                className="mono grid h-[19px] w-[19px] place-items-center rounded-full text-[10px] font-bold"
                animate={{ background: c === activeCol ? accent : `${accent}18`, color: c === activeCol ? "#141003" : accent, scale: c === activeCol ? 1.15 : 1 }}
              >
                {layout.readOrder[c]}
              </motion.span>
            </div>
          ))}
          {layout.grid.map((row, r) =>
            row.map((cell, c) => (
              <motion.div
                key={`${r}-${c}`}
                className="cell-tile h-[34px] text-[13px]"
                data-warm={c === activeCol}
                initial={{ opacity: 0 }}
                animate={{ opacity: cell === null ? 0.25 : 1 }}
                transition={{ delay: (r * layout.cols + c) * 0.008 }}
              >
                {cell === null ? "·" : cell === " " ? "␣" : cell}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================= Affine map ========================= */
export function AffineMapViz({ a, b, mode, accent }: { a: number; b: number; mode: "encrypt" | "decrypt"; accent: string }) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 22;
  const pt = (i: number) => {
    const ang = ((i * (360 / 26) - 90) * Math.PI) / 180;
    return [cx + Math.cos(ang) * R, cy + Math.sin(ang) * R] as const;
  };
  const mapFn = (x: number) => (mode === "decrypt" ? mod(21 * (x - b), 26) : mod(a * x + b, 26));
  const shown = 13;

  return (
    <div className="w-full max-w-full overflow-hidden">
      <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto block w-full max-w-[250px] sm:max-w-[280px]">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.08)" />
        {Array.from({ length: shown }).map((_, i) => {
          const x = i * 2;
          const [x1, y1] = pt(x);
          const [x2, y2] = pt(mapFn(x));
          return (
            <motion.line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={accent}
              strokeWidth={1.1}
              strokeOpacity={0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            />
          );
        })}
        {ALPHABET.split("").map((ch, i) => {
          const [x, y] = pt(i);
          const hot = i % 2 === 0 && i < shown * 2;
          return (
            <text key={i} x={x} y={y + 3.5} textAnchor="middle" className="mono" fontSize={9} fontWeight={hot ? 800 : 400} fill={hot ? accent : "rgba(255,255,255,0.4)"}>
              {ch}
            </text>
          );
        })}
        <text x={cx} y={cy - 2} textAnchor="middle" className="mono" fontSize={17} fontWeight={800} fill="#fff">
          {a}x + {b}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" className="mono" fontSize={8} letterSpacing="1.5" fill="rgba(255,255,255,0.35)">
          MOD 26
        </text>
      </svg>
    </div>
  );
}

/* ========================= Hill matrix ========================= */
export function HillViz({ matrix, size, accent, workLabel }: { matrix: number[][]; size: number; accent: string; workLabel?: string }) {
  const [active, setActive] = useState(-1);
  useEffect(() => {
    const t = setInterval(() => setActive((v) => (v + 1) % size), 900);
    return () => clearInterval(t);
  }, [size]);

  return (
    <div dir="ltr" className="ltr flex w-full max-w-full items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-1">
      <span className="mono text-2xl font-light text-white/25">[</span>
      <div className="grid gap-[5px] sm:gap-[6px]" style={{ gridTemplateColumns: `repeat(${size}, minmax(0,1fr))` }}>
        {matrix.map((row, i) =>
          row.map((v, j) => (
            <motion.div
              key={`${i}-${j}`}
              className="cell-tile h-[40px] w-[40px] sm:h-[46px] sm:w-[46px] text-[14px] sm:text-[15px]"
              data-warm={i === active}
              animate={i === active ? { y: -3 } : { y: 0 }}
            >
              {v}
            </motion.div>
          ))
        )}
      </div>
      <span className="mono text-2xl font-light text-white/25">]</span>
      {workLabel && (
        <span className="mono ms-1 sm:ms-2 shrink-0 rounded-md px-2 py-1 text-[10px]" style={{ background: `${accent}18`, color: accent }}>
          {workLabel}
        </span>
      )}
    </div>
  );
}

/* ========================= XOR bits ========================= */
export function XorViz({ rows, accent }: { rows: { p: string; k: string; o: string; label: string }[]; accent: string }) {
  return (
    <div className="w-full max-w-full space-y-1.5 overflow-x-auto pb-1">
      {rows.map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: Math.min(i * 0.04, 0.6) }}
          dir="ltr"
          className="ltr flex w-max min-w-full items-center gap-2 rounded-lg border border-white/6 bg-black/30 px-2 py-1.5"
        >
          <span className="mono w-6 shrink-0 text-center text-[12px] font-bold text-white/70">{r.label}</span>
          <Bits value={r.p} color="rgba(255,255,255,0.55)" />
          <span className="mono text-[13px] font-bold" style={{ color: accent }}>⊕</span>
          <Bits value={r.k} color={accent} />
          <span className="mono text-[13px] text-white/35">=</span>
          <Bits value={r.o} color="#38E0B0" flip />
        </motion.div>
      ))}
    </div>
  );
}

function Bits({ value, color, flip }: { value: string; color: string; flip?: boolean }) {
  return (
    <span className="mono flex shrink-0 gap-[2px]">
      {value.split("").map((b, i) => (
        <motion.span
          key={i}
          className="grid h-[18px] w-[12px] sm:w-[13px] place-items-center rounded-[3px] text-[9.5px] sm:text-[10px] font-bold"
          style={{ background: b === "1" ? `${color}26` : "transparent", color: b === "1" ? color : "rgba(255,255,255,0.22)", border: `1px solid ${b === "1" ? `${color}44` : "rgba(255,255,255,0.06)"}` }}
          animate={flip && b === "1" ? { scale: [1, 1.25, 1] } : {}}
          transition={{ duration: 0.5, delay: i * 0.03 }}
        >
          {b}
        </motion.span>
      ))}
    </span>
  );
}

/* ========================= SHA-256 pipeline ========================= */
export function ShaViz({ hex, blocks, byteLength, bitLength, words, accent }: { hex: string; blocks: number; byteLength: number; bitLength: number; words: number[]; accent: string }) {
  const bits = useMemo(
    () =>
      hex
        .split("")
        .map((h) => parseInt(h, 16).toString(2).padStart(4, "0"))
        .join(""),
    [hex]
  );

  return (
    <div className="w-full max-w-full space-y-4 overflow-hidden">
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {[
          { k: `${byteLength} B`, v: "input" },
          { k: `${bitLength}`, v: "bits" },
          { k: `${blocks}`, v: blocks === 1 ? "block" : "blocks" },
          { k: "64", v: "rounds" },
          { k: "256", v: "output bits" },
        ].map((s, i, arr) => (
          <React.Fragment key={s.v}>
            <div className="rounded-lg border border-white/8 bg-white/[0.02] px-2 sm:px-2.5 py-1.5">
              <div className="mono text-[12px] sm:text-[13px] font-bold" style={{ color: accent }}>{s.k}</div>
              <div className="mono text-[8.5px] sm:text-[9px] uppercase tracking-wider text-white/35">{s.v}</div>
            </div>
            {i < arr.length - 1 && <span className="mono text-white/20">→</span>}
          </React.Fragment>
        ))}
      </div>

      <div dir="ltr" className="ltr grid grid-cols-4 gap-[3px] sm:grid-cols-8 lg:grid-cols-16">
        {words.map((w, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="mono rounded-[4px] border border-white/8 bg-black/40 px-1 py-1 text-center text-[8.5px] text-white/55 truncate"
            title={`W${i}`}
          >
            {w.toString(16).padStart(8, "0")}
          </motion.div>
        ))}
      </div>

      <div dir="ltr" className="ltr grid grid-cols-16 gap-[2px] sm:grid-cols-32">
        {bits.split("").map((b, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.min(i * 0.002, 0.5) }}
            className="aspect-square rounded-[2px]"
            style={{ background: b === "1" ? accent : "rgba(255,255,255,0.07)", boxShadow: b === "1" ? `0 0 6px ${accent}66` : "none" }}
          />
        ))}
      </div>
      <p dir="ltr" className="ltr mono break-all text-[11px] leading-relaxed text-white/50">{hex}</p>
    </div>
  );
}

/* ========================= Generic alphabet strip (Atbash / substitution) ========================= */
export function AlphabetStrip({ accent, mapping, highlight }: { accent: string; mapping?: (i: number) => number; highlight?: string }) {
  return (
    <div dir="ltr" className="ltr w-full max-w-full overflow-x-auto pb-1">
      <div className="flex w-max gap-[3px]">
        {ALPHABET.split("").map((ch, i) => {
          const out = mapping ? ALPHABET[mapping(i)] : ch;
          const on = highlight?.toUpperCase() === ch;
          return (
            <div key={ch} className="flex w-[22px] shrink-0 flex-col items-center gap-1">
              <span className="mono text-[12px] font-bold" style={{ color: on ? accent : "rgba(255,255,255,0.62)" }}>{ch}</span>
              <span className="mono text-[8px] text-white/25">{i}</span>
              {mapping && (
                <>
                  <motion.span initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.015 }} className="h-3 w-px" style={{ background: `${accent}55`, transformOrigin: "top" }} />
                  <span className="mono text-[12px] font-bold" style={{ color: accent, opacity: on ? 1 : 0.75 }}>{out}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}