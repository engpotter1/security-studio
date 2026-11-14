/**
 * Cipher engine — real, working implementations of 11 algorithms
 * with validation and per-character execution traces for the Lab mode.
 */
import { sha256Detailed, sha256 } from "./sha256";

export type Mode = "encrypt" | "decrypt";
export type AlgorithmId =
  | "caesar"
  | "atbash"
  | "rot13"
  | "vigenere"
  | "playfair"
  | "railfence"
  | "columnar"
  | "affine"
  | "hill"
  | "xor"
  | "sha256";

export type TraceStep = {
  idx: number;
  label: string;
  math: string;
  output: string;
  rule?: string;
  kind?: "ok" | "skip" | "pad" | "warn";
  row?: number;
  col?: number;
};

export type KeyState = {
  shift: number;
  a: number;
  b: number;
  keyword: string;
  rails: number;
  offset: number;
  size: 2 | 3;
  matrix: number[];
  xorKey: string;
  xorOut: "hex" | "base64" | "bin";
  pad: boolean;
};

export type CipherResult = {
  output: string;
  trace: TraceStep[];
  errorCode?: "coprime" | "matrix" | "emptyKey" | "oddLength" | "keyword" | "oneway" | "badFormat" | "empty";
  errorDetail?: string;
  extras?: Record<string, unknown>;
};

export const defaultKey: KeyState = {
  shift: 3,
  a: 5,
  b: 8,
  keyword: "SECURITY",
  rails: 3,
  offset: 0,
  size: 2,
  matrix: [3, 3, 2, 5],
  xorKey: "KEY",
  xorOut: "hex",
  pad: true,
};

/* ------------------------------------------------------------------ */
/* math helpers                                                        */
/* ------------------------------------------------------------------ */
export const mod = (n: number, m: number) => ((n % m) + m) % m;

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function egcd(a: number, b: number): [number, number, number] {
  if (b === 0) return [a, 1, 0];
  const [g, x, y] = egcd(b, a % b);
  return [g, y, x - Math.floor(a / b) * y];
}

export function modInverse(a: number, m: number): number | null {
  const [g, x] = egcd(mod(a, m), m);
  if (g !== 1) return null;
  return mod(x, m);
}

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const charIndex = (c: string) => ALPHABET.indexOf(c.toUpperCase());
const toLetter = (i: number) => ALPHABET[mod(i, 26)];
export const isAlpha = (c: string) => /^[A-Za-z]$/.test(c);
export const isUpper = (c: string) => c >= "A" && c <= "Z";

const MAX_TRACE = 420;

