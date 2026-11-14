import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UI } from "./i18n/ui";
import type { Lang } from "./data/types";
import { ALGORITHMS, DEFAULT_TEXT, byId } from "./data/algorithms";
import { defaultKey, type AlgorithmId, type KeyState, type Mode } from "./lib/ciphers";
import Ambient from "./components/Ambient";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Studio, { type Tab } from "./components/Studio";

type LabState = { text: string; mode: Mode; key: KeyState };

const GOLD = "#F5B82E";

export default function App() {
  const [lang, setLang] = useState<Lang>(() => (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("ar") ? "ar" : "en"));
  const [current, setCurrent] = useState<AlgorithmId | null>(null);
  const [tab, setTab] = useState<Tab>("explain");
  const [labs, setLabs] = useState<Partial<Record<AlgorithmId, LabState>>>({});

  const t = UI[lang];
  const meta = current ? byId(current) : null;
  const accent = meta?.accent ?? GOLD;

  /* ---------- direction + document language ---------- */
  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.setAttribute("dir", dir);
  }, [lang]);

  /* ---------- per-algorithm lab state ---------- */
  const lab: LabState = useMemo(() => {
    if (!current) return { text: "", mode: "encrypt", key: defaultKey };
    return labs[current] ?? { text: DEFAULT_TEXT[current], mode: "encrypt", key: { ...defaultKey } };
  }, [current, labs]);

  const patchLab = useCallback(
    (patch: Partial<LabState>) => {
      if (!current) return;
      setLabs((prev) => {
        const base = prev[current] ?? { text: DEFAULT_TEXT[current], mode: "encrypt" as Mode, key: { ...defaultKey } };
        return { ...prev, [current]: { ...base, ...patch } };
      });
    },
    [current]
  );

  const pick = useCallback((id: AlgorithmId) => {
    setCurrent(id);
    setTab("explain");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const home = useCallback(() => {
    setCurrent(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ---------- keyboard navigation ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (!current) return;
      const i = ALGORITHMS.findIndex((a) => a.id === current);
      if (e.key === "ArrowRight") {
        e.preventDefault();
        pick(ALGORITHMS[(i + (lang === "ar" ? -1 : 1) + ALGORITHMS.length) % ALGORITHMS.length].id);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        pick(ALGORITHMS[(i + (lang === "ar" ? 1 : -1) + ALGORITHMS.length) % ALGORITHMS.length].id);
      } else if (e.key === "Escape") {
        home();
      } else if (e.key.toLowerCase() === "l") {
        setTab("lab");
      } else if (e.key.toLowerCase() === "e") {
        setTab("explain");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, lang, pick, home]);

  return (
    <div className="relative min-h-screen">
      <Ambient accent={accent} />

      <Navbar
        t={t}
        lang={lang}
        accent={accent}
        current={current}
        onHome={home}
        onPick={pick}
        onToggleLang={() => setLang((l) => (l === "ar" ? "en" : "ar"))}
      />

      <AnimatePresence mode="wait">
        <motion.main
          key={current ?? "home"}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 0.8, 0.24, 1] }}
        >
          {meta ? (
            <Studio
              meta={meta}
              lang={lang}
              t={t}
              tab={tab}
              setTab={setTab}
              onBack={home}
              onPick={pick}
              text={lab.text}
              setText={(s) => patchLab({ text: s })}
              mode={lab.mode}
              setMode={(m) => patchLab({ mode: m })}
              keyState={lab.key}
              setKeyState={(k) => patchLab({ key: k })}
            />
          ) : (
            <Home t={t} lang={lang} onPick={pick} />
          )}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
