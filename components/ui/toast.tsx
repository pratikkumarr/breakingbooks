"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

export function Toast({ message }: { message: string }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000); // 5 seconds
    
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-surface border border-accent/20 text-foreground px-6 py-4 rounded-lg shadow-lg animate-in slide-in-from-top-5 fade-in duration-300">
      <CheckCircle className="text-green-500 w-6 h-6" />
      <p className="text-base font-medium">{message}</p>
      <button 
        onClick={() => setIsVisible(false)}
        className="text-muted hover:text-foreground transition-colors ml-2"
        aria-label="Close toast"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