/* ------------------------------------------------------------------ */
/* 1 · Caesar / 3 · ROT13 — shift substitution                         */
/* ------------------------------------------------------------------ */
function shiftCipher(text: string, mode: Mode, shift: number, trace: TraceStep[]): string {
  const eff = mode === "decrypt" ? -shift : shift;
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (!isAlpha(ch)) {
      out += ch;
      if (trace.length < MAX_TRACE)
        trace.push({ idx: i, label: ch === " " ? "␣" : ch, math: "—", output: ch, rule: "nonAlpha", kind: "skip" });
      continue;
    }
    const x = charIndex(ch);
    const y = mod(x + eff, 26);
    const res = isUpper(ch) ? ALPHABET[y] : ALPHABET[y].toLowerCase();
    out += res;
    if (trace.length < MAX_TRACE)
      trace.push({
        idx: i,
        label: res,
        math: mode === "decrypt" ? `(${x} − ${shift}) mod 26 = ${y}` : `(${x} + ${shift}) mod 26 = ${y}`,
        output: res,
        rule: "shift",
        kind: "ok",
        row: x,
        col: y,
      });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 2 · Atbash — alphabet reversal                                      */
/* ------------------------------------------------------------------ */
function atbashCipher(text: string, trace: TraceStep[]): string {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (!isAlpha(ch)) {
      out += ch;
      if (trace.length < MAX_TRACE)
        trace.push({ idx: i, label: ch === " " ? "␣" : ch, math: "—", output: ch, rule: "nonAlpha", kind: "skip" });
      continue;
    }
    const x = charIndex(ch);
    const y = 25 - x;
    const res = isUpper(ch) ? ALPHABET[y] : ALPHABET[y].toLowerCase();
    out += res;
    if (trace.length < MAX_TRACE)
      trace.push({ idx: i, label: res, math: `25 − ${x} = ${y}`, output: res, rule: "mirror", kind: "ok", row: x, col: y });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 4 · Vigenère — polyalphabetic keyword substitution                  */
/* ------------------------------------------------------------------ */
export function cleanKeyword(k: string) {
  return k.toUpperCase().replace(/[^A-Z]/g, "");
}

function vigenereCipher(text: string, mode: Mode, keyword: string, trace: TraceStep[]): string {
  const kw = cleanKeyword(keyword);
  let out = "";
  let k = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (!isAlpha(ch)) {
      out += ch;
      if (trace.length < MAX_TRACE)
        trace.push({ idx: i, label: ch === " " ? "␣" : ch, math: "—", output: ch, rule: "nonAlpha", kind: "skip" });
      continue;
    }
    const kc = kw[k % kw.length];
    const s = charIndex(kc);
    const x = charIndex(ch);
    const y = mode === "decrypt" ? mod(x - s, 26) : mod(x + s, 26);
    const res = isUpper(ch) ? ALPHABET[y] : ALPHABET[y].toLowerCase();
    out += res;
    if (trace.length < MAX_TRACE)
      trace.push({
        idx: i,
        label: res,
        math:
          mode === "decrypt"
            ? `(${x} − ${s}) mod 26 = ${y}   [K ${kc}]`
            : `(${x} + ${s}) mod 26 = ${y}   [K ${kc}]`,
        output: res,
        rule: "vigenere",
        kind: "ok",
        row: x,
        col: y,
      });
    k++;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 5 · Playfair — 5×5 digraph matrix                                   */
/* ------------------------------------------------------------------ */
export type PlayfairGrid = { cells: string[]; pos: Record<string, [number, number]> };

export function buildPlayfairGrid(keyword: string): PlayfairGrid {
  const kw = cleanKeyword(keyword).replace(/J/g, "I");
  const seq: string[] = [];
  for (const c of kw + ALPHABET.replace("J", "")) if (!seq.includes(c)) seq.push(c);
  const pos: Record<string, [number, number]> = {};
  seq.forEach((c, i) => (pos[c] = [Math.floor(i / 5), i % 5]));
  return { cells: seq, pos };
}

function preparePlayfair(text: string, mode: Mode): { chars: string[]; injected: number[] } {
  let clean = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "").split("");
  const injected: number[] = [];
  if (mode === "encrypt") {
    const out: string[] = [];
    let i = 0;
    while (i < clean.length) {
      const a = clean[i];
      const b = clean[i + 1];
      out.push(a);
      if (b === undefined) {
        out.push(a === "X" ? "Q" : "X");
        injected.push(out.length - 1);
        i += 1;
      } else if (a === b) {
        out.push(a === "X" ? "Q" : "X");
        injected.push(out.length - 1);
        i += 1;
      } else {
        out.push(b);
        i += 2;
      }
    }
    clean = out;
  } else if (clean.length % 2 === 1) {
    clean.push("X");
    injected.push(clean.length - 1);
  }
  return { chars: clean, injected };
}

function playfairCipher(text: string, mode: Mode, trace: TraceStep[], grid: PlayfairGrid): string {
  const { chars, injected } = preparePlayfair(text, mode);
  const dir = mode === "decrypt" ? -1 : 1;
  let out = "";
  for (let p = 0; p < chars.length; p += 2) {
    const a = chars[p];
    const b = chars[p + 1];
    const [r1, c1] = grid.pos[a];
    const [r2, c2] = grid.pos[b];
    let ra = r1;
    let ca = c1;
    let rb = r2;
    let cb = c2;
    let rule: string;
    if (r1 === r2) {
      ca = mod(c1 + dir, 5);
      cb = mod(c2 + dir, 5);
      rule = "sameRow";
    } else if (c1 === c2) {
      ra = mod(r1 + dir, 5);
      rb = mod(r2 + dir, 5);
      rule = "sameCol";
    } else {
      ca = c2;
      cb = c1;
      rule = "rectangle";
    }
    const oa = grid.cells[ra * 5 + ca];
    const ob = grid.cells[rb * 5 + cb];
    out += oa + ob;
    if (trace.length < MAX_TRACE) {
      trace.push({
        idx: p,
        label: `${a}${b}`,
        math:
          rule === "sameRow"
            ? `row ${r1 + 1}: col ${c1 + 1} → ${ca + 1}, col ${c2 + 1} → ${cb + 1}`
            : rule === "sameCol"
              ? `col ${c1 + 1}: row ${r1 + 1} → ${ra + 1}, row ${r2 + 1} → ${rb + 1}`
              : `(${r1 + 1},${c1 + 1})×(${r2 + 1},${c2 + 1}) → corners swap`,
        output: `${oa}${ob}`,
        rule,
        kind: injected.includes(p) || injected.includes(p + 1) ? "pad" : "ok",
        row: r1,
        col: c1,
      });
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 6 · Rail Fence — zig-zag transposition                              */
/* ------------------------------------------------------------------ */
export function railOf(i: number, rails: number, offset: number) {
  const cycle = 2 * (rails - 1);
  const p = mod(i + offset, cycle);
  return p < rails ? p : cycle - p;
}

function railEncrypt(text: string, rails: number, offset: number, trace: TraceStep[]) {
  const rows: string[][] = Array.from({ length: rails }, () => []);
  const path: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const r = railOf(i, rails, offset);
    rows[r].push(text[i]);
    path.push(r);
    if (trace.length < MAX_TRACE)
      trace.push({
        idx: i,
        label: text[i] === " " ? "␣" : text[i],
        math: `rail ${r + 1}`,
        output: text[i] === " " ? "␣" : text[i],
        rule: "rail",
        kind: "ok",
        row: r,
      });
  }
  const out = rows.map((r) => r.join("")).join("");
  return { out, path, rows };
}

function railDecrypt(ct: string, rails: number, offset: number, trace: TraceStep[]) {
  const n = ct.length;
  const lengths = new Array(rails).fill(0);
  const path: number[] = [];
  for (let i = 0; i < n; i++) {
    const r = railOf(i, rails, offset);
    path.push(r);
    lengths[r]++;
  }
  const rows: string[][] = [];
  let cursor = 0;
  for (let r = 0; r < rails; r++) {
    rows.push(ct.slice(cursor, cursor + lengths[r]).split(""));
    cursor += lengths[r];
  }
  const ptr = new Array(rails).fill(0);
  let out = "";
  for (let i = 0; i < n; i++) {
    const r = path[i];
    out += rows[r][ptr[r]++];
    if (trace.length < MAX_TRACE)
      trace.push({
        idx: i,
        label: out[out.length - 1] === " " ? "␣" : out[out.length - 1],
        math: `rail ${r + 1} → slot ${i + 1}`,
        output: out[out.length - 1],
        rule: "rail",
        kind: "ok",
        row: r,
      });
  }
  return { out, path, rows };
}

/* ------------------------------------------------------------------ */
/* 7 · Columnar transposition                                          */
/* ------------------------------------------------------------------ */
export function columnOrder(keyword: string): number[] {
  const kw = cleanKeyword(keyword);
  return kw
    .split("")
    .map((c, i) => ({ c, i }))
    .sort((x, y) => (x.c === y.c ? x.i - y.i : x.c < y.c ? -1 : 1))
    .map((o) => o.i);
}

export type ColumnarLayout = {
  cols: number;
  rows: number;
  order: number[];
  readOrder: number[];
  grid: (string | null)[][];
};

export function buildColumnarLayout(text: string, keyword: string, pad: boolean): ColumnarLayout {
  const kw = cleanKeyword(keyword);
  const cols = kw.length || 1;
  const n = text.length;
  const rows = Math.max(1, Math.ceil(n / cols));
  const grid: (string | null)[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const i = r * cols + c;
      if (i < n) return text[i];
      return pad ? "X" : null;
    })
  );
  const order = columnOrder(keyword); // order[k] = original column index read at position k
  const readOrder = new Array(cols).fill(0);
  order.forEach((colIdx, k) => (readOrder[colIdx] = k + 1));
  return { cols, rows, order, readOrder, grid };
}

function columnarEncrypt(text: string, keyword: string, pad: boolean, trace: TraceStep[]) {
  const kw = cleanKeyword(keyword);
  const layout = buildColumnarLayout(text, keyword, pad);
  let out = "";
  layout.order.forEach((colIdx, k) => {
    let col = "";
    for (let r = 0; r < layout.rows; r++) col += layout.grid[r][colIdx] ?? "";
    out += col;
    if (trace.length < MAX_TRACE)
      trace.push({
        idx: k,
        label: kw[colIdx],
        math: `read column ${k + 1} (key letter ${kw[colIdx]})`,
        output: col || "∅",
        rule: "column",
        kind: "ok",
        col: colIdx,
      });
  });
  return { out, layout };
}

function columnarDecrypt(ct: string, keyword: string, trace: TraceStep[]) {
  const kw = cleanKeyword(keyword);
  const cols = kw.length || 1;
  const n = ct.length;
  const rows = Math.max(1, Math.ceil(n / cols));
  const full = n % cols === 0 ? cols : n % cols;
  const lengths = new Array(cols).fill(rows - 1);
  for (let j = 0; j < full; j++) lengths[j] = rows;
  const order = columnOrder(keyword);
  const grid: (string | null)[][] = Array.from({ length: rows }, () => new Array(cols).fill(null));
  let cursor = 0;
  order.forEach((colIdx, k) => {
    const len = lengths[colIdx];
    const chunk = ct.slice(cursor, cursor + len);
    cursor += len;
    for (let r = 0; r < len; r++) grid[r][colIdx] = chunk[r] ?? null;
    if (trace.length < MAX_TRACE)
      trace.push({
        idx: k,
        label: kw[colIdx],
        math: `column ${k + 1} gets ${len} chars → slot ${colIdx + 1}`,
        output: chunk || "∅",
        rule: "column",
        kind: "ok",
        col: colIdx,
      });
  });
  let out = "";
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out += grid[r][c] ?? "";
  const readOrder = new Array(cols).fill(0);
  order.forEach((colIdx, k) => (readOrder[colIdx] = k + 1));
  return { out, layout: { cols, rows, order, readOrder, grid } as ColumnarLayout };
}

/* ------------------------------------------------------------------ */
/* 8 · Affine — E(x) = (a·x + b) mod 26 (implemented in dispatcher)    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* 9 · Hill — matrix multiplication mod 26                             */
/* ------------------------------------------------------------------ */
export function matDet(M: number[][], n: number): number {
  if (n === 1) return M[0][0];
  if (n === 2) return M[0][0] * M[1][1] - M[0][1] * M[1][0];
  let det = 0;
  for (let j = 0; j < n; j++) {
    const minor = M.slice(1).map((row) => row.filter((_, c) => c !== j));
    det += (j % 2 === 0 ? 1 : -1) * M[0][j] * matDet(minor, n - 1);
  }
  return det;
}

export function matInverseMod26(M: number[][], n: number): number[][] | null {
  const det = matDet(M, n);
  const detMod = mod(det, 26);
  if (detMod === 0 || gcd(detMod, 26) !== 1) return null;
  const detInv = modInverse(detMod, 26)!;
  const inv: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const minor = M.map((row) => row.filter((_, c) => c !== i)).filter((_, r) => r !== j);
      const cof = ((i + j) % 2 === 0 ? 1 : -1) * matDet(minor, n - 1);
      inv[i][j] = mod(cof * detInv, 26);
    }
  }
  return inv;
}

