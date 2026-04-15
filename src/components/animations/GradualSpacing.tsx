"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

interface GradualSpacingProps {
  text: string;
  style?: React.CSSProperties;
  repeatInterval?: number;
}

export function GradualSpacing({ text, style, repeatInterval = 10000 }: GradualSpacingProps) {
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setKey((k) => k + 1);
    }, repeatInterval);
    return () => clearInterval(timer);
  }, [repeatInterval]);

  return (
    <span style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", ...style }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={key}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
        >
          {text.split(" ").map((word, wi, arr) => {
            const charOffset = arr.slice(0, wi).reduce((sum, w) => sum + w.length + 1, 0);
            return (
              <span key={wi} style={{ display: "inline-flex", whiteSpace: "nowrap" }}>
                {word.split("").map((char, ci) => (
                  <motion.span
                    key={ci}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 18 }}
                    transition={{ duration: 0.4, delay: (charOffset + ci) * 0.03 }}
                    style={{ display: "inline-block" }}
                  >
                    {char}
                  </motion.span>
                ))}
                {wi < arr.length - 1 && <span>{"\u00A0"}</span>}
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
