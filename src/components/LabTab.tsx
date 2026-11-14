import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeftRight,
  Binary,
  ChevronDown,
  Eraser,
  Eye,
  Fingerprint,
  Gauge,
  Info,
  KeyRound,
  Lock,
  LockOpen,
  Sparkles,
  Terminal,
  Wand2,
} from "lucide-react";
import type { AlgorithmMeta, Lang } from "../data/types";
import type { Dict } from "../i18n/ui";
import {
  buildColumnarLayout,
  buildPlayfairGrid,
  cleanKeyword,
  gcd,
  matDet,
  matInverseMod26,
  mod,
  modInverse,
  runCipher,
  sha256BruteForce,
  toMatrix,
  type ColumnarLayout,
  type KeyState,
  type Mode,
} from "../lib/ciphers";
import { CopyButton, SectionHead } from "./ui";
import {
  AffineMapViz,
  AlphabetStrip,
  AtbashMirror,
  CaesarWheel,
  ColumnarViz,
  HillViz,
  PlayfairGridViz,
  RailFenceViz,
  ShaViz,
  VigenereStream,
  XorViz,
} from "./viz";

type Props = {
  meta: AlgorithmMeta;
  lang: Lang;
  t: Dict;
  text: string;
  setText: (s: string) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  keyState: KeyState;
  setKeyState: (k: KeyState) => void;
};

const VALID_A = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

const MATRIX_PRESETS: { label: string; size: 2 | 3; m: number[] }[] = [
  { label: "[[3,3],[2,5]]", size: 2, m: [3, 3, 2, 5] },
  { label: "[[2,3],[5,7]]", size: 2, m: [2, 3, 5, 7] },
  { label: "[[6,24,1],[1,16,10],[10,13,21]]", size: 3, m: [6, 24, 1, 1, 16, 10, 10, 13, 21] },
];

