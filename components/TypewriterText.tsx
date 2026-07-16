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
      {(() => {
        const spaceIndex = text.indexOf(' ');
        const firstWordLen = spaceIndex === -1 ? text.length : spaceIndex + 1;
        
        if (displayedText.length <= firstWordLen) {
          return <span className="max-md:no-underline underline decoration-current underline-offset-[20px] decoration-[5px]">{displayedText}</span>;
        } else {
          return (
            <>
              <span className="max-md:no-underline underline decoration-current underline-offset-[20px] decoration-[5px]">{displayedText.substring(0, firstWordLen)}</span>
              <span className="underline decoration-current underline-offset-[20px] decoration-[5px]">{displayedText.substring(firstWordLen)}</span>
            </>
          );
        }
      })()}
      <span className="invisible">{text.substring(displayedText.length)}</span>
    </span>
  );
}