export function toMatrix(flat: number[], n: number): number[][] {
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => mod(flat[i * n + j] ?? 0, 26)));
}

function hillCipher(text: string, mode: Mode, M: number[][], n: number, trace: TraceStep[]) {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, "").split("");
  while (clean.length % n !== 0) clean.push("X");
  const work = mode === "decrypt" ? matInverseMod26(M, n) : M;
  if (!work) return { out: "", invalid: true };
  let out = "";
  for (let s = 0; s < clean.length; s += n) {
    const block = clean.slice(s, s + n).map(charIndex);
    const res = work.map((row) => mod(row.reduce((acc, v, j) => acc + v * block[j], 0), 26));
    const letters = res.map(toLetter);
    out += letters.join("");
    if (trace.length < MAX_TRACE) {
      const math = work
        .map((row, i) => `${row.map((v, j) => `${v}·${block[j]}`).join(" + ")} = ${res[i]}`)
        .join("   |   ");
      trace.push({
        idx: s / n,
        label: block.map(toLetter).join(""),
        math: `${math}  (mod 26)`,
        output: letters.join(""),
        rule: "hill",
        kind: clean.slice(s, s + n).some((c, i) => c === "X" && s + i >= text.replace(/[^A-Za-z]/g, "").length) ? "pad" : "ok",
      });
    }
  }
  return { out, invalid: false, work };
}

