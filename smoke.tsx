import { renderToString } from "react-dom/server";
import App from "./src/App";
import Studio from "./src/components/Studio";
import { ALGORITHMS, DEFAULT_TEXT } from "./src/data/algorithms";
import { UI } from "./src/i18n/ui";
import { defaultKey, runCipher, type Mode } from "./src/lib/ciphers";

const langs = ["en", "ar"] as const;
const tabs = ["explain", "lab"] as const;
const modes: Mode[] = ["encrypt", "decrypt"];
let n = 0;

const html = renderToString(<App />);
n++;
if (!html.includes("Eleven ciphers") && !html.includes("إحدى عشرة")) throw new Error("home hero missing");

for (const lang of langs) {
  for (const tab of tabs) {
    for (const mode of modes) {
      for (const a of ALGORITHMS) {
        const text = mode === "decrypt" ? runCipher(a.id, "encrypt", DEFAULT_TEXT[a.id], defaultKey).output || DEFAULT_TEXT[a.id] : DEFAULT_TEXT[a.id];
        const out = renderToString(
          <Studio
            meta={a}
            lang={lang}
            t={UI[lang]}
            tab={tab}
            setTab={() => {}}
            onBack={() => {}}
            onPick={() => {}}
            text={text}
            setText={() => {}}
            mode={mode}
            setMode={() => {}}
            keyState={{ ...defaultKey }}
            setKeyState={() => {}}
          />
        );
        n++;
        if (!out.includes(a.content[lang].name)) throw new Error(`name missing for ${a.id}/${lang}`);
        if (tab === "lab" && out.length < 4000) throw new Error(`lab too thin for ${a.id}/${lang}`);
      }
    }
  }
}

// invalid-key states must render their validation message, not crash
const bad = [
  { id: "affine" as const, key: { ...defaultKey, a: 13 } },
  { id: "hill" as const, key: { ...defaultKey, size: 2 as const, matrix: [1, 2, 2, 4] } },
  { id: "vigenere" as const, key: { ...defaultKey, keyword: "999" } },
  { id: "playfair" as const, key: { ...defaultKey, keyword: "" } },
  { id: "xor" as const, key: { ...defaultKey, xorKey: "" } },
];
for (const b of bad) {
  const a = ALGORITHMS.find((x) => x.id === b.id)!;
  const out = renderToString(
    <Studio meta={a} lang="ar" t={UI.ar} tab="lab" setTab={() => {}} onBack={() => {}} onPick={() => {}} text="ABCDEF" setText={() => {}} mode="encrypt" setMode={() => {}} keyState={b.key} setKeyState={() => {}} />
  );
  n++;
  const expected: Record<string, string> = {
    affine: "أولية نسبيًا مع 26",
    hill: "غير قابلة للعكس mod 26",
    vigenere: "حرف واحد على الأقل",
    playfair: "حرف واحد على الأقل",
    xor: "مفتاح XOR أولًا",
  };
  if (!out.includes(expected[b.id])) throw new Error(`validation message missing for ${b.id}`);
}

console.log(`✓ rendered ${n} trees without crashing`);
