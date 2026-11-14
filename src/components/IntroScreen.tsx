import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TITLE = "SHADOW PROTOCOL";

export default function IntroScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="shadow-intro"
          dir="ltr"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)", scale: 1.04 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[9999] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#040508] px-4 text-center select-none"
        >
          {/* هالة إضاءة ذهبية خفيفة في الخلفية */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.22, 0.14], scale: [0.6, 1.15, 1] }}
            transition={{ duration: 2.8, ease: "easeOut" }}
            className="pointer-events-none absolute h-[320px] w-[320px] sm:h-[480px] sm:w-[480px] rounded-full blur-[110px]"
            style={{ background: "radial-gradient(circle, #F5B82E, transparent 70%)" }}
          />

          {/* خط مسح ضوئي أفقي خفيف */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 0.6, 0] }}
            transition={{ duration: 2.4, ease: "easeInOut" }}
            className="pointer-events-none absolute h-px w-[85%] max-w-[680px] bg-gradient-to-r from-transparent via-[#F5B82E] to-transparent"
          />

          {/* الكلمة حرف حرف من العدم */}
          <div className="relative flex flex-wrap items-center justify-center gap-x-[0.3em] sm:gap-x-[0.35em] gap-y-2 text-center">
            {TITLE.split(" ").map((word, wIdx) => (
              <span key={wIdx} className="inline-flex whitespace-nowrap">
                {word.split("").map((char, cIdx) => {
                  const globalIdx = wIdx === 0 ? cIdx : 7 + cIdx;
                  return (
                    <motion.span
                      key={cIdx}
                      initial={{
                        opacity: 0,
                        filter: "blur(18px)",
                        y: 14,
                        scale: 0.85,
                      }}
                      animate={{
                        opacity: 1,
                        filter: "blur(0px)",
                        y: 0,
                        scale: 1,
                      }}
                      transition={{
                        duration: 0.75,
                        delay: 0.25 + globalIdx * 0.085,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="font-display text-[clamp(1.55rem,6.5vw,4.5rem)] font-bold tracking-[0.16em] sm:tracking-[0.22em] text-white"
                      style={{
                        textShadow:
                          globalIdx >= 7
                            ? "0 0 28px rgba(245, 184, 46, 0.55)"
                            : "0 0 24px rgba(255, 255, 255, 0.25)",
                        color: globalIdx >= 7 ? "#F5B82E" : "#F4F6FB",
                      }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </div>

          {/* شريط سفلي سينمائي مظبوط في النص وعلى سطر واحد على الموبايل */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.75, duration: 0.7 }}
            className="mt-5 sm:mt-6 flex w-full max-w-full items-center justify-center gap-2 sm:gap-3 px-2"
          >
            <span className="h-px w-5 sm:w-8 shrink-0 bg-gradient-to-r from-transparent to-[#F5B82E]/60" />
            <span className="mono whitespace-nowrap text-center text-[8.5px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.35em] text-white/45">
              cryptography studio · initialized
            </span>
            <span className="h-px w-5 sm:w-8 shrink-0 bg-gradient-to-l from-transparent to-[#F5B82E]/60" />
          </motion.div>

          {/* تلميح التخطي */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 2.1, duration: 0.6 }}
            className="mono absolute bottom-6 inset-x-0 text-center text-[9.5px] uppercase tracking-[0.25em] text-white"
          >
            tap anywhere to enter
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}