/* ------------------------------------------------------------------ */
/* 10 · XOR — bitwise stream cipher                                    */
/* ------------------------------------------------------------------ */
export function bytesToHex(b: Uint8Array) {
  return Array.from(b)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join(" ");
}
export function bytesToBin(b: Uint8Array) {
  return Array.from(b)
    .map((x) => x.toString(2).padStart(8, "0"))
    .join(" ");
}
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export function bytesToBase64(b: Uint8Array) {
  let out = "";
  for (let i = 0; i < b.length; i += 3) {
    const n = (b[i] << 16) | ((b[i + 1] ?? 0) << 8) | (b[i + 2] ?? 0);
    out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + (i + 1 < b.length ? B64[(n >> 6) & 63] : "=") + (i + 2 < b.length ? B64[n & 63] : "=");
  }
  return out;
}
export function base64ToBytes(s: string): Uint8Array | null {
  const clean = s.replace(/[^A-Za-z0-9+/=]/g, "");
  if (clean.length === 0 || clean.length % 4 !== 0) return null;
  const out: number[] = [];
  for (let i = 0; i < clean.length; i += 4) {
    const v = [0, 1, 2, 3].map((k) => (clean[i + k] === "=" || clean[i + k] === undefined ? -1 : B64.indexOf(clean[i + k])));
    if (v.some((x) => x === -2)) return null;
    const n = ((v[0] < 0 ? 0 : v[0]) << 18) | ((v[1] < 0 ? 0 : v[1]) << 12) | ((v[2] < 0 ? 0 : v[2]) << 6) | (v[3] < 0 ? 0 : v[3]);
    out.push((n >> 16) & 255);
    if (v[2] >= 0) out.push((n >> 8) & 255);
    if (v[3] >= 0) out.push(n & 255);
  }
  return new Uint8Array(out);
}
export function hexToBytes(s: string): Uint8Array | null {
  const clean = s.replace(/[^0-9a-fA-F]/g, "");
  if (clean.length === 0 || clean.length % 2 !== 0) return null;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
  return out;
}
export function binToBytes(s: string): Uint8Array | null {
  const groups = s.split(/[^01]+/).filter((g) => g.length > 0);
  const joined = groups.join("");
  if (joined.length === 0 || joined.length % 8 !== 0) return null;
  const out = new Uint8Array(joined.length / 8);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(joined.substr(i * 8, 8), 2);
  return out;
}

