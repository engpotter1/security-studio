import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Languages, LayoutGrid, ShieldHalf } from "lucide-react";
import type { Dict } from "../i18n/ui";
import type { Lang } from "../data/types";
import { ALGORITHMS } from "../data/algorithms";
import type { AlgorithmId } from "../lib/ciphers";
import Emblem from "./Emblem";

export default function Navbar({
  t,
  lang,
  onHome,
  onPick,
  current,
  onToggleLang,
  accent,
}: {
  t: Dict;
  lang: Lang;
  onHome: () => void;
  onPick: (id: AlgorithmId) => void;
  current: AlgorithmId | null;
  onToggleLang: () => void;
  accent: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 0.8, 0.24, 1] }}
      className="sticky top-0 z-50"
    >
      <div
        className={`border-b transition-all duration-500 ${scrolled ? "border-white/8 bg-[#0B0D14]/85 backdrop-blur-xl" : "border-transparent bg-transparent"}`}
        style={scrolled ? { boxShadow: "0 18px 50px -32px rgba(0,0,0,1)" } : undefined}
      >
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-9">
          <button onClick={onHome} className="group flex items-center gap-3 text-start">
            <span
              className="relative grid h-10 w-10 place-items-center rounded-xl border transition-all duration-300 group-hover:scale-105"
              style={{ borderColor: `${accent}55`, background: `linear-gradient(150deg, ${accent}22, transparent)`, color: accent }}
            >
              <ShieldHalf size={19} />
              <span className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:anim-ring" style={{ boxShadow: `0 0 0 1px ${accent}66` }} />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-[15px] font-bold tracking-tight text-white/95">{t.brand.title}</span>
              <span className="mono block text-[9.5px] uppercase tracking-[0.16em] text-white/35">{t.brand.sub}</span>
            </span>
          </button>

          <div className="mx-auto hidden items-center gap-1 lg:flex">
            {ALGORITHMS.map((a) => (
              <button
                key={a.id}
                onClick={() => onPick(a.id)}
                title={`${a.n}. ${a.content[lang].name}`}
                className="group relative grid h-9 w-9 place-items-center rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  color: current === a.id ? a.accent : "rgba(255,255,255,0.32)",
                  background: current === a.id ? `${a.accent}18` : "transparent",
                  border: `1px solid ${current === a.id ? `${a.accent}44` : "transparent"}`,
                }}
              >
                <Emblem id={a.id} size={18} />
                <span className="mono absolute -bottom-0.5 end-0.5 text-[7px] opacity-40">{a.n}</span>
              </button>
            ))}
          </div>

          <div className="ms-auto flex items-center gap-2 lg:ms-0">
            <button onClick={() => setOpen((v) => !v)} className="btn btn-ghost !px-2.5 !py-2 lg:hidden" aria-label={t.nav.grid}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={onToggleLang} className="btn btn-gold" title={t.nav.langTitle}>
              <Languages size={15} />
              {t.nav.langBtn}
            </button>
          </div>
        </div>

        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden border-t border-white/6 bg-[#0B0D14]/95 backdrop-blur-xl lg:hidden">
            <div className="grid grid-cols-3 gap-2 p-4 sm:grid-cols-4">
              {ALGORITHMS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    onPick(a.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-2.5 py-2 text-start"
                  style={current === a.id ? { borderColor: `${a.accent}66`, background: `${a.accent}14` } : undefined}
                >
                  <span style={{ color: a.accent }}>
                    <Emblem id={a.id} size={17} />
                  </span>
                  <span className="mono text-[10.5px] font-bold text-white/70">{a.n}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
