import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  Landmark,
  Play,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sigma,
  Skull,
  Swords,
} from "lucide-react";
import type { AlgorithmMeta, Lang } from "../data/types";
import type { Dict } from "../i18n/ui";
import { Chip, FormulaBox, Reveal, SectionHead, StrengthMeter } from "./ui";

export default function ExplanationTab({ meta, lang, t }: { meta: AlgorithmMeta; lang: Lang; t: Dict }) {
  const c = meta.content[lang];
  const accent = meta.accent;
  const [rawStep, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  // clamp defensively: the reset effect runs after the first render of a new algorithm
  const step = Math.max(0, Math.min(rawStep, c.example.steps.length - 1));
  const cur = c.example.steps[step];

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [meta.id, lang]);

  useEffect(() => {
    if (!playing) return;
    if (step >= c.example.steps.length - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setStep((s) => s + 1), 1800);
    return () => clearTimeout(id);
  }, [playing, step, c.example.steps.length]);

  return (
    <div className="space-y-9">
      {/* ---------- historical strip ---------- */}
      <Reveal>
        <div className="glass relative overflow-hidden rounded-2xl p-5 sm:p-6">
          <div className="pointer-events-none absolute -end-10 -top-16 h-48 w-48 rounded-full opacity-25 blur-3xl" style={{ background: accent }} />
          <div className="flex flex-wrap items-center gap-2.5">
            <Chip color={accent} filled>
              <Landmark size={11} /> {meta.era}
            </Chip>
            <Chip color={accent}>{c.name}</Chip>
            <span className="chip mono">{t.categories[meta.category]}</span>
            <span className="chip mono">key space · {meta.keyspace}</span>
          </div>
          <p className="mt-4 max-w-4xl text-[14.5px] leading-[1.95] text-white/62">{c.history}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.16em] text-white/35">{t.sections.meter}</span>
            <StrengthMeter value={meta.strength} accent={accent} />
            <span className="mono text-[11px] text-white/35">{meta.strength}/5</span>
          </div>
        </div>
      </Reveal>

      {/* ---------- what is it ---------- */}
      <Reveal delay={0.05}>
        <section>
          <SectionHead kicker="01" title={t.sections.what} accent={accent} icon={<BookOpen size={17} />} />
          <div className="grid gap-4 lg:grid-cols-2">
            {c.what.map((p, i) => (
              <div key={i} className="glass relative rounded-2xl p-5">
                <span className="mono absolute end-4 top-3 text-[42px] font-bold leading-none opacity-[0.07]" style={{ color: accent }}>
                  {i + 1}
                </span>
                <p className={`text-[15px] leading-[2] text-white/78 ${i === 0 ? "font-semibold text-white/90" : ""}`}>{p}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ---------- how it works ---------- */}
      <Reveal delay={0.05}>
        <section>
          <SectionHead kicker="02" title={t.sections.how} accent={accent} icon={<ChevronRight size={17} />} />
          <div className="relative grid gap-3 md:grid-cols-2">
            {c.how.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                className="group glass relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              >
                <div className="absolute inset-y-0 start-0 w-[2px] opacity-40 transition-opacity duration-300 group-hover:opacity-100" style={{ background: accent }} />
                <div className="flex items-start gap-3">
                  <span className="mono grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[12px] font-bold" style={{ background: `${accent}1a`, color: accent, border: `1px solid ${accent}3d` }}>
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-[15px] font-bold text-white/92">{s.title}</h4>
                    <p className="mt-1.5 text-[13.5px] leading-[1.9] text-white/58">{s.body}</p>
                    {s.math && (
                      <pre dir="ltr" className="ltr mono mt-2.5 overflow-x-auto rounded-lg border border-white/8 bg-black/45 px-3 py-2 text-[12px] leading-6 whitespace-pre" style={{ color: `${accent}dd` }}>
                        {s.math}
                      </pre>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ---------- formula ---------- */}
      <Reveal delay={0.05}>
        <section>
          <SectionHead kicker="03" title={t.sections.formula} accent={accent} icon={<Sigma size={17} />} />
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <FormulaBox text={c.formula.display} caption={c.formula.caption} accent={accent} />
            </div>
            <div className="glass rounded-2xl p-4 lg:col-span-2">
              <div className="section-label mb-3">{t.sections.symbols}</div>
              <ul className="space-y-2">
                {c.formula.symbols.map((s) => (
                  <li key={s.sym} className="flex items-baseline gap-3 border-b border-white/5 pb-2 last:border-0">
                    <span dir="ltr" className="ltr mono shrink-0 rounded-md px-2 py-0.5 text-[12.5px] font-bold" style={{ background: `${accent}14`, color: accent }}>
                      {s.sym}
                    </span>
                    <span className="text-[12.5px] leading-relaxed text-white/60">{s.meaning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ---------- worked example ---------- */}
      <Reveal delay={0.05}>
        <section>
          <SectionHead kicker="04" title={t.sections.example} accent={accent} icon={<Scale size={17} />} />
          <div className="glass overflow-hidden rounded-2xl">
            <div className="flex flex-wrap items-center gap-3 border-b border-white/6 px-4 py-3">
              <button className="btn btn-gold" onClick={() => (step === c.example.steps.length - 1 ? (setStep(0), setPlaying(true)) : setPlaying((p) => !p))}>
                {playing ? <RotateCcw size={14} /> : <Play size={14} />}
                {playing ? t.sections.restart : t.sections.walkthrough}
              </button>
              <button
                className="btn btn-ghost"
                disabled={step >= c.example.steps.length - 1}
                onClick={() => setStep((s) => Math.min(s + 1, c.example.steps.length - 1))}
              >
                {t.sections.next} <ChevronRight size={14} className="rtl:rotate-180" />
              </button>
              <span className="mono ms-auto text-[11px] text-white/35">
                {t.sections.step} {step + 1} {t.sections.of} {c.example.steps.length}
              </span>
            </div>

            <div className="grid gap-0 lg:grid-cols-12">
              <div className="border-b border-white/6 p-5 lg:col-span-7 lg:border-b-0 lg:border-e">
                <div className="space-y-2">
                  <Row label={t.sections.examplePlain} value={c.example.plaintext} accent="#57B8FF" />
                  <Row label={c.example.keyLabel} value={c.example.keyValue} accent={accent} />
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <Row label={t.sections.exampleCipher} value={step >= c.example.steps.length - 1 ? c.example.ciphertext : "• • •"} accent="#38E0B0" strong />
                </div>

                <div className="mt-5 flex gap-1.5">
                  {c.example.steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setStep(i)}
                      aria-label={`step ${i + 1}`}
                      className="h-1.5 flex-1 rounded-full transition-all duration-300"
                      style={{ background: i <= step ? accent : "rgba(255,255,255,0.1)" }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative min-h-[230px] p-5 lg:col-span-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                    transition={{ duration: 0.35, ease: [0.22, 0.8, 0.24, 1] }}
                  >
                    <div className="mono mb-2 text-[10px] tracking-[0.2em]" style={{ color: accent }}>
                      STEP {step + 1}
                    </div>
                    <h4 className="text-[17px] font-bold leading-snug text-white/95">{cur.title}</h4>
                    <p className="mt-2 text-[13.5px] leading-[1.95] text-white/60">{cur.body}</p>
                    {cur.math && (
                      <pre dir="ltr" className="ltr mono mt-3.5 overflow-x-auto rounded-xl border px-3.5 py-3 text-[12.5px] leading-7 whitespace-pre" style={{ borderColor: `${accent}33`, background: "#070910", color: "#f2e7cd" }}>
                        {cur.math}
                      </pre>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ---------- security analysis ---------- */}
      <Reveal delay={0.05}>
        <section>
          <SectionHead kicker="05" title={t.sections.security} accent={accent} icon={<ShieldCheck size={17} />} />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border border-[#38E0B0]/25 bg-[#38E0B0]/[0.045] p-5">
              <div className="mb-3.5 flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#38E0B0]/15 text-[#38E0B0]">
                  <ShieldCheck size={16} />
                </span>
                <h4 className="text-[15px] font-bold text-[#7ef0cd]">{t.sections.strengths}</h4>
              </div>
              <ul className="space-y-2.5">
                {c.strengths.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex gap-2.5 text-[13.5px] leading-[1.85] text-white/70"
                  >
                    <span className="mono mt-[3px] text-[#38E0B0]">✓</span>
                    <span>{s}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#FF5D73]/25 bg-[#FF5D73]/[0.045] p-5">
              <div className="mb-3.5 flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#FF5D73]/15 text-[#FF5D73]">
                  <ShieldAlert size={16} />
                </span>
                <h4 className="text-[15px] font-bold text-[#ff97a7]">{t.sections.weaknesses}</h4>
              </div>
              <ul className="space-y-2.5">
                {c.weaknesses.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex gap-2.5 text-[13.5px] leading-[1.85] text-white/70"
                  >
                    <span className="mono mt-[3px] text-[#FF5D73]">⚠</span>
                    <span>{s}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass mt-4 overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2.5 border-b border-white/6 px-5 py-3.5">
              <Swords size={16} className="text-[#FF5D73]" />
              <h4 className="text-[15px] font-bold text-white/90">{t.sections.attacks}</h4>
            </div>
            <div className="divide-y divide-white/5">
              {c.attacks.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="group flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center sm:gap-5"
                >
                  <span className="mono grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[#FF5D73]/30 bg-[#FF5D73]/10 text-[11px] font-bold text-[#FF5D73]">
                    <Skull size={13} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-bold text-white/90">{a.name}</div>
                    <p className="mt-1 text-[13px] leading-[1.85] text-white/55">{a.desc}</p>
                  </div>
                  <div className="shrink-0">
                    <div className="mono text-[9px] uppercase tracking-[0.18em] text-white/30">{t.sections.attackCost}</div>
                    <div className="mono text-[12px] font-bold" style={{ color: accent }}>{a.cost}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ---------- verdict ---------- */}
      <Reveal delay={0.05}>
        <section className="relative overflow-hidden rounded-2xl border p-6 sm:p-7" style={{ borderColor: `${accent}33`, background: `linear-gradient(140deg, ${accent}12, rgba(11,13,20,0.6))` }}>
          <span className="mono absolute -end-2 -top-8 text-[130px] font-bold leading-none opacity-[0.07]" style={{ color: accent }}>
            ”
          </span>
          <div className="section-label mb-2.5">{t.sections.verdict}</div>
          <p className="relative max-w-3xl text-[16px] font-medium leading-[2] text-white/85">{c.verdict}</p>
        </section>
      </Reveal>
    </div>
  );
}

function Row({ label, value, accent, strong }: { label: string; value: string; accent: string; strong?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-[110px] shrink-0 text-[11px] uppercase tracking-[0.12em] text-white/35">{label}</span>
      <span
        dir="ltr"
        className={`ltr mono flex-1 truncate rounded-lg border px-3 py-2 text-[14px] ${strong ? "font-bold" : ""}`}
        style={{ borderColor: `${accent}33`, background: `${accent}0d`, color: accent }}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
