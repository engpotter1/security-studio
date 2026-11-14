import type { AlgorithmId } from "../lib/ciphers";
import type { AlgorithmMeta, AlgoContent, Localized } from "./types";
import { contentA } from "./content-a";
import { contentB } from "./content-b";

const content = { ...contentA, ...contentB } as Record<AlgorithmId, Localized<AlgoContent>>;

type Meta = Omit<AlgorithmMeta, "content">;

const meta: Meta[] = [
  { id: "caesar", n: 1, category: "mono", accent: "#F5B82E", glyph: "+k", keyKind: "shift", strength: 1, era: "100 BC", keyspace: "25 keys" },
  { id: "atbash", n: 2, category: "mono", accent: "#57B8FF", glyph: "⇄", keyKind: "none", strength: 0, era: "500 BC", keyspace: "1 mapping" },
  { id: "rot13", n: 3, category: "mono", accent: "#FFD37A", glyph: "13", keyKind: "none", strength: 0, era: "1980s", keyspace: "1 mapping" },
  { id: "vigenere", n: 4, category: "poly", accent: "#38E0B0", glyph: "Kⁿ", keyKind: "keyword", strength: 2, era: "1553", keyspace: "26ⁿ" },
  { id: "playfair", n: 5, category: "digraph", accent: "#9D8CFF", glyph: "5×5", keyKind: "keyword", strength: 3, era: "1854", keyspace: "≈ 25!" },
  { id: "railfence", n: 6, category: "transposition", accent: "#FF8A5B", glyph: "∿", keyKind: "rails", strength: 1, era: "Antiquity", keyspace: "n ÷ 2 rails" },
  { id: "columnar", n: 7, category: "transposition", accent: "#6EE7F9", glyph: "▦", keyKind: "columnKey", strength: 2, era: "1890s", keyspace: "n! orders" },
  { id: "affine", n: 8, category: "math", accent: "#FFC46B", glyph: "ax+b", keyKind: "affine", strength: 1, era: "19th c.", keyspace: "312 pairs" },
  { id: "hill", n: 9, category: "math", accent: "#7FA8FF", glyph: "Mₙ", keyKind: "matrix", strength: 2, era: "1929", keyspace: "|GL(n, ℤ₂₆)|" },
  { id: "xor", n: 10, category: "modern", accent: "#FF5D73", glyph: "⊕", keyKind: "xor", strength: 3, era: "1919", keyspace: "2^(8·|K|)" },
  { id: "sha256", n: 11, category: "modern", accent: "#F0DFA8", glyph: "256", keyKind: "hash", strength: 5, era: "2001", keyspace: "no key" },
];

export const ALGORITHMS: AlgorithmMeta[] = meta.map((m) => ({ ...m, content: content[m.id] }));

export const byId = (id: AlgorithmId): AlgorithmMeta => ALGORITHMS.find((a) => a.id === id) ?? ALGORITHMS[0];

export const CATEGORY_ORDER = ["mono", "poly", "digraph", "transposition", "math", "modern"] as const;

/** Default working text per algorithm, used to prefill the lab. */
export const DEFAULT_TEXT: Record<AlgorithmId, string> = {
  caesar: "MEET ME AT THE SENATE",
  atbash: "CRYPTOGRAPHY IS THE ART OF SECRETS",
  rot13: "THE BUTLER DID IT",
  vigenere: "ATTACK AT DAWN",
  playfair: "HIDE THE GOLD",
  railfence: "WE ARE DISCOVERED FLEE AT ONCE",
  columnar: "CONVOY DEPARTS AT MIDNIGHT",
  affine: "AFFINE CIPHER",
  hill: "HILL CIPHER BLOCKS",
  xor: "LAUNCH AT MIDNIGHT",
  sha256: "The quick brown fox jumps over the lazy dog",
};
