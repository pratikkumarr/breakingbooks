"use client";

import { useState, useEffect, useRef } from "react";

export function TypewriterText({ text, className }: { text: string, className?: string }) {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {

    let i = 0;
    const duration = 800; // 800ms total
    const interval = duration / text.length;
    
    const timer = setInterval(() => {
      i++;
      setDisplayedText(text.substring(0, i));
      if (i >= text.length) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className={className}>
      <span className="underline decoration-current underline-offset-[20px] decoration-[5px]">{displayedText}</span>
      <span className="invisible">{text.substring(displayedText.length)}</span>
    </span>
  );
}