function xorCipher(text: string, mode: Mode, key: string, fmt: KeyState["xorOut"], trace: TraceStep[]): CipherResult {
  const kb = new TextEncoder().encode(key);
  if (kb.length === 0) return { output: "", trace, errorCode: "emptyKey" };
  if (text.trim().length === 0) return { output: "", trace, errorCode: "empty" };

  let data: Uint8Array;
  if (mode === "encrypt") {
    data = new TextEncoder().encode(text);
  } else {
    const parsed = fmt === "hex" ? hexToBytes(text) : fmt === "base64" ? base64ToBytes(text) : binToBytes(text);
    if (!parsed) return { output: "", trace, errorCode: "badFormat", errorDetail: fmt };
    data = parsed;
  }

  const res = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) res[i] = data[i] ^ kb[i % kb.length];

  const output = mode === "decrypt" ? new TextDecoder().decode(res) : fmt === "hex" ? bytesToHex(res) : fmt === "base64" ? bytesToBase64(res) : bytesToBin(res);

  const shown = Math.min(data.length, 48);
  for (let i = 0; i < shown; i++) {
    const p = data[i];
    const k = kb[i % kb.length];
    const o = res[i];
    trace.push({
      idx: i,
      label: mode === "decrypt" ? String.fromCharCode(o) : String.fromCharCode(p),
      math: `${p.toString(2).padStart(8, "0")} ⊕ ${k.toString(2).padStart(8, "0")}`,
      output: o.toString(2).padStart(8, "0"),
      rule: "xor",
      kind: "ok",
    });
  }
  return { output, trace, extras: { bytes: data.length } };
}

