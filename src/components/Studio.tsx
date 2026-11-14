import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpenText, FlaskConical, LayoutGrid } from "lucide-react";
import type { AlgorithmMeta, Lang } from "../data/types";
import type { Dict } from "../i18n/ui";
import { ALGORITHMS } from "../data/algorithms";
import type { KeyState, Mode } from "../lib/ciphers";
import { Chip, StrengthMeter, Tilt } from "./ui";
import Emblem from "./Emblem";
import ExplanationTab from "./ExplanationTab";
import LabTab from "./LabTab";

export type Tab = "explain" | "lab";

export default function Studio({
  meta,
  lang,
  t,
  tab,
  setTab,
  onBack,
  onPick,
  text,
  setText,
  mode,
  setMode,
  keyState,
  setKeyState,
}: {
  meta: AlgorithmMeta;
  lang: Lang;
  t: Dict;
  tab: Tab;
  setTab: (v: Tab) => void;
  onBack: () => void;
  onPick: (id: AlgorithmMeta["id"]) => void;
  text: string;
  setText: (s: string) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  keyState: KeyState;
  setKeyState: (k: KeyState) => void;
}) {
  const c = meta.content[lang];
  const accent = meta.accent;
  const i = ALGORITHMS.findIndex((a) => a.id === meta.id);
  const prev = ALGORITHMS[(i - 1 + ALGORITHMS.length) % ALGORITHMS.length];
  const next = ALGORITHMS[(i + 1) % ALGORITHMS.length];

  return (
    <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-9 pb-24 overflow-x-hidden">
      <button onClick={onBack} className="group mt-4 sm:mt-6 inline-flex items-center gap-2 text-[12px] sm:text-[12.5px] font-semibold text-white/45 transition-colors hover:text-[#F5B82E]">
        <LayoutGrid size={14} />
        {t.common.back}
      </button>

      {/* ============================ header ============================ */}
      <motion.div key={meta.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 0.8, 0.24, 1] }}>
        <div className="relative mt-4 sm:mt-5 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/8 p-4 sm:p-8" style={{ background: `linear-gradient(140deg, ${accent}0e, rgba(11,13,20,0.55) 45%, rgba(11,13,20,0.8))` }}>
          <div className="pointer-events-none absolute inset-0 iso-bg opacity-25" />
          <div className="pointer-events-none absolute -end-16 -top-24 h-72 w-72 rounded-full opacity-25 blur-[90px]" style={{ background: accent }} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

          <div className="relative flex flex-col gap-5 sm:gap-7 lg:flex-row lg:items-center">
            <Tilt intensity={14} className="shrink-0 self-center">
              <div className="relative h-[100px] w-[100px] sm:h-[124px] sm:w-[124px]">
                <span className="absolute inset-0 rounded-[22px] sm:rounded-[26px] opacity-70 blur-[2px]" style={{ background: `conic-gradient(from 0deg, transparent 0deg, ${accent} 90deg, transparent 180deg, ${accent}66 270deg, transparent 360deg)`, animation: "spin-slow 9s linear infinite" }} />
                <span className="absolute inset-[2px] grid place-items-center rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#0B0D14]" style={{ color: accent }}>
                  <span className="tilt-inner flex flex-col items-center gap-1">
                    <Emblem id={meta.id} size={36} className="sm:w-[44px] sm:h-[44px]" />
                    <span className="mono text-[10px] sm:text-[11px] font-bold tracking-widest opacity-70">{meta.glyph}</span>
                  </span>
                </span>
                <span className="mono absolute -end-2 -top-2 grid h-6 w-6 sm:h-7 sm:w-7 place-items-center rounded-full border text-[10px] sm:text-[11px] font-bold" style={{ borderColor: `${accent}66`, background: "#0B0D14", color: accent }}>
                  {meta.n}
                </span>
              </div>
            </Tilt>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <Chip color={accent} filled>{t.categories[meta.category]}</Chip>
                <Chip color={accent}>{meta.era}</Chip>
                <Chip color={accent}>key space · {meta.keyspace}</Chip>
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 sm:px-3 py-1">
                  <span className="mono text-[9.5px] sm:text-[10px] uppercase tracking-wider text-white/35">{t.sections.meter}</span>
                  <StrengthMeter value={meta.strength} accent={accent} />
                </span>
              </div>

              <h1 className="mt-3 sm:mt-3.5 text-[clamp(1.6rem,4vw,3.1rem)] font-bold leading-[1.06] tracking-[-0.03em] text-white">{c.name}</h1>
              <p className="mt-2 sm:mt-2.5 max-w-2xl text-[13.5px] sm:text-[14.5px] leading-[1.8] sm:leading-[1.9] text-white/55">{c.tagline}</p>
            </div>
          </div>

          {/* tabs */}
          <div className="relative mt-6 sm:mt-8 grid gap-2 sm:gap-2.5 sm:grid-cols-2">
            {([
              { id: "explain" as Tab, label: t.tabs.explain, sub: t.tabs.explainSub, icon: <BookOpenText size={18} /> },
              { id: "lab" as Tab, label: t.tabs.lab, sub: t.tabs.labSub, icon: <FlaskConical size={18} /> },
            ]).map((tb) => {
              const active = tab === tb.id;
              return (
                <button key={tb.id} onClick={() => setTab(tb.id)} className="relative overflow-hidden rounded-xl sm:rounded-2xl border p-3.5 sm:p-4 text-start transition-all duration-300" style={{ borderColor: active ? `${accent}55` : "rgba(255,255,255,0.08)", background: active ? `${accent}10` : "rgba(255,255,255,0.015)" }}>
                  {active && (
                    <motion.span layoutId="tab-glow" className="absolute inset-0" style={{ background: `radial-gradient(400px circle at 10% 0%, ${accent}1f, transparent 65%)` }} transition={{ type: "spring", stiffness: 260, damping: 28 }} />
                  )}
                  <span className="relative flex items-center gap-3">
                    <span className="grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl border transition-transform duration-300" style={{ borderColor: `${accent}44`, background: active ? `${accent}22` : "transparent", color: accent, transform: active ? "scale(1.06)" : "scale(1)" }}>
                      {tb.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] sm:text-[15px] font-bold" style={{ color: active ? "#fff" : "rgba(255,255,255,0.6)" }}>{tb.label}</span>
                      <span className="mono block truncate text-[10px] sm:text-[10.5px] uppercase tracking-[0.14em] text-white/32">{tb.sub}</span>
                    </span>
                    {active && <span className="ms-auto hidden h-2 w-2 shrink-0 rounded-full sm:block anim-ring" style={{ background: accent }} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ============================ body ============================ */}
      <div className="mt-6 sm:mt-8">
        {tab === "explain" ? (
          <ExplanationTab meta={meta} lang={lang} t={t} />
        ) : (
          <LabTab meta={meta} lang={lang} t={t} text={text} setText={setText} mode={mode} setMode={setMode} keyState={keyState} setKeyState={setKeyState} />
        )}
      </div>

      {/* ============================ prev / next ============================ */}
      <div className="mt-10 sm:mt-12 grid gap-3 sm:grid-cols-2">
        <button onClick={() => onPick(prev.id)} className="group glass flex items-center gap-3 sm:gap-4 rounded-2xl p-3.5 sm:p-4 text-start transition-all duration-300 hover:-translate-y-0.5" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <ArrowLeft size={16} className="shrink-0 text-white/30 transition-colors group-hover:text-white/70 rtl:rotate-180" />
          <span className="min-w-0 flex-1">
            <span className="mono block text-[9.5px] sm:text-[10px] uppercase tracking-[0.18em] text-white/28">prev · {String(prev.n).padStart(2, "0")}</span>
            <span className="block truncate text-[13.5px] sm:text-[14.5px] font-bold text-white/80">{prev.content[lang].name}</span>
          </span>
          <span className="shrink-0 scale-90 sm:scale-100" style={{ color: prev.accent }}>
            <Emblem id={prev.id} size={20} />
          </span>
        </button>

        <button onClick={() => onPick(next.id)} className="group glass flex items-center gap-3 sm:gap-4 rounded-2xl p-3.5 sm:p-4 text-end transition-all duration-300 hover:-translate-y-0.5 sm:text-start" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <span className="shrink-0 sm:order-last scale-90 sm:scale-100" style={{ color: next.accent }}>
            <Emblem id={next.id} size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="mono block text-[9.5px] sm:text-[10px] uppercase tracking-[0.18em] text-white/28">next · {String(next.n).padStart(2, "0")}</span>
            <span className="block truncate text-[13.5px] sm:text-[14.5px] font-bold text-white/80">{next.content[lang].name}</span>
          </span>
          <ArrowRight size={16} className="shrink-0 text-white/30 transition-colors group-hover:text-white/70 rtl:rotate-180 sm:order-first" />
        </button>
      </div>
    </div>
  );
}