/**
 * SHA-256 — pure TypeScript implementation (FIPS 180-4).
 * Exposes internals (padding, message schedule, compression rounds)
 * so the studio can visualize the algorithm step by step.
 */

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

export const SHA256_IV = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
];

const rotr = (x: number, n: number) => ((x >>> n) | (x << (32 - n))) >>> 0;

export type ShaRound = {
  i: number;
  W: number;
  T1: number;
  T2: number;
  state: number[];
};

export type Sha256Details = {
  hex: string;
  messageBytes: Uint8Array;
  byteLength: number;
  bitLength: number;
  blockCount: number;
  paddedHex: string;
  firstBlockWords: number[];
  rounds: ShaRound[];
  H: number[];
};

export function sha256Bytes(data: Uint8Array, withDetails = false): Sha256Details {
  const msgLen = data.length;
  const bitLen = msgLen * 8;

  // Padding: 0x80, zeros, then 64-bit big-endian length
  const paddedLen = (((msgLen + 9 + 63) >> 6) << 6);
  const padded = new Uint8Array(paddedLen);
  padded.set(data);
  padded[msgLen] = 0x80;
  // 64-bit big endian length (we only support < 2^32 bits here)
  const hi = Math.floor(bitLen / 4294967296) >>> 0;
  const lo = bitLen >>> 0;
  padded[paddedLen - 8] = (hi >>> 24) & 0xff;
  padded[paddedLen - 7] = (hi >>> 16) & 0xff;
  padded[paddedLen - 6] = (hi >>> 8) & 0xff;
  padded[paddedLen - 5] = hi & 0xff;
  padded[paddedLen - 4] = (lo >>> 24) & 0xff;
  padded[paddedLen - 3] = (lo >>> 16) & 0xff;
  padded[paddedLen - 2] = (lo >>> 8) & 0xff;
  padded[paddedLen - 1] = lo & 0xff;

  const H = new Uint32Array(SHA256_IV);
  const w = new Uint32Array(64);
  const blockCount = paddedLen >> 6;
  const rounds: ShaRound[] = [];
  let firstBlockWords: number[] = [];

  for (let b = 0; b < blockCount; b++) {
    const off = b * 64;
    for (let t = 0; t < 16; t++) {
      w[t] =
        ((padded[off + t * 4] << 24) |
          (padded[off + t * 4 + 1] << 16) |
          (padded[off + t * 4 + 2] << 8) |
          padded[off + t * 4 + 3]) >>>
        0;
    }
    if (b === 0) firstBlockWords = Array.from(w.slice(0, 16));

    for (let t = 16; t < 64; t++) {
      const x = w[t - 15];
      const y = w[t - 2];
      const s0 = (rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3)) >>> 0;
      const s1 = (rotr(y, 17) ^ rotr(y, 19) ^ (y >>> 10)) >>> 0;
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
    }

    let [a, bb, c, d, e, f, g, h] = H;

    for (let t = 0; t < 64; t++) {
      const S1 = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0;
      const ch = ((e & f) ^ (~e & g)) >>> 0;
      const temp1 = (h + S1 + ch + K[t] + w[t]) >>> 0;
      const S0 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0;
      const maj = ((a & bb) ^ (a & c) ^ (bb & c)) >>> 0;
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = bb;
      bb = a;
      a = (temp1 + temp2) >>> 0;

      if (b === 0 && withDetails) {
        rounds.push({ i: t, W: w[t], T1: temp1, T2: temp2, state: [a, bb, c, d, e, f, g, h] });
      }
    }

    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + bb) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }

  let hex = "";
  for (let i = 0; i < 8; i++) hex += H[i].toString(16).padStart(8, "0");

  let paddedHex = "";
  const limit = Math.min(padded.length, 256);
  for (let i = 0; i < limit; i++) paddedHex += padded[i].toString(16).padStart(2, "0");
  if (padded.length > limit) paddedHex += "…";

  return {
    hex,
    messageBytes: data,
    byteLength: msgLen,
    bitLength: bitLen,
    blockCount,
    paddedHex,
    firstBlockWords,
    rounds,
    H: Array.from(H),
  };
}

export function sha256(message: string): string {
  return sha256Bytes(new TextEncoder().encode(message)).hex;
}

export function sha256Detailed(message: string): Sha256Details {
  return sha256Bytes(new TextEncoder().encode(message), true);
}