/* ------------------------------------------------------------------ */
/* 11 · SHA-256                                                        */
/* ------------------------------------------------------------------ */
function shaRun(text: string, mode: Mode, trace: TraceStep[]): CipherResult {
  if (mode === "decrypt") {
    return { output: "", trace, errorCode: "oneway" };
  }
  if (text.length === 0) return { output: "", trace, errorCode: "empty" };
  const d = sha256Detailed(text);
  d.rounds.forEach((r, i) => {
    if (i % 4 === 0 && trace.length < MAX_TRACE)
      trace.push({
        idx: r.i,
        label: `t=${r.i}`,
        math: `W=${r.W.toString(16).padStart(8, "0")}  T1=${r.T1.toString(16).padStart(8, "0")}  T2=${r.T2.toString(16).padStart(8, "0")}`,
        output: r.state.map((x) => x.toString(16).padStart(8, "0")).slice(0, 4).join(" "),
        rule: "round",
        kind: "ok",
      });
  });

  // Avalanche demonstration: flip the last character and compare digests
  const mutated = text.slice(0, -1) + String.fromCharCode(text.charCodeAt(text.length - 1) + 1);
  const h2 = sha256(mutated);
  let diffBits = 0;
  for (let i = 0; i < 64; i++) {
    let x = parseInt(d.hex[i], 16) ^ parseInt(h2[i], 16);
    while (x) {
      diffBits += x & 1;
      x >>= 1;
    }
  }
  return {
    output: d.hex,
    trace,
    extras: {
      hex: d.hex,
      byteLength: d.byteLength,
      bitLength: d.bitLength,
      blockCount: d.blockCount,
      paddedHex: d.paddedHex,
      words: d.firstBlockWords,
      avalanche: { mutated, hash: h2, diffBits },
    },
  };
}

export function sha256BruteForce(target: string, maxLen = 3) {
  const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  const t = target.toLowerCase().trim();
  let tries = 0;
  const cand: string[] = [""];
  for (let len = 1; len <= maxLen; len++) {
    const next: string[] = [];
    for (const pre of cand) {
      for (const c of charset) {
        const s = pre + c;
        tries++;
        if (sha256(s) === t) return { found: s, tries };
        next.push(s);
      }
    }
    cand.length = 0;
    cand.push(...next);
  }
  return { found: null, tries };
}

