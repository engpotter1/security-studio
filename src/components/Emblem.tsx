import type { AlgorithmId } from "../lib/ciphers";

/** Hand-drawn cryptographic emblems — one per algorithm. */
export default function Emblem({ id, size = 26 }: { id: AlgorithmId; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (id) {
    case "caesar":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" strokeOpacity=".45" />
          <circle cx="12" cy="12" r="5.2" />
          <path d="M12 3v3.2M21 12h-3.2M12 21v-3.2M3 12h3.2" strokeOpacity=".45" />
          <path d="M14.6 9.4 17 7" />
          <path d="M16.2 6.4 17.4 7.6" />
        </svg>
      );
    case "atbash":
      return (
        <svg {...p}>
          <path d="M12 3v18" strokeOpacity=".5" strokeDasharray="2 2" />
          <path d="M4 7h5M4 12h5M4 17h5" />
          <path d="M15 7h5M15 12h5M15 17h5" strokeOpacity=".55" />
          <path d="m9 7 6 10M9 17l6-10" strokeOpacity=".8" />
        </svg>
      );
    case "rot13":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" strokeOpacity=".4" />
          <path d="M12 3a9 9 0 0 1 0 18" />
          <path d="M12 3a9 9 0 0 0 0 18" strokeDasharray="2.4 2.6" strokeOpacity=".7" />
          <path d="M9.6 9.2h1.6a1.6 1.6 0 0 1 0 3.2H9.6m3.6-3.2H14a1.6 1.6 0 0 1 0 3.2h-.8M9.6 9.2v6.2M13.2 9.2v6.2" strokeWidth="1.2" />
        </svg>
      );
    case "vigenere":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="16" rx="2" strokeOpacity=".4" />
          <path d="M3 8h18M3 12h18M3 16h18" strokeOpacity=".35" />
          <path d="M7 4v16" strokeOpacity=".35" />
          <rect x="7" y="8" width="4" height="4" fill="currentColor" stroke="none" opacity=".85" />
          <rect x="13" y="12" width="4" height="4" fill="currentColor" stroke="none" opacity=".5" />
        </svg>
      );
    case "playfair":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="18" height="18" rx="2.5" strokeOpacity=".4" />
          <path d="M8.4 3v18M13.8 3v18M3 8.4h18M3 13.8h18" strokeOpacity=".3" />
          <circle cx="5.7" cy="5.7" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
          <path d="M5.7 5.7 16.5 16.5" strokeDasharray="2 2" />
        </svg>
      );
    case "railfence":
      return (
        <svg {...p}>
          <path d="M2 6h20M2 12h20M2 18h20" strokeOpacity=".25" />
          <path d="M2 6 7 12 12 6 17 12 22 6" />
          <path d="M2 18 7 12 12 18 17 12 22 18" strokeOpacity=".55" />
          <circle cx="7" cy="12" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="17" cy="12" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      );
    case "columnar":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="18" height="18" rx="2" strokeOpacity=".4" />
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18" strokeOpacity=".28" />
          <path d="M6 20V9m0 0-1.6 1.8M6 9l1.6 1.8" />
          <path d="M12 20V4m0 0-1.6 1.8M12 4l1.6 1.8" strokeOpacity=".55" />
          <path d="M18 20v-6m0 0-1.6 1.8M18 14l1.6 1.8" strokeOpacity=".75" />
        </svg>
      );
    case "affine":
      return (
        <svg {...p}>
          <path d="M3 20h18M4 3v18" strokeOpacity=".35" />
          <path d="M4 19 20 5" />
          <circle cx="8" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="13" cy="11" r="1.3" fill="currentColor" stroke="none" opacity=".7" />
          <circle cx="17.5" cy="7" r="1.3" fill="currentColor" stroke="none" opacity=".45" />
        </svg>
      );
    case "hill":
      return (
        <svg {...p}>
          <path d="M7 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2M17 4h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-2" />
          <circle cx="9.4" cy="9" r="1.25" fill="currentColor" stroke="none" />
          <circle cx="14.6" cy="9" r="1.25" fill="currentColor" stroke="none" opacity=".6" />
          <circle cx="9.4" cy="15" r="1.25" fill="currentColor" stroke="none" opacity=".6" />
          <circle cx="14.6" cy="15" r="1.25" fill="currentColor" stroke="none" />
          <path d="M9.4 9h5.2M9.4 15h5.2" strokeOpacity=".25" />
        </svg>
      );
    case "xor":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8.2" strokeOpacity=".45" />
          <path d="M12 3.8v16.4M3.8 12h16.4" />
          <path d="M6.6 6.6 17.4 17.4M17.4 6.6 6.6 17.4" strokeOpacity=".22" />
          <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "sha256":
      return (
        <svg {...p}>
          <path d="M12 2.6 20.4 7v10L12 21.4 3.6 17V7z" strokeOpacity=".45" />
          <path d="M9 8.4 8 15.6M15.6 8.4l-1 7.2M7 10.6h8.4M6.4 13.6h8.4" />
        </svg>
      );
  }
}
