import { useState } from "react";

const BALL_OPTIONS = [3, 5, 6, 8, 10, 12, 15, 20];

export default function SetupScreen({ onStart }) {
  const [count, setCount] = useState(12);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Oddball Simulation</h1>
        <p className="mt-2 text-sm opacity-50 italic">
          Find the odd ball using a balance scale
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-3xl p-8 flex flex-col items-center gap-6 w-full max-w-md shadow-xl"
        style={{
          background: "rgba(255,255,255,0.5)",
          border: "1.5px solid rgba(120,80,30,0.25)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="text-center">
          <h2 className="text-xl font-bold">How many balls?</h2>
          <p className="text-xs mt-1 opacity-50">
            One of them is heavier or lighter — your job is to find it.
          </p>
        </div>

        {/* Ball count buttons */}
        <div className="grid grid-cols-4 gap-3 w-full">
          {BALL_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className="py-3 rounded-2xl font-bold text-sm transition-all duration-200 border-2 active:scale-95"
              style={
                count === n
                  ? {
                    background: "#1E1308",
                    color: "#F0E0C0",
                    borderColor: "#1E1308",
                    boxShadow: "0 4px 16px rgba(30,19,8,0.35)",
                    transform: "scale(1.06)",
                  }
                  : {
                    background: "rgba(255,255,255,0.6)",
                    color: "#5C3A1E",
                    borderColor: "rgba(120,80,30,0.3)",
                  }
              }
            >
              {n}
            </button>
          ))}
        </div>

        {/* Start */}
        <button
          onClick={() => onStart(count)}
          className="w-full py-3.5 rounded-2xl font-bold text-base transition-all duration-200 active:scale-95"
          style={{
            background: "#1E1308",
            color: "#F0E0C0",
            border: "2px solid #1E1308",
            boxShadow: "0 6px 20px rgba(30,19,8,0.3)",
          }}
        >
          Start Game →
        </button>
      </div>
    </div>
  );
}
