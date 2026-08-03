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
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-surface border border-accent/20 text-foreground px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-bottom-5 fade-in duration-300">
      <CheckCircle className="text-green-500 w-5 h-5" />
      <p className="text-sm font-medium">{message}</p>
      <button 
        onClick={() => setIsVisible(false)}
        className="text-muted hover:text-foreground transition-colors ml-2"
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
