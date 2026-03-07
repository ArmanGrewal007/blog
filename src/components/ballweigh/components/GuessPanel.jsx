import { useState } from "react";

export default function GuessPanel({ ballCount, onSubmit, onCancel }) {
  const [selectedBall, setSelectedBall] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const canSubmit = selectedBall !== null && selectedType !== null;

  const btnBase =
    "rounded-2xl font-bold text-sm transition-all duration-150 border-2 active:scale-95";

  return (
    <div
      className="w-full max-w-lg rounded-3xl p-6 flex flex-col gap-5"
      style={{
        background: "rgba(255,255,255,0.55)",
        border: "1.5px solid rgba(120,80,30,0.3)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="text-center">
        <h2 className="text-lg font-bold">Make Your Guess</h2>
        <p className="text-xs opacity-50 mt-1">
          Which ball is odd? Is it heavier or lighter?
        </p>
      </div>

      {/* Step 1 */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest opacity-50 mb-2">
          1 — Select the odd ball
        </p>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${Math.min(ballCount, 8)}, 1fr)` }}
        >
          {Array.from({ length: ballCount }, (_, i) => i + 1).map((id) => (
            <button
              key={id}
              onClick={() => setSelectedBall(id)}
              className={`h-10 ${btnBase}`}
              style={
                selectedBall === id
                  ? {
                    background: "#1E1308",
                    color: "#F0E0C0",
                    borderColor: "#1E1308",
                    boxShadow: "0 4px 12px rgba(30,19,8,0.4)",
                    transform: "scale(1.1)",
                  }
                  : {
                    background: "rgba(255,255,255,0.6)",
                    color: "#5C3A1E",
                    borderColor: "rgba(120,80,30,0.3)",
                  }
              }
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest opacity-50 mb-2">
          2 — Heavier or lighter?
        </p>
        <div className="flex gap-3 justify-center">
          {[
            { val: "heavy", label: "⬆ Heavier" },
            { val: "light", label: "⬇ Lighter" },
          ].map(({ val, label }) => (
            <button
              key={val}
              onClick={() => setSelectedType(val)}
              className={`px-8 py-2.5 ${btnBase}`}
              style={
                selectedType === val
                  ? {
                    background: "#1E1308",
                    color: "#F0E0C0",
                    borderColor: "#1E1308",
                    boxShadow: "0 4px 12px rgba(30,19,8,0.4)",
                  }
                  : {
                    background: "rgba(255,255,255,0.6)",
                    color: "#5C3A1E",
                    borderColor: "rgba(120,80,30,0.3)",
                  }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onCancel}
          className={`px-6 py-2.5 ${btnBase}`}
          style={{
            background: "transparent",
            color: "#5C3A1E",
            borderColor: "rgba(120,80,30,0.3)",
          }}
        >
          ← Keep Weighing
        </button>
        <button
          onClick={() => canSubmit && onSubmit(selectedBall, selectedType)}
          disabled={!canSubmit}
          className={`px-7 py-2.5 ${btnBase}`}
          style={
            canSubmit
              ? {
                background: "#1E1308",
                color: "#F0E0C0",
                borderColor: "#1E1308",
                boxShadow: "0 4px 14px rgba(30,19,8,0.35)",
              }
              : {
                background: "rgba(120,80,30,0.2)",
                color: "rgba(92,58,30,0.5)",
                borderColor: "rgba(120,80,30,0.15)",
                cursor: "not-allowed",
              }
          }
        >
          Submit Guess →
        </button>
      </div>
    </div>
  );
}
