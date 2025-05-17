"use client";
import { useState, useEffect } from "react";

export function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time on the client after hydration
    setNow(new Date());
    // Start the interval to update time every second
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-end text-right select-none">
      {now ? (
        <>
          <span className="text-lg font-mono font-semibold text-gray-700 bg-white/80 rounded px-3 py-1 shadow-sm border border-gray-200">
            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-xs font-mono text-gray-500 bg-white/60 rounded px-2 py-0.5 mt-1 border border-gray-100">
            {now.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </>
      ) : (
        // Optional: Render a placeholder on the server or during initial client render
        <div className="flex flex-col items-end text-right select-none opacity-0">
           <span className="text-lg font-mono font-semibold text-gray-700 bg-white/80 rounded px-3 py-1 shadow-sm border border-gray-200">00:00:00 AM</span>
           <span className="text-xs font-mono text-gray-500 bg-white/60 rounded px-2 py-0.5 mt-1 border border-gray-100">Loading Date...</span>
        </div>
      )}
    </div>
  );
} 