/* ------------------------------------------------------------------ */
/* dispatcher                                                          */
/* ------------------------------------------------------------------ */
export function runCipher(id: AlgorithmId, mode: Mode, text: string, key: KeyState): CipherResult {
  const trace: TraceStep[] = [];
  switch (id) {
    case "caesar": {
      if (text.length === 0) return { output: "", trace, errorCode: "empty" };
      return { output: shiftCipher(text, mode, mod(key.shift, 26), trace), trace };
    }
    case "rot13": {
      if (text.length === 0) return { output: "", trace, errorCode: "empty" };
      return { output: shiftCipher(text, mode, 13, trace), trace };
    }
    case "atbash": {
      if (text.length === 0) return { output: "", trace, errorCode: "empty" };
      return { output: atbashCipher(text, trace), trace };
    }
    case "vigenere": {
      if (text.length === 0) return { output: "", trace, errorCode: "empty" };
      if (cleanKeyword(key.keyword).length === 0) return { output: "", trace, errorCode: "keyword" };
      return { output: vigenereCipher(text, mode, key.keyword, trace), trace };
    }
    case "playfair": {
      if (text.length === 0) return { output: "", trace, errorCode: "empty" };
      if (cleanKeyword(key.keyword).length === 0) return { output: "", trace, errorCode: "keyword" };
      const grid = buildPlayfairGrid(key.keyword);
      return { output: playfairCipher(text, mode, trace, grid), trace, extras: { grid } };
    }
    case "railfence": {
      if (text.length === 0) return { output: "", trace, errorCode: "empty" };
      const rails = Math.max(2, Math.min(12, key.rails));
      const r = mode === "decrypt" ? railDecrypt(text, rails, key.offset, trace) : railEncrypt(text, rails, key.offset, trace);
      return { output: r.out, trace, extras: { path: r.path, rails, rows: r.rows } };
    }
    case "columnar": {
      if (text.length === 0) return { output: "", trace, errorCode: "empty" };
      if (cleanKeyword(key.keyword).length === 0) return { output: "", trace, errorCode: "keyword" };
      const r = mode === "decrypt" ? columnarDecrypt(text, key.keyword, trace) : columnarEncrypt(text, key.keyword, key.pad, trace);
      return { output: r.out, trace, extras: { layout: r.layout } };
    }
    case "affine": {
      if (text.length === 0) return { output: "", trace, errorCode: "empty" };
      const a = mod(key.a, 26);
      if (gcd(a, 26) !== 1) return { output: "", trace, errorCode: "coprime", errorDetail: String(a) };
      const aInv = modInverse(a, 26)!;
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (!isAlpha(ch)) {
          out += ch;
          if (trace.length < MAX_TRACE)
            trace.push({ idx: i, label: ch === " " ? "␣" : ch, math: "—", output: ch, rule: "nonAlpha", kind: "skip" });
          continue;
        }
        const x = charIndex(ch);
        const y = mode === "decrypt" ? mod(aInv * (x - key.b), 26) : mod(a * x + key.b, 26);
        const res = isUpper(ch) ? ALPHABET[y] : ALPHABET[y].toLowerCase();
        out += res;
        if (trace.length < MAX_TRACE)
          trace.push({
            idx: i,
            label: res,
            math:
              mode === "decrypt"
                ? `${aInv} × (${x} − ${key.b}) mod 26 = ${y}`
                : `(${a} × ${x} + ${key.b}) mod 26 = ${mod(a * x + key.b, 26 * 100)} mod 26 = ${y}`,
            output: res,
            rule: "affine",
            kind: "ok",
            row: x,
            col: y,
          });
      }
      return { output: out, trace, extras: { aInv } };
    }
    case "hill": {
      if (text.length === 0) return { output: "", trace, errorCode: "empty" };
      const n = key.size;
      const M = toMatrix(key.matrix, n);
      const det = mod(matDet(M, n), 26);
      if (det === 0 || gcd(det, 26) !== 1) return { output: "", trace, errorCode: "matrix", errorDetail: String(det) };
      const r = hillCipher(text, mode, M, n, trace);
      return {
        output: r.out,
        trace,
        extras: { det, work: r.work, matrix: M },
      };
    }
    case "xor":
      return xorCipher(text, mode, key.xorKey, key.xorOut, trace);
    case "sha256":
      return shaRun(text, mode, trace);
  }
}
