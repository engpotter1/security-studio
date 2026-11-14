import type { AlgorithmId } from "../lib/ciphers";

export type Lang = "ar" | "en";
export type Localized<T> = Record<Lang, T>;

export type CategoryKey = "mono" | "poly" | "digraph" | "transposition" | "math" | "modern";

export type KeyKind = "shift" | "none" | "keyword" | "rails" | "columnKey" | "affine" | "matrix" | "xor" | "hash";

export type FormulaSymbol = { sym: string; meaning: string };

export type WorkedStep = { title: string; body: string; math?: string };

export type AlgoContent = {
  name: string;
  tagline: string;
  history: string;
  what: string[];
  how: { title: string; body: string; math?: string }[];
  formula: { display: string; caption: string; symbols: FormulaSymbol[] };
  example: { plaintext: string; keyLabel: string; keyValue: string; steps: WorkedStep[]; ciphertext: string };
  strengths: string[];
  weaknesses: string[];
  attacks: { name: string; desc: string; cost: string }[];
  verdict: string;
  lab: { inputPlaceholder: string; presets: { label: string; value: string }[] };
};

export type AlgorithmMeta = {
  id: AlgorithmId;
  n: number;
  category: CategoryKey;
  accent: string;
  glyph: string;
  keyKind: KeyKind;
  strength: number;
  era: string;
  keyspace: string;
  content: Localized<AlgoContent>;
};