export default function LabTab({ meta, lang, t, text, setText, mode, setMode, keyState, setKeyState }: Props) {
  const accent = meta.accent;
  const c = meta.content[lang];
  const isHash = meta.id === "sha256";
  const [traceOpen, setTraceOpen] = useState(true);
  const [traceLimit, setTraceLimit] = useState(40);
  const [brute, setBrute] = useState<{ state: "idle" | "run" | "found" | "fail"; pre?: string | null; tries?: number }>({ state: "idle" });

  const result = useMemo(() => runCipher(meta.id, isHash ? "encrypt" : mode, text, keyState), [meta.id, mode, text, keyState, isHash]);

  useEffect(() => {
    setBrute({ state: "idle" });
    setTraceLimit(40);
  }, [meta.id, text, mode]);

  const set = (patch: Partial<KeyState>) => setKeyState({ ...keyState, ...patch });

  const letters = text.replace(/[^A-Za-z]/g, "").length;
  const errMsg = result.errorCode ? t.errors[result.errorCode] : null;

  type ShaExtras = {
    hex: string;
    byteLength: number;
    bitLength: number;
    blockCount: number;
    paddedHex: string;
    words: number[];
    avalanche: { mutated: string; hash: string; diffBits: number };
  };
  const sha: ShaExtras | null = isHash && result.extras ? (result.extras as unknown as ShaExtras) : null;

  /* ---------------- derived helpers for panels ---------------- */
  const affineOk = gcd(mod(keyState.a, 26), 26) === 1;
  const hillMat = toMatrix(keyState.matrix, keyState.size);
  const hillDet = mod(matDet(hillMat, keyState.size), 26);
  const hillOk = hillDet !== 0 && gcd(hillDet, 26) === 1;
  const hillInv = useMemo(() => (hillOk ? matInverseMod26(hillMat, keyState.size) : null), [JSON.stringify(keyState.matrix), keyState.size, hillOk]);

  const columnarLayout: ColumnarLayout | null = useMemo(() => {
    if (meta.id !== "columnar" || cleanKeyword(keyState.keyword).length === 0) return null;
    if (mode === "decrypt" && result.extras?.layout) return result.extras.layout as ColumnarLayout;
    if (mode === "decrypt") return null;
    return buildColumnarLayout(text, keyState.keyword, keyState.pad);
  }, [meta.id, keyState.keyword, keyState.pad, text, mode, result.extras]);

  const xorRows = useMemo(() => {
    if (meta.id !== "xor") return [];
    return result.trace.slice(0, 10).map((s) => {
      const parts = s.math.split("⊕");
      return { p: (parts[0] ?? "").trim(), k: (parts[1] ?? "").trim(), o: s.output, label: s.label };
    });
  }, [meta.id, result.trace]);

  return (
    <div className="space-y-5 overflow-x-hidden">
      {/* ============================ top: input / output ============================ */}
      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <div className="glass overflow-hidden rounded-2xl">
            <div className="flex flex-wrap items-center gap-2 border-b border-white/6 px-4 py-3">
              {!isHash && (
                <div className="flex rounded-xl border border-white/10 bg-black/35 p-[3px]">
                  {(["encrypt", "decrypt"] as Mode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className="relative flex items-center gap-1.5 rounded-[9px] px-3 sm:px-3.5 py-1.5 text-[12px] sm:text-[12.5px] font-bold transition-colors"
                      style={{ color: mode === m ? "#141003" : "rgba(255,255,255,0.55)" }}
                    >
                      {mode === m && (
                        <motion.span layoutId={`mode-${meta.id}`} className="absolute inset-0 rounded-[9px]" style={{ background: `linear-gradient(160deg,#ffd97a,${accent} 60%,#c98d13)` }} transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                      )}
                      <span className="relative flex items-center gap-1.5">
                        {m === "encrypt" ? <Lock size={13} /> : <LockOpen size={13} />}
                        {t.lab[m]}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {isHash && (
                <span className="chip mono" style={{ borderColor: `${accent}55`, color: accent, background: `${accent}14` }}>
                  <Fingerprint size={11} /> {t.lab.hash} · one-way
                </span>
              )}
              <span className="mono ms-auto flex items-center gap-2 sm:gap-3 text-[10.5px] sm:text-[11px] text-white/35">
                <span>{text.length} {t.lab.chars}</span>
                <span className="h-3 w-px bg-white/12" />
                <span>{letters} {t.lab.letters}</span>
              </span>
            </div>

            <div className="p-4">
              <label className="section-label mb-2 block">{isHash ? t.lab.input : mode === "encrypt" ? t.lab.inputLabelEncrypt : t.lab.inputLabelDecrypt}</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                spellCheck={false}
                dir={meta.id === "xor" || isHash ? undefined : "ltr"}
                className="field mono resize-y text-[14px] leading-relaxed"
                placeholder={c.lab.inputPlaceholder}
              />

              {errMsg && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#FF5D73]/35 bg-[#FF5D73]/[0.07] px-3.5 py-2.5">
                  <AlertTriangle size={15} className="mt-[2px] shrink-0 text-[#FF5D73]" />
                  <p className="text-[12.5px] leading-relaxed text-[#ffb3be]">{errMsg}</p>
                </motion.div>
              )}

              {/* أزرار الأمثلة والتحكم معدلة بمرونة للتجاوب مع الموبايل من غير نقص */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="mono text-[10px] uppercase tracking-[0.16em] text-white/30">{t.lab.presets}</span>
                {c.lab.presets.map((p) => (
                  <button key={p.label} onClick={() => setText(p.value)} className="btn btn-ghost !px-2 sm:!px-2.5 !py-1 !text-[11px] sm:!text-[11.5px]">
                    <Wand2 size={11} /> {p.label}
                  </button>
                ))}
                <button onClick={() => setText("")} className="btn btn-ghost ms-auto !px-2 sm:!px-2.5 !py-1 !text-[11px] sm:!text-[11.5px]">
                  <Eraser size={11} /> {t.lab.clear}
                </button>
              </div>
            </div>

            {/* output */}
            <div className="border-t border-white/6 p-4" style={{ background: `linear-gradient(180deg, ${accent}08, transparent)` }}>
              <div className="mb-2 flex items-center gap-2">
                <span className="section-label">{isHash ? t.lab.digest : t.lab.output}</span>
                <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${accent}44, transparent)` }} />
                <button
                  className="btn btn-ghost !px-2.5 !py-1 !text-[11.5px]"
                  disabled={!result.output}
                  onClick={() => {
                    setText(result.output);
                    if (!isHash) setMode(mode === "encrypt" ? "decrypt" : "encrypt");
                  }}
                  title={t.lab.swap}
                >
                  <ArrowLeftRight size={11} /> {t.lab.swap}
                </button>
                <CopyButton value={result.output} label={t.lab.copy} />
              </div>
              <div dir="ltr" className="ltr relative min-h-[74px] overflow-x-auto rounded-xl border bg-black/55 px-3.5 py-3" style={{ borderColor: `${accent}33` }}>
                {result.output ? (
                  <motion.pre key={result.output.slice(0, 40)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mono whitespace-pre-wrap break-all text-[13.5px] sm:text-[14px] font-medium leading-relaxed" style={{ color: accent, textShadow: `0 0 20px ${accent}44` }}>
                    {result.output}
                  </motion.pre>
                ) : (
                  <span className="mono text-[13px] text-white/25">{t.lab.resultEmpty}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ============================ key controls ============================ */}
        <div className="xl:col-span-5">
          <div className="glass h-full rounded-2xl p-4">
            <SectionHead kicker={t.lab.mode} title={t.lab.keys} accent={accent} icon={<KeyRound size={16} />} />
            <KeyControls
              meta={meta}
              t={t}
              lang={lang}
              accent={accent}
              keyState={keyState}
              set={set}
              affineOk={affineOk}
              hillDet={hillDet}
              hillOk={hillOk}
              hillInv={hillInv}
            />
          </div>
        </div>
      </div>

      {/* ============================ visualization ============================ */}
      <div className="glass relative overflow-hidden rounded-2xl p-4 sm:p-5">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="relative">
          <SectionHead kicker={t.lab.viz} title={vizTitle(meta.id, t)} accent={accent} icon={<Sparkles size={16} />} />
          <p className="-mt-3 mb-4 max-w-3xl text-[12px] sm:text-[12.5px] leading-relaxed text-white/45">{vizHint(meta.id, t)}</p>
          <div className="min-h-[150px] overflow-x-auto">
            <Visualization
              meta={meta}
              text={text}
              mode={isHash ? "encrypt" : mode}
              keyState={keyState}
              result={result}
              accent={accent}
              layout={columnarLayout}
              xorRows={xorRows}
              hillInv={hillInv}
            />
          </div>
        </div>
      </div>

      {/* ============================ SHA notice ============================ */}
      {isHash && (
        <div className="glass flex items-start gap-3.5 rounded-2xl p-4" style={{ borderColor: `${accent}33` }}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: `${accent}18`, color: accent }}>
            <Fingerprint size={17} />
          </span>
          <div className="min-w-0">
            <div className="text-[14px] font-bold text-white/92">{t.lab.oneWayTitle}</div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-white/52">{t.errors.oneway}</p>
          </div>
        </div>
      )}

      {/* ============================ SHA extras ============================ */}
      {sha && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="glass rounded-2xl p-4 sm:p-5">
            <SectionHead kicker="digest" title={t.lab.avalanche} accent={accent} icon={<Binary size={16} />} />
            <p className="mb-3 text-[12.5px] leading-relaxed text-white/50">{t.lab.avalancheHint}</p>
            <div dir="ltr" className="ltr space-y-2">
              <div className="rounded-lg border border-white/8 bg-black/40 px-3 py-2">
                <div className="mono text-[10px] text-white/30">INPUT</div>
                <div className="mono truncate text-[12px] text-white/70">{text}</div>
              </div>
              <div className="rounded-lg border border-white/8 bg-black/40 px-3 py-2">
                <div className="mono text-[10px] text-white/30">INPUT + 1 CHAR</div>
                <div className="mono truncate text-[12px] text-white/70">{sha.avalanche.mutated}</div>
              </div>
              <div className="rounded-lg border px-3 py-2" style={{ borderColor: `${accent}33`, background: `${accent}0a` }}>
                <div className="mono text-[10px] text-white/30">H(input)</div>
                <div className="mono break-all text-[11px]" style={{ color: accent }}>{sha.hex}</div>
              </div>
              <div className="rounded-lg border border-[#FF5D73]/30 bg-[#FF5D73]/[0.06] px-3 py-2">
                <div className="mono text-[10px] text-white/30">H(input+1)</div>
                <div className="mono break-all text-[11px] text-[#ff9aa9]">{sha.avalanche.hash}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${accent}, #FF5D73)` }}
                  animate={{ width: `${(sha.avalanche.diffBits / 256) * 100}%` }}
                  transition={{ type: "spring", stiffness: 90, damping: 18 }}
                />
              </div>
              <span className="mono shrink-0 text-[11.5px] sm:text-[12px] font-bold" style={{ color: accent }}>
                {sha.avalanche.diffBits} / 256 {t.lab.flipped}
              </span>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 sm:p-5">
            <SectionHead kicker="attack" title={t.lab.brute} accent="#FF5D73" icon={<Gauge size={16} />} />
            <p className="mb-4 text-[12.5px] leading-relaxed text-white/50">{t.lab.bruteHint}</p>
            <button
              className="btn btn-ghost w-full"
              disabled={brute.state === "run"}
              onClick={() => {
                setBrute({ state: "run" });
                setTimeout(() => {
                  const r = sha256BruteForce(String(result.extras?.hex ?? ""), 3);
                  setBrute({ state: r.found ? "found" : "fail", pre: r.found, tries: r.tries });
                }, 40);
              }}
            >
              {brute.state === "run" ? <Sparkles size={14} className="animate-spin" /> : <Terminal size={14} />}
              {brute.state === "run" ? t.lab.bruteRunning : t.lab.bruteRun}
            </button>
            <AnimatePresence>
              {brute.state !== "idle" && brute.state !== "run" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 rounded-xl border px-4 py-3 ${brute.state === "found" ? "border-[#38E0B0]/35 bg-[#38E0B0]/[0.06]" : "border-white/10 bg-white/[0.02]"}`}
                >
                  <div className="flex items-center gap-2 text-[13px] font-bold" style={{ color: brute.state === "found" ? "#38E0B0" : "rgba(255,255,255,0.8)" }}>
                    {brute.state === "found" ? <Sparkles size={14} /> : <Info size={14} />}
                    {brute.state === "found" ? t.lab.bruteFound : t.lab.bruteFail}
                  </div>
                  {brute.state === "found" && (
                    <div dir="ltr" className="ltr mono mt-1.5 text-[13px] text-[#7ef0cd]">pre-image: "{brute.pre}"</div>
                  )}
                  <div className="mono mt-1.5 text-[11px] text-white/40">
                    {brute.tries?.toLocaleString()} {t.lab.tries}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-4 rounded-xl border border-white/8 bg-black/30 p-3">
              <div className="mono mb-1.5 text-[10px] uppercase tracking-[0.16em] text-white/30">{t.lab.padding}</div>
              <div dir="ltr" className="ltr mono max-h-[70px] overflow-auto break-all text-[10.5px] leading-relaxed text-white/45">
                {String(result.extras?.paddedHex ?? "")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================ trace ============================ */}
      <div className="glass overflow-hidden rounded-2xl">
        <button className="flex w-full items-center gap-3 px-4 sm:px-5 py-4 text-start transition-colors hover:bg-white/[0.02]" onClick={() => setTraceOpen((v) => !v)}>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: `${accent}18`, color: accent }}>
            <Eye size={15} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] sm:text-[15px] font-bold text-white/92">{t.lab.trace}</span>
            <span className="block truncate text-[11.5px] sm:text-[12px] text-white/42">{t.lab.traceHint}</span>
          </span>
          <span className="mono chip">{result.trace.length} {t.lab.steps}</span>
          <motion.span animate={{ rotate: traceOpen ? 180 : 0 }}>
            <ChevronDown size={17} className="text-white/40" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {traceOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 0.8, 0.24, 1] }} className="overflow-hidden">
              <div className="overflow-x-auto border-t border-white/6">
                {result.trace.length === 0 ? (
                  <p className="px-5 py-8 text-center text-[13px] text-white/30">{t.lab.traceEmpty}</p>
                ) : (
                  <>
                    <div dir="ltr" className="ltr mono grid min-w-[620px] grid-cols-[46px_52px_1fr_52px_130px] gap-2 border-b border-white/6 bg-black/30 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-white/30">
                      <span>{t.common.idx}</span>
                      <span>{t.common.token}</span>
                      <span>{t.common.calc}</span>
                      <span className="text-center">{t.common.out}</span>
                      <span className="text-end">{t.common.rule}</span>
                    </div>
                    <div className="max-h-[430px] min-w-[620px] overflow-y-auto">
                      {result.trace.slice(0, traceLimit).map((s, i) => (
                        <motion.div
                          key={i}
                          dir="ltr"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: Math.min(i * 0.012, 0.35) }}
                          className="ltr mono grid grid-cols-[46px_52px_1fr_52px_130px] items-center gap-2 border-b border-white/[0.04] px-4 py-[7px] text-[12px] transition-colors last:border-0 hover:bg-white/[0.03]"
                          style={{ minWidth: 0 }}
                        >
                          <span className="text-white/25">{String(s.idx).padStart(2, "0")}</span>
                          <span className="font-bold" style={{ color: s.kind === "skip" ? "rgba(255,255,255,0.35)" : "#fff" }}>
                            {s.label}
                          </span>
                          <span className="truncate" style={{ color: s.kind === "skip" ? "rgba(255,255,255,0.25)" : `${accent}cc` }} title={s.math}>
                            {s.math}
                          </span>
                          <span className="text-center font-bold" style={{ color: s.kind === "pad" ? "#38E0B0" : s.kind === "skip" ? "rgba(255,255,255,0.3)" : "#fff" }}>
                            {s.output}
                          </span>
                          <span className="truncate text-end text-[10.5px] text-white/35">{s.rule ? t.rules[s.rule as keyof Dict["rules"]] ?? s.rule : ""}</span>
                        </motion.div>
                      ))}
                    </div>
                    {result.trace.length > traceLimit && (
                      <button dir="ltr" className="w-full min-w-[620px] border-t border-white/6 px-4 py-2.5 text-[12px] font-semibold text-white/50 transition-colors hover:bg-white/[0.03] hover:text-white/80" onClick={() => setTraceLimit((l) => l + 80)}>
                        + {Math.min(80, result.trace.length - traceLimit)} more ({result.trace.length - traceLimit} hidden)
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ==================================================================== */
/* key controls                                                         */
/* ==================================================================== */
function KeyControls(props: {
  meta: AlgorithmMeta;
  t: Dict;
  lang: Lang;
  accent: string;
  keyState: KeyState;
  set: (p: Partial<KeyState>) => void;
  affineOk: boolean;
  hillDet: number;
  hillOk: boolean;
  hillInv: number[][] | null;
}) {
  const { meta, t, accent, keyState, set, affineOk, hillDet, hillOk, hillInv } = props;
  const kind = meta.keyKind;

  if (kind === "none" || kind === "hash") {
    return (
      <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 text-[13px] font-bold text-white/85">
          <Info size={14} style={{ color: accent }} />
          {kind === "hash" ? "No key — keyless hash" : "No key required"}
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-white/48">
          {kind === "hash"
            ? "SHA-256 takes only the message. Security comes from the fixed internal constants and the compression function, not from a secret."
            : meta.id === "atbash"
              ? "The mapping is fixed by the alphabet: A↔Z, B↔Y … The key space is exactly one."
              : "The shift is welded at 13 — half of 26. Encryption and decryption are the same operation."}
        </p>
        {kind !== "hash" && (
          <div className="mt-4 overflow-x-auto">
            <AlphabetStrip accent={accent} mapping={(i) => (meta.id === "atbash" ? 25 - i : (i + 13) % 26)} />
          </div>
        )}
        {kind === "hash" && (
          <div dir="ltr" className="ltr mono mt-3 grid grid-cols-4 gap-1.5">
            {["6a09e667", "bb67ae85", "3c6ef372", "a54ff53a", "510e527f", "9b05688c", "1f83d9ab", "5be0cd19"].map((h) => (
              <span key={h} className="rounded border border-white/8 bg-black/40 px-1 py-1 text-center text-[9px] text-white/45">
                {h}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (kind === "shift") {
    return (
      <div className="space-y-4">
        <Slider label={t.lab.shift} value={keyState.shift} min={0} max={25} accent={accent} onChange={(v) => set({ shift: v })} />
        <div className="flex flex-wrap gap-1.5">
          {[1, 3, 7, 13, 19, 25].map((v) => (
            <button key={v} onClick={() => set({ shift: v })} className="mono rounded-lg border px-2.5 py-1 text-[11.5px] font-bold transition-all" style={{ borderColor: keyState.shift === v ? accent : "rgba(255,255,255,0.1)", color: keyState.shift === v ? accent : "rgba(255,255,255,0.45)", background: keyState.shift === v ? `${accent}14` : "transparent" }}>
              k={v}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <AlphabetStrip accent={accent} mapping={(i) => (i + keyState.shift) % 26} />
        </div>
      </div>
    );
  }

  if (kind === "keyword") {
    const kw = cleanKeyword(keyState.keyword);
    return (
      <div className="space-y-4">
        <Field label={t.lab.keyword}>
          <input dir="ltr" className="field mono uppercase" value={keyState.keyword} maxLength={24} onChange={(e) => set({ keyword: e.target.value })} placeholder="MONARCHY" />
        </Field>
        <div dir="ltr" className="ltr flex flex-wrap gap-1">
          {(kw || "—").split("").map((ch, i) => (
            <motion.span key={i} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} className="mono grid h-8 w-8 place-items-center rounded-lg text-[13px] font-bold" style={{ background: `${accent}18`, border: `1px solid ${accent}44`, color: accent }}>
              {ch}
            </motion.span>
          ))}
        </div>
        <div className="mono text-[11px] text-white/38">
          length {kw.length} · period {kw.length} · {meta.id === "playfair" ? `${kw.length} + 25 = grid` : `${Math.pow(26, Math.min(kw.length, 6))}+ keys`}
        </div>
        {meta.id === "playfair" && (
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
            <div className="mono mb-2 text-[10px] uppercase tracking-[0.16em] text-white/32">{t.lab.grid}</div>
            <div dir="ltr" className="ltr grid grid-cols-5 gap-1">
              {buildPlayfairGrid(keyState.keyword).cells.map((ch) => (
                <span key={ch} className="cell-tile h-8 text-[12px]">
                  {ch}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-white/38">{t.lab.gridHint}</p>
          </div>
        )}
      </div>
    );
  }

  if (kind === "rails") {
    return (
      <div className="space-y-4">
        <Slider label={t.lab.rails} value={keyState.rails} min={2} max={9} accent={accent} onChange={(v) => set({ rails: v })} />
        <Slider label={t.lab.offset} value={keyState.offset} min={0} max={11} accent={accent} onChange={(v) => set({ offset: v })} />
        <div className="mono rounded-xl border border-white/8 bg-black/30 p-3 text-[11px] text-white/45">
          cycle length = 2(k−1) = {2 * (keyState.rails - 1)}
        </div>
      </div>
    );
  }

  if (kind === "columnKey") {
    const kw = cleanKeyword(keyState.keyword);
    const order = kw.split("").map((ch, i) => ({ ch, i })).sort((a, b) => (a.ch === b.ch ? a.i - b.i : a.ch < b.ch ? -1 : 1));
    return (
      <div className="space-y-4">
        <Field label={t.lab.keyword}>
          <input dir="ltr" className="field mono uppercase" value={keyState.keyword} maxLength={14} onChange={(e) => set({ keyword: e.target.value })} placeholder="ZEBRA" />
        </Field>
        <div dir="ltr" className="ltr flex flex-wrap gap-1.5">
          {kw.split("").map((ch, i) => {
            const rank = order.findIndex((o) => o.i === i) + 1;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="mono grid h-8 w-8 place-items-center rounded-lg text-[13px] font-bold text-white/80" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {ch}
                </span>
                <span className="mono grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold" style={{ background: `${accent}20`, color: accent }}>
                  {rank}
                </span>
              </div>
            );
          })}
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-white/16">
          <input type="checkbox" checked={keyState.pad} onChange={(e) => set({ pad: e.target.checked })} className="h-4 w-4 accent-[#F5B82E]" />
          <span className="text-[12.5px] text-white/65">{t.lab.padOption}</span>
        </label>
      </div>
    );
  }

  if (kind === "affine") {
    const aInv = modInverse(mod(keyState.a, 26), 26);
    return (
      <div className="space-y-4">
        <Field label={t.lab.multiplier}>
          <div className="flex flex-wrap gap-1.5">
            {VALID_A.map((v) => (
              <button key={v} onClick={() => set({ a: v })} className="mono h-9 w-9 rounded-lg border text-[12.5px] font-bold transition-all hover:-translate-y-0.5" style={{ borderColor: keyState.a === v ? accent : "rgba(255,255,255,0.12)", background: keyState.a === v ? `${accent}1c` : "transparent", color: keyState.a === v ? accent : "rgba(255,255,255,0.5)" }}>
                {v}
              </button>
            ))}
            {[2, 4, 13, 26].map((v) => (
              <button key={v} onClick={() => set({ a: v })} title="invalid on purpose" className="mono h-9 w-9 rounded-lg border border-dashed border-[#FF5D73]/40 text-[12.5px] font-bold text-[#FF5D73]/70 transition-all hover:-translate-y-0.5" style={{ background: keyState.a === v ? "rgba(255,93,115,0.14)" : "transparent" }}>
                {v}
              </button>
            ))}
          </div>
        </Field>
        <Slider label={t.lab.additive} value={keyState.b} min={0} max={25} accent={accent} onChange={(v) => set({ b: v })} />
        <div dir="ltr" className={`ltr mono rounded-xl border px-3 py-2.5 text-[11.5px] ${affineOk ? "border-[#38E0B0]/30 bg-[#38E0B0]/[0.06] text-[#7ef0cd]" : "border-[#FF5D73]/35 bg-[#FF5D73]/[0.07] text-[#ffb3be]"}`}>
          gcd({mod(keyState.a, 26)}, 26) = {gcd(mod(keyState.a, 26), 26)} → {affineOk ? `a⁻¹ = ${aInv}` : "NOT invertible"}
        </div>
      </div>
    );
  }

  if (kind === "matrix") {
    const n = keyState.size;
    const flat = Array.from({ length: n * n }, (_, i) => keyState.matrix[i] ?? 0);
    return (
      <div className="space-y-4">
        <Field label={t.lab.matrixSize}>
          <div className="flex gap-2">
            {([2, 3] as const).map((s) => (
              <button
                key={s}
                onClick={() => set({ size: s, matrix: MATRIX_PRESETS.find((p) => p.size === s)?.m ?? keyState.matrix })}
                className="mono flex-1 rounded-lg border py-2 text-[12.5px] font-bold transition-all"
                style={{ borderColor: n === s ? accent : "rgba(255,255,255,0.12)", background: n === s ? `${accent}18` : "transparent", color: n === s ? accent : "rgba(255,255,255,0.5)" }}
              >
                {s} × {s}
              </button>
            ))}
          </div>
        </Field>

        <div dir="ltr" className="ltr grid gap-1.5" style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}>
          {flat.map((v, i) => (
            <input
              key={i}
              type="number"
              min={0}
              max={25}
              value={v}
              onChange={(e) => {
                const next = [...keyState.matrix];
                next[i] = mod(parseInt(e.target.value || "0", 10), 26);
                set({ matrix: next });
              }}
              className="mono h-12 rounded-lg border bg-black/50 text-center text-[15px] font-bold outline-none transition-all focus:border-[#F5B82E]"
              style={{ borderColor: `${accent}33`, color: accent }}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {MATRIX_PRESETS.filter((p) => p.size === n).map((p) => (
            <button key={p.label} onClick={() => set({ size: p.size, matrix: p.m })} className="mono rounded-lg border border-white/10 px-2 py-1 text-[10.5px] text-white/45 transition-colors hover:border-white/25 hover:text-white/75">
              {p.label}
            </button>
          ))}
        </div>

        <div dir="ltr" className={`ltr mono rounded-xl border px-3 py-2.5 text-[11.5px] ${hillOk ? "border-[#38E0B0]/30 bg-[#38E0B0]/[0.06] text-[#7ef0cd]" : "border-[#FF5D73]/35 bg-[#FF5D73]/[0.07] text-[#ffb3be]"}`}>
          det = {matDet(toMatrix(keyState.matrix, n), n)} → det mod 26 = {hillDet} → gcd = {gcd(hillDet, 26)} {hillOk ? `✓  det⁻¹ = ${modInverse(hillDet, 26)}` : "✗ singular"}
        </div>

        {hillInv && (
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
            <div className="mono mb-2 text-[10px] uppercase tracking-[0.16em] text-white/32">{t.lab.hillInv}</div>
            <div dir="ltr" className="ltr grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}>
              {hillInv.flat().map((v, i) => (
                <span key={i} className="mono grid h-8 place-items-center rounded-md border border-white/8 bg-black/40 text-[12px]" style={{ color: accent }}>
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* xor */
  return (
    <div className="space-y-4">
      <Field label={t.lab.xorKey}>
        <input dir="ltr" className="field mono" value={keyState.xorKey} maxLength={24} onChange={(e) => set({ xorKey: e.target.value })} placeholder="KEY" />
      </Field>
      <Field label={t.lab.xorFormat}>
        <div className="flex gap-2">
          {(["hex", "base64", "bin"] as const).map((f) => (
            <button
              key={f}
              onClick={() => set({ xorOut: f })}
              className="mono flex-1 rounded-lg border py-2 text-[12px] font-bold uppercase transition-all"
              style={{ borderColor: keyState.xorOut === f ? accent : "rgba(255,255,255,0.12)", background: keyState.xorOut === f ? `${accent}18` : "transparent", color: keyState.xorOut === f ? accent : "rgba(255,255,255,0.5)" }}
            >
              {f}
            </button>
          ))}
        </div>
      </Field>
      <div className="mono rounded-xl border border-white/8 bg-black/30 p-3 text-[11px] leading-relaxed text-white/45">
        <div dir="ltr" className="ltr">
          key bytes: {Array.from(new TextEncoder().encode(keyState.xorKey)).map((b) => b.toString(16).padStart(2, "0")).join(" ") || "—"}
        </div>
        <div className="mt-1" dir="ltr">
          0⊕0=0 · 0⊕1=1 · 1⊕0=1 · 1⊕1=0
        </div>
      </div>
    </div>
  );
}

/* ==================================================================== */
/* visualization switcher                                               */
/* ==================================================================== */
function Visualization({
  meta,
  text,
  mode,
  keyState,
  result,
  accent,
  layout,
  xorRows,
  hillInv,
}: {
  meta: AlgorithmMeta;
  text: string;
  mode: Mode;
  keyState: KeyState;
  result: ReturnType<typeof runCipher>;
  accent: string;
  layout: ColumnarLayout | null;
  xorRows: { p: string; k: string; o: string; label: string }[];
  hillInv: number[][] | null;
}) {
  switch (meta.id) {
    case "caesar":
      return (
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <CaesarWheel shift={mod(keyState.shift, 26)} accent={accent} />
          <AlphabetStrip accent={accent} mapping={(i) => (mode === "decrypt" ? mod(i - keyState.shift, 26) : (i + keyState.shift) % 26)} />
        </div>
      );
    case "rot13":
      return (
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <CaesarWheel shift={13} accent={accent} />
          <AlphabetStrip accent={accent} mapping={(i) => (i + 13) % 26} />
        </div>
      );
    case "atbash":
      return (
        <div className="space-y-5">
          <AtbashMirror accent={accent} />
          <AlphabetStrip accent={accent} mapping={(i) => 25 - i} />
        </div>
      );
    case "vigenere":
      return <VigenereStream text={text} keyword={keyState.keyword} accent={accent} mode={mode} />;
    case "playfair":
      return <PlayfairGridViz grid={buildPlayfairGrid(keyState.keyword)} text={text} mode={mode} accent={accent} />;
    case "railfence":
      return <RailFenceViz text={text} rails={keyState.rails} offset={keyState.offset} accent={accent} mode={mode} />;
    case "columnar":
      return layout ? (
        <ColumnarViz layout={layout} keyword={keyState.keyword} accent={accent} />
      ) : (
        <p className="mono py-8 text-center text-[12px] text-white/30">paste the ciphertext produced in encrypt mode</p>
      );
    case "affine":
      return (
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <AffineMapViz a={mod(keyState.a, 26)} b={keyState.b} mode={mode} accent={accent} />
          <div className="space-y-2">
            <AlphabetStrip accent={accent} mapping={(i) => (mode === "decrypt" && props_inv(keyState.a) !== null ? mod(props_inv(keyState.a)! * (i - keyState.b), 26) : mod(keyState.a * i + keyState.b, 26))} />
            <div dir="ltr" className="ltr mono rounded-xl border border-white/8 bg-black/30 px-3 py-2 text-[11.5px] text-white/45">
              E(x) = ({mod(keyState.a, 26)}·x + {keyState.b}) mod 26
            </div>
          </div>
        </div>
      );
    case "hill":
      return (
        <div className="space-y-4">
          <HillViz matrix={toMatrix(keyState.matrix, keyState.size)} size={keyState.size} accent={accent} workLabel="M" />
          {mode === "decrypt" && hillInv && <HillViz matrix={hillInv} size={keyState.size} accent="#38E0B0" workLabel="M⁻¹" />}
          {result.trace.length > 0 && (
            <div dir="ltr" className="ltr flex flex-wrap gap-2 pt-1">
              {result.trace.slice(0, 10).map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-black/40 px-2.5 py-1.5">
                  <span className="mono text-[12px] font-bold text-white/70">{s.label}</span>
                  <span className="mono text-[11px]" style={{ color: accent }}>→</span>
                  <span className="mono text-[12px] font-bold" style={{ color: accent }}>{s.output}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      );
    case "xor":
      return xorRows.length ? (
        <XorViz rows={xorRows} accent={accent} />
      ) : (
        <p className="mono py-8 text-center text-[12px] text-white/30">type a message and a key</p>
      );
    case "sha256":
      return result.extras?.hex ? (
        <ShaViz
          hex={String(result.extras.hex)}
          blocks={Number(result.extras.blockCount)}
          byteLength={Number(result.extras.byteLength)}
          bitLength={Number(result.extras.bitLength)}
          words={(result.extras.words as number[]) ?? []}
          accent={accent}
        />
      ) : (
        <p className="mono py-8 text-center text-[12px] text-white/30">type anything to hash it</p>
      );
  }
}

function props_inv(a: number) {
  return modInverse(mod(a, 26), 26);
}

function vizTitle(id: AlgorithmMeta["id"], t: Dict) {
  const map: Record<string, string> = {
    caesar: t.lab.wheel,
    rot13: t.lab.wheel,
    atbash: t.lab.mirror,
    vigenere: t.lab.keyStream,
    playfair: t.lab.grid,
    railfence: t.lab.fence,
    columnar: t.lab.columns,
    affine: t.lab.affineLine,
    hill: t.lab.blocksTitle,
    xor: t.lab.xorBits,
    sha256: t.lab.digest,
  };
  return map[id] ?? t.lab.viz;
}

function vizHint(id: AlgorithmMeta["id"], t: Dict) {
  const map: Record<string, string> = {
    caesar: t.lab.wheelHint,
    rot13: t.lab.wheelHint,
    atbash: "Every letter maps to its mirror at distance 25 − x. The cipher is its own inverse.",
    vigenere: t.lab.keyStreamHint,
    playfair: t.lab.gridHint,
    railfence: t.lab.fenceHint,
    columnar: t.lab.columnsHint,
    affine: t.lab.affineHint,
    hill: "Each block of n letters becomes a vector; the highlighted row of M produces one ciphertext letter.",
    xor: t.lab.xorHint,
    sha256: "Padding → 512-bit blocks → 16-word schedule → 64 compression rounds → 256-bit digest.",
  };
  return map[id] ?? "";
}

/* ==================================================================== */
/* form primitives                                                      */
/* ==================================================================== */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="section-label mb-2 block">{label}</label>
      {children}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  accent,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  accent: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label className="section-label">{label}</label>
        <span className="mono rounded-md px-2 py-0.5 text-[13px] font-bold" style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}3d` }}>
          {value}
        </span>
      </div>
      <input
        dir="ltr"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full"
        style={{ ["--fill" as string]: `${pct}%` }}
      />
      <div dir="ltr" className="ltr mono mt-1 flex justify-between text-[9.5px] text-white/25">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}