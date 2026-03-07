export default function WeighingHistory({ weighings }) {
  if (weighings.length === 0) return null;

  const ResultIcon = ({ result }) => {
    if (result === "balanced")
      return <span className="text-green-700 font-bold text-base">⚖</span>;
    if (result === "left")
      return <span className="text-amber-800 font-bold text-base">◀</span>;
    return <span className="text-amber-800 font-bold text-base">▶</span>;
  };

  return (
    <div className="w-full max-w-lg">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-center opacity-60 mb-2">
        Weighing History
      </h3>
      <div className="flex flex-col gap-2">
        {weighings.map((w, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl px-4 py-2 text-sm"
            style={{ background: "rgba(255,255,255,0.45)", border: "1px solid rgba(180,140,90,0.3)" }}
          >
            <span className="font-semibold opacity-50 w-5 text-center">#{i + 1}</span>

            {/* Left balls */}
            <div className="flex gap-1 flex-wrap min-w-[60px] justify-end">
              {w.left.length === 0 ? (
                <span className="opacity-30 italic text-xs">empty</span>
              ) : (
                w.left.map((b) => (
                  <span
                    key={b}
                    className="w-6 h-6 rounded-full bg-[#a8c4e8] text-[#1a3a5c] text-xs font-bold flex items-center justify-center border border-[#5a8fc4]"
                  >
                    {b}
                  </span>
                ))
              )}
            </div>

            <ResultIcon result={w.result} />

            {/* Right balls */}
            <div className="flex gap-1 flex-wrap min-w-[60px]">
              {w.right.length === 0 ? (
                <span className="opacity-30 italic text-xs">empty</span>
              ) : (
                w.right.map((b) => (
                  <span
                    key={b}
                    className="w-6 h-6 rounded-full bg-[#e8c4a8] text-[#5c2a1a] text-xs font-bold flex items-center justify-center border border-[#c47a5a]"
                  >
                    {b}
                  </span>
                ))
              )}
            </div>

            <span className="ml-auto text-xs opacity-50 capitalize">
              {w.result === "balanced" ? "balanced" : w.result === "left" ? "left heavy" : "right heavy"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
