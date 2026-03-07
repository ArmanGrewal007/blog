export default function ResultOverlay({ guessResult, oddBall, oddType, weighingsCount, onReset, onBackToSetup }) {
  const { correct, guessedBall, guessedType } = guessResult;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ background: "rgba(10,5,0,0.55)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="rounded-3xl p-8 flex flex-col items-center gap-5 max-w-sm w-full shadow-2xl"
        style={{
          background: "linear-gradient(145deg, rgb(248,224,178), rgb(240,232,218), rgb(248,224,178))",
          border: "2px solid rgba(120,80,20,0.4)",
        }}
      >
        <div className="text-6xl">{correct ? "🎉" : "😔"}</div>

        <h2 className="text-2xl font-bold text-center">
          {correct ? "Correct!" : "Not quite…"}
        </h2>

        <div
          className="text-sm text-center rounded-xl px-4 py-2"
          style={{ background: "rgba(0,0,0,0.07)" }}
        >
          You guessed: Ball <strong>{guessedBall}</strong> is{" "}
          <strong>{guessedType}</strong>
        </div>

        <div className="w-full border-t" style={{ borderColor: "rgba(120,80,20,0.25)" }} />

        <div className="text-center">
          <p className="text-[11px] uppercase tracking-widest opacity-50 mb-2">
            The correct answer
          </p>
          <div className="flex items-center gap-3 justify-center">
            <span
              className="w-12 h-12 rounded-full font-bold text-base flex items-center justify-center"
              style={{ background: "#1E1308", color: "#F0E0C0", boxShadow: "0 4px 12px rgba(30,19,8,0.4)" }}
            >
              {oddBall}
            </span>
            <span className="text-sm font-semibold">
              Ball <strong>{oddBall}</strong> is{" "}
              {oddType === "heavy" ? "⬆ heavier" : "⬇ lighter"}
            </span>
          </div>
        </div>

        <p className="text-xs opacity-40">
          You used {weighingsCount} weighing{weighingsCount !== 1 ? "s" : ""}
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={onBackToSetup}
            className="flex-1 py-2.5 rounded-2xl text-sm font-semibold border-2 transition-all active:scale-95"
            style={{
              background: "transparent",
              color: "#5C3A1E",
              borderColor: "rgba(120,80,30,0.3)",
            }}
          >
            Change Balls
          </button>
          <button
            onClick={onReset}
            className="flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-95"
            style={{
              background: "#1E1308",
              color: "#F0E0C0",
              border: "2px solid #1E1308",
              boxShadow: "0 4px 14px rgba(30,19,8,0.35)",
            }}
          >
            Play Again →
          </button>
        </div>
      </div>
    </div>
  );
}
