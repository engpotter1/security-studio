import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BookOpen, FlaskConical, MousePointerClick, Radio } from "lucide-react";
import type { Dict } from "../i18n/ui";
import type { Lang, CategoryKey } from "../data/types";
import { ALGORITHMS, CATEGORY_ORDER } from "../data/algorithms";
import { defaultKey, runCipher, type AlgorithmId } from "../lib/ciphers";
import { Reveal, Stat, StrengthMeter, Tilt } from "./ui";
import Emblem from "./Emblem";

const SAMPLE = "SECURITY";

export default function Home({ t, lang, onPick }: { t: Dict; lang: Lang; onPick: (id: AlgorithmId) => void }) {
  const [filter, setFilter] = useState<CategoryKey | "all">("all");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), 2600);
    return () => clearInterval(id);
  }, []);

  const previews = useMemo(
    () =>
      Object.fromEntries(
        ALGORITHMS.map((a) => {
          const r = runCipher(a.id, "encrypt", SAMPLE, defaultKey);
          return [a.id, r.output.replace(/\s+/g, " ").slice(0, 30)];
        })
      ) as Record<AlgorithmId, string>,
    []
  );

  const list = ALGORITHMS.filter((a) => filter === "all" || a.category === filter);
  const live = ALGORITHMS[tick % ALGORITHMS.length];
  const liveOut = previews[live.id];

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6 lg:px-9">
      {/* ============================== HERO ============================== */}
      <section className="grid items-center gap-10 pt-10 lg:grid-cols-12 lg:gap-14 lg:pt-16">
        <div className="lg:col-span-7">
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#F5B82E]/25 bg-[#F5B82E]/[0.06] py-1.5 pe-4 ps-1.5">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#F5B82E] text-[#171103]">
                <Radio size={12} />
              </span>
              <span className="mono text-[10.5px] uppercase tracking-[0.2em] text-[#F5B82E]">{t.home.eyebrow}</span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="text-balance font-display text-[clamp(2.6rem,7.2vw,5.4rem)] font-bold leading-[0.94] tracking-[-0.035em] text-white">
              {t.home.titleA}
              <br />
              <span className="relative inline-block">
                <span className="gold-text anim-flicker">{t.home.titleB}</span>
                <svg className="absolute -bottom-2 start-0 h-3 w-full" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden>
                  <motion.path d="M2 8 C 70 2, 140 12, 298 4" stroke="#F5B82E" strokeWidth="2" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 1.1 }} />
                </svg>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-8 max-w-2xl text-[15.5px] leading-[2] text-white/58 sm:text-[16.5px]">{t.home.lead}</p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button onClick={() => onPick(ALGORITHMS[0].id)} className="btn btn-gold !px-6 !py-3 !text-[14px]">
                <FlaskConical size={16} /> {t.home.ctaPrimary}
                <ArrowUpRight size={15} className="rtl:rotate-90" />
              </button>
              <a href="#how" className="btn btn-ghost !px-5 !py-3 !text-[14px]">
                <BookOpen size={15} /> {t.home.ctaSecondary}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <Stat value="11" label={t.home.statAlgos} />
              <Stat value="AR / EN" label={t.home.statLangs} accent="#57B8FF" />
              <Stat value="∞" label={t.home.statSteps} accent="#38E0B0" />
              <Stat value="100%" label={t.home.statEngine} accent="#9D8CFF" />
            </div>
          </Reveal>
        </div>

        {/* live console */}
        <Reveal delay={0.14} className="lg:col-span-5">
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[32px] opacity-40 blur-3xl" style={{ background: `radial-gradient(circle at 60% 40%, ${live.accent}, transparent 65%)` }} />
            <div className="glass glass-gold overflow-hidden rounded-3xl">
              <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5D73]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#F5B82E]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#38E0B0]/80" />
                <span className="mono ms-2 text-[10px] uppercase tracking-[0.2em] text-white/32">live engine</span>
                <span className="mono ms-auto text-[10px] text-white/25">{t.nav.live}</span>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3">
                  <motion.span
                    key={live.id}
                    initial={{ rotate: -25, scale: 0.7, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16 }}
                    className="grid h-11 w-11 place-items-center rounded-xl border"
                    style={{ borderColor: `${live.accent}55`, background: `${live.accent}14`, color: live.accent }}
                  >
                    <Emblem id={live.id} size={22} />
                  </motion.span>
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-bold text-white/92">{live.content[lang].name}</div>
                    <div className="mono text-[10px] uppercase tracking-[0.14em] text-white/32">{t.catShort[live.category]} · {live.era}</div>
                  </div>
                </div>

                <div dir="ltr" className="ltr mono mt-5 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-[52px] shrink-0 text-[10px] uppercase tracking-wider text-white/30">input</span>
                    <span className="rounded-lg border border-white/8 bg-black/45 px-3 py-2 text-[13px] text-white/70">{SAMPLE}</span>
                  </div>
                  <div className="flex items-center justify-center text-white/20">
                    <motion.span animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>↓</motion.span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-[52px] shrink-0 text-[10px] uppercase tracking-wider text-white/30">output</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={live.id + liveOut}
                        initial={{ opacity: 0, filter: "blur(6px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(6px)" }}
                        transition={{ duration: 0.4 }}
                        className="flex-1 break-all rounded-lg border px-3 py-2 text-[13px] font-bold"
                        style={{ borderColor: `${live.accent}44`, background: `${live.accent}0f`, color: live.accent, textShadow: `0 0 18px ${live.accent}55` }}
                      >
                        {liveOut}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-1.5">
                  {ALGORITHMS.map((a, i) => (
                    <span key={a.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
                      <motion.span className="block h-full rounded-full" style={{ background: a.accent }} initial={{ width: "0%" }} animate={{ width: i === tick % ALGORITHMS.length ? "100%" : i < tick % ALGORITHMS.length ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============================== PICKER ============================== */}
      <section id="picker" className="pt-20">
        <Reveal>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="section-label mb-2">01 — {t.home.familiesTitle}</div>
              <h2 className="text-[clamp(1.7rem,3.4vw,2.6rem)] font-bold leading-tight tracking-tight text-white">{t.home.picker}</h2>
              <p className="mt-2.5 max-w-2xl text-[14px] leading-relaxed text-white/48">{t.home.pickerHint}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label={t.common.all} />
              {CATEGORY_ORDER.map((c) => (
                <FilterChip key={c} active={filter === c} onClick={() => setFilter(c)} label={t.catShort[c]} />
              ))}
            </div>
          </div>
        </Reveal>

        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((a, i) => (
              <motion.div
                layout
                key={a.id}
                initial={{ opacity: 0, y: 26, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: i * 0.035, duration: 0.45, ease: [0.22, 0.8, 0.24, 1] }}
              >
                <Tilt className="h-full">
                  <button
                    onClick={() => onPick(a.id)}
                    className="glass group relative flex h-full w-full flex-col overflow-hidden rounded-2xl p-5 text-start transition-colors duration-300"
                    style={{ borderColor: "rgba(255,255,255,0.07)" }}
                  >
                    <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(520px circle at 20% 0%, ${a.accent}18, transparent 60%)` }} />
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `linear-gradient(90deg, transparent, ${a.accent}, transparent)` }} />

                    <div className="tilt-inner relative flex items-start justify-between">
                      <span
                        className="grid h-12 w-12 place-items-center rounded-xl border transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                        style={{ borderColor: `${a.accent}44`, background: `linear-gradient(150deg, ${a.accent}1f, transparent)`, color: a.accent }}
                      >
                        <Emblem id={a.id} size={24} />
                      </span>
                      <span className="mono text-[40px] font-bold leading-none text-white/[0.055] transition-colors duration-500 group-hover:text-white/10">
                        {String(a.n).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="tilt-inner relative mt-4 text-[17px] font-bold leading-snug text-white/95">{a.content[lang].name}</h3>
                    <p className="tilt-inner relative mt-1.5 flex-1 text-[12.5px] leading-[1.8] text-white/45">{a.content[lang].tagline}</p>

                    <div dir="ltr" className="ltr mono relative mt-3.5 truncate rounded-lg border border-white/6 bg-black/40 px-2.5 py-1.5 text-[10.5px] text-white/35 transition-colors duration-500" style={{ ["--x" as string]: a.accent }}>
                      <span className="group-hover:text-white/60">{SAMPLE} → </span>
                      <span style={{ color: `${a.accent}cc` }}>{previews[a.id] || "—"}</span>
                    </div>

                    <div className="tilt-inner relative mt-4 flex items-center justify-between gap-3 border-t border-white/6 pt-3.5">
                      <span className="chip mono !text-[9.5px]" style={{ borderColor: `${a.accent}33`, color: `${a.accent}dd` }}>
                        {t.catShort[a.category]}
                      </span>
                      <StrengthMeter value={a.strength} accent={a.accent} />
                    </div>

                    <span className="pointer-events-none absolute bottom-4 end-4 grid h-7 w-7 place-items-center rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100" style={{ background: a.accent, color: "#141003", transform: "translateY(6px)" }}>
                      <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-y-0 rtl:-scale-x-100" />
                    </span>
                  </button>
                </Tilt>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ============================== HOW ============================== */}
      <section id="how" className="pt-24">
        <Reveal>
          <div className="section-label mb-2">02 — process</div>
          <h2 className="text-[clamp(1.7rem,3.4vw,2.6rem)] font-bold tracking-tight text-white">{t.home.howTitle}</h2>
        </Reveal>

        <div className="relative mt-12">
          <div className="absolute start-[27px] top-4 bottom-16 w-px bg-gradient-to-b from-[#F5B82E]/60 via-white/10 to-transparent sm:start-1/2 sm:hidden" />
          <div className="space-y-8">
            {[
              { icon: <MousePointerClick size={17} />, title: t.home.how1T, body: t.home.how1B, accent: "#F5B82E" },
              { icon: <BookOpen size={17} />, title: t.home.how2T, body: t.home.how2B, accent: "#57B8FF" },
              { icon: <FlaskConical size={17} />, title: t.home.how3T, body: t.home.how3B, accent: "#38E0B0" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className={`relative grid gap-5 sm:grid-cols-2 sm:items-center ${i % 2 === 1 ? "sm:[&>*:first-child]:order-2" : ""}`}>
                  <div className={`flex items-start gap-4 ${i % 2 === 1 ? "sm:justify-end sm:text-end" : ""}`}>
                    {i % 2 === 0 && (
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border sm:hidden" style={{ borderColor: `${s.accent}44`, background: `${s.accent}12`, color: s.accent }}>
                        {s.icon}
                      </span>
                    )}
                    <div className={i % 2 === 1 ? "sm:pe-4" : ""}>
                      <div className="mono mb-1.5 text-[10px] uppercase tracking-[0.24em]" style={{ color: s.accent }}>
                        step {i + 1}
                      </div>
                      <h3 className="text-[20px] font-bold tracking-tight text-white/95 sm:text-[24px]">{s.title}</h3>
                      <p className="mt-2 max-w-md text-[13.5px] leading-[1.95] text-white/50">{s.body}</p>
                    </div>
                    {i % 2 === 1 && (
                      <span className="hidden h-14 w-14 shrink-0 place-items-center rounded-2xl border sm:grid" style={{ borderColor: `${s.accent}44`, background: `${s.accent}12`, color: s.accent }}>
                        {s.icon}
                      </span>
                    )}
                  </div>

                  <div className="hidden sm:block">
                    <div className="glass relative overflow-hidden rounded-2xl p-4">
                      <div className="pointer-events-none absolute inset-0 iso-bg opacity-30" />
                      {i === 0 && (
                        <div className="relative flex flex-wrap gap-1.5">
                          {ALGORITHMS.map((a) => (
                            <span key={a.id} className="mono grid h-8 w-8 place-items-center rounded-lg border text-[11px] font-bold" style={{ borderColor: `${a.accent}33`, background: `${a.accent}10`, color: a.accent }}>
                              {a.n}
                            </span>
                          ))}
                        </div>
                      )}
                      {i === 1 && (
                        <pre dir="ltr" className="ltr mono relative text-[12px] leading-7 text-white/70">
                          {"E(x) = (a·x + b) mod 26\nD(y) = a⁻¹·(y − b) mod 26\n────────────────────────\nP  plaintext    K  key\nC  ciphertext   ⊕  XOR"}
                        </pre>
                      )}
                      {i === 2 && (
                        <div dir="ltr" className="ltr mono relative space-y-1.5 text-[11.5px]">
                          {["H → (7+3) mod 26 = 10 → K", "E → (4+3) mod 26 = 7 → H", "L → (11+3) mod 26 = 14 → O"].map((l, k) => (
                            <motion.div key={k} initial={{ opacity: 0.25 }} animate={{ opacity: [0.25, 1, 0.25] }} transition={{ repeat: Infinity, duration: 3, delay: k * 0.5 }} className="flex items-center gap-2 rounded-md border border-white/6 bg-black/35 px-2.5 py-1.5 text-white/60">
                              <span className="text-[#38E0B0]">▸</span> {l}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== FOOTER ============================== */}
      <Reveal>
        <footer className="mt-24 border-t border-white/8 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-[#F5B82E]/40 bg-[#F5B82E]/10 text-[#F5B82E]">
                <Emblem id="sha256" size={18} />
              </span>
              <div>
                <div className="text-[13px] font-bold text-white/85">{t.brand.title} — {t.brand.sub}</div>
                <div className="mono text-[10.5px] text-white/32">{t.common.ltrNote}</div>
              </div>
            </div>
            <div className="mono text-[10.5px] uppercase tracking-[0.18em] text-white/25">{t.common.keyboardHint}</div>
          </div>
        </footer>
      </Reveal>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="relative rounded-full border px-3.5 py-1.5 text-[11.5px] font-semibold transition-all duration-300"
      style={{
        borderColor: active ? "#F5B82E66" : "rgba(255,255,255,0.1)",
        background: active ? "#F5B82E14" : "transparent",
        color: active ? "#F5B82E" : "rgba(255,255,255,0.45)",
      }}
    >
      {label}
    </button>
  );
}
