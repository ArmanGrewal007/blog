import { useMemo } from "react";
import {
  getConsistentHypotheses,
  entropy,
  analyzeProposedWeighing,
  getAllWeighingOptions,
} from "../utils/entropy";

function Bits({ value }) {
  return (
    <span className="font-mono font-bold" style={{ color: "#C8960C" }}>
      {value.toFixed(3)}
      <span className="text-xs font-normal opacity-60 ml-1">bits</span>
    </span>
  );
}

function OutcomeRow({ label, hypotheses, total, icon }) {
  const count = hypotheses.length;
  const pct = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
  const h = entropy(count);
  const barWidth = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold">
          {icon} {label}
        </span>
        <span className="opacity-60">
          {count} / {total} ({pct}%) → <Bits value={h} />
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(0,0,0,0.1)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${barWidth}%`,
            background: "linear-gradient(to right, #C8960C, #8A6A20)",
          }}
        />
      </div>
    </div>
  );
}

const BallChip = ({ id, pan }) => (
  <span
    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold"
    style={pan === "left"
      ? { background: "#0F2140", color: "#B8D4F0", border: "1px solid #1E3A6E" }
      : { background: "#3A0F25", color: "#F0B8D0", border: "1px solid #6E1E3A" }
    }
  >
    {id}
  </span>
);

export default function EntropyPanel({ ballCount, weighings, leftPan, rightPan, onClose, onApply }) {
  const hypotheses = useMemo(
    () => getConsistentHypotheses(ballCount, weighings),
    [ballCount, weighings],
  );

  const currentEntropy = entropy(hypotheses.length);
  const initialEntropy = entropy(ballCount * 2);
  const resolved = hypotheses.length <= 1;

  const allOptions = useMemo(
    () => getAllWeighingOptions(hypotheses, ballCount),
    [hypotheses, ballCount],
  );

  const hasStagedBalls = leftPan.length > 0 || rightPan.length > 0;
  const analysis = useMemo(() => {
    if (!hasStagedBalls) return null;
    return analyzeProposedWeighing(hypotheses, leftPan, rightPan);
  }, [hypotheses, leftPan, rightPan, hasStagedBalls]);

  // Group hypotheses by ball for compact display
  const byBall = useMemo(() => {
    const map = {};
    for (const h of hypotheses) {
      if (!map[h.ball]) map[h.ball] = [];
      map[h.ball].push(h.type);
    }
    return map;
  }, [hypotheses]);

  const maxGain = allOptions[0]?.infoGain ?? 0;

  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center z-50 px-2 pb-0 sm:px-4"
      style={{ background: "rgba(10,5,0,0.5)", backdropFilter: "blur(5px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgb(250,228,185), rgb(243,235,220))",
          border: "1.5px solid rgba(120,80,20,0.35)",
          maxHeight: "88vh",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
          style={{ borderBottom: "1px solid rgba(120,80,20,0.15)", background: "rgba(250,228,185,0.97)", backdropFilter: "blur(4px)" }}
        >
          <div>
            <h2 className="text-lg font-bold">📊 Entropy Analysis</h2>
            <p className="text-xs opacity-50">Information theory view of remaining uncertainty</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:bg-black/10"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex flex-col gap-5 p-6">

          {/* ── CURRENT STATE ── */}
          <div
            className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(120,80,20,0.2)" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest opacity-50">Information Achieved</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">
                  <Bits value={initialEntropy - currentEntropy} />
                  <span className="text-base font-normal opacity-40 ml-1">
                    / {initialEntropy.toFixed(3)} bits
                  </span>
                </p>
                <p className="text-xs opacity-50 mt-0.5">of information gained so far</p>
              </div>
              <div className="text-right text-xs opacity-60">
                <p>{hypotheses.length} possibilities left</p>
                <p>{(((initialEntropy - currentEntropy) / initialEntropy) * 100).toFixed(0)}% eliminated</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] opacity-40">
                <span>Solved</span>
                <span>Initial ({initialEntropy.toFixed(2)} bits)</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(currentEntropy / initialEntropy) * 100}%`,
                    background: resolved ? "#2A7A2A" : currentEntropy < initialEntropy * 0.33 ? "#C8600C" : "linear-gradient(to right, #C8960C, #8A6A20)",
                  }}
                />
              </div>
            </div>
            {resolved && (
              <p className="text-sm font-semibold rounded-xl p-2 text-center" style={{ background: "rgba(42,122,42,0.12)", color: "#1A6A1A" }}>
                ✅ Fully determined — make your guess!
              </p>
            )}
          </div>

          {/* ── PROPOSED WEIGHING ANALYSIS (if balls are staged) ── */}
          {hasStagedBalls && analysis && (
            <div
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(120,80,20,0.2)" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest opacity-50">If You Weigh Now…</p>
              <div className="flex flex-col gap-3">
                <OutcomeRow icon="◀" label="Left heavy" hypotheses={analysis.outcomes.left} total={hypotheses.length} />
                <OutcomeRow icon="⚖" label="Balanced" hypotheses={analysis.outcomes.balanced} total={hypotheses.length} />
                <OutcomeRow icon="▶" label="Right heavy" hypotheses={analysis.outcomes.right} total={hypotheses.length} />
              </div>
              <div className="flex justify-between text-sm rounded-xl px-4 py-2" style={{ background: "rgba(0,0,0,0.05)" }}>
                <span className="opacity-60">Expected entropy after weighing</span>
                <Bits value={analysis.expectedEntropy} />
              </div>
              <div className="flex justify-between text-sm font-semibold rounded-xl px-4 py-2" style={{ background: "rgba(200,150,12,0.12)", border: "1px solid rgba(200,150,12,0.25)" }}>
                <span>Information gain</span>
                <span style={{ color: "#8A6A00" }}>+<Bits value={analysis.informationGain} /></span>
              </div>
            </div>
          )}

          {/* ── ALL WEIGHING OPTIONS (ranked table) ── */}
          {!resolved && allOptions.length > 0 && (
            <div
              className="rounded-2xl flex flex-col overflow-hidden"
              style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(120,80,20,0.2)" }}
            >
              <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <p className="text-xs font-bold uppercase tracking-widest opacity-50">
                  All Weighing Options ({allOptions.length})
                </p>
                <span className="text-[10px] opacity-40">ranked by info gain</span>
              </div>

              {/* Column headers */}
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide opacity-40 px-4 pb-2">
                <span className="w-10 shrink-0">Size</span>
                <span>L/<span className="text-sm">⚖</span>/R</span>
                <span className="flex-1" />
                <span>Gain</span>
                <span className="w-8" />
              </div>

              <div className="flex flex-col divide-y overflow-y-auto" style={{ borderTop: "1px solid rgba(120,80,20,0.1)", maxHeight: "18rem" }}>
                {allOptions.map((opt, i) => {
                  const isBest = Math.abs(opt.infoGain - maxGain) < 1e-9;
                  const gainPct = maxGain > 0 ? (opt.infoGain / maxGain) * 100 : 0;
                  return (
                    <div
                      key={i}
                      className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-white/30"
                      style={isBest ? { background: "rgba(200,150,12,0.06)" } : {}}
                    >
                      {/* Top row: badge · outcomes · gain · Use */}
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className="shrink-0 inline-flex items-center justify-center w-10 h-5 rounded-full font-bold text-[10px]"
                          style={isBest
                            ? { background: "rgba(200,150,12,0.2)", color: "#8A6A00", border: "1px solid rgba(200,150,12,0.4)" }
                            : { background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.4)" }
                          }
                        >
                          {opt.k}v{opt.k}
                        </span>

                        <span className="flex-1 text-[10px] opacity-50 tabular-nums">
                          {opt.outcomes.left / 2}/{opt.outcomes.balanced / 2}/{opt.outcomes.right / 2}
                        </span>

                        <span
                          className="font-mono font-bold tabular-nums text-[11px]"
                          style={{ color: isBest ? "#8A6A00" : "rgba(0,0,0,0.45)" }}
                        >
                          +{opt.infoGain.toFixed(3)}
                        </span>

                        <button
                          onClick={() => { onApply(opt.left, opt.right); onClose(); }}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg transition-all active:scale-95 whitespace-nowrap"
                          style={{
                            background: isBest ? "#1E1308" : "rgba(0,0,0,0.08)",
                            color: isBest ? "#F0E0C0" : "rgba(0,0,0,0.4)",
                          }}
                        >
                          Use
                        </button>
                      </div>

                      {/* Bottom row: chips — wraps freely, never clipped */}
                      <div className="flex flex-wrap items-center gap-1 pl-0">
                        {opt.left.map((id) => <BallChip key={`l${id}`} id={id} pan="left" />)}
                        <span className="opacity-25 text-[9px] px-0.5">vs</span>
                        {opt.right.map((id) => <BallChip key={`r${id}`} id={id} pan="right" />)}
                      </div>

                      {/* Entropy formula */}
                      {(() => {
                        const N = hypotheses.length;
                        const L = opt.outcomes.left;
                        const B = opt.outcomes.balanced;
                        const R = opt.outcomes.right;
                        const term = (count) => count > 0
                          ? `(${count / 2}/${N / 2})·log₂(${N / 2}/${count / 2})`
                          : null;
                        const terms = [term(L), term(B), term(R)].filter(Boolean);
                        return (
                          <div
                            className="text-[10px] font-mono rounded-lg px-3 py-1.5 leading-relaxed"
                            style={{ background: "rgba(0,0,0,0.04)", color: "rgba(0,0,0,0.45)" }}
                          >
                            <span className="opacity-60">gain = </span>
                            {terms.map((t, i) => (
                              <span key={i}>
                                {i > 0 && <span className="opacity-40"> + </span>}
                                <span>{t}</span>
                              </span>
                            ))}
                            <span className="opacity-40"> = </span>
                            <span style={{ color: isBest ? "#8A6A00" : "rgba(0,0,0,0.55)", fontWeight: 600 }}>
                              +{opt.infoGain.toFixed(3)} bits
                            </span>
                          </div>
                        );
                      })()}

                      {/* Gain bar */}
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${gainPct}%`,
                            background: isBest
                              ? "linear-gradient(to right, #C8960C, #8A6A20)"
                              : "rgba(0,0,0,0.15)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}


          {/* ── REMAINING POSSIBILITIES ── */}
          <div
            className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(120,80,20,0.2)" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest opacity-50">
              Remaining Possibilities ({hypotheses.length})
            </p>
            {hypotheses.length === 0 ? (
              <p className="text-sm text-center opacity-40 italic py-2">No consistent hypotheses — something went wrong!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Object.entries(byBall)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([ball, types]) => {
                    const bothTypes = types.length === 2;
                    const isHeavy = types.includes("heavy") && !bothTypes;
                    return (
                      <div
                        key={ball}
                        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold"
                        style={{
                          background: bothTypes ? "rgba(30,19,8,0.85)" : isHeavy ? "#0F2140" : "#3A0F25",
                          color: bothTypes ? "#F0E0C0" : isHeavy ? "#B8D4F0" : "#F0B8D0",
                          border: `1px solid ${bothTypes ? "rgba(200,150,12,0.4)" : isHeavy ? "#1E3A6E" : "#6E1E3A"}`,
                        }}
                      >
                        <span className="font-bold">{ball}</span>
                        <span className="opacity-70">{bothTypes ? "⬆⬇" : isHeavy ? "⬆ heavy" : "⬇ light"}</span>
                      </div>
                    );
                  })}
              </div>
            )}
            <p className="text-[10px] opacity-30 text-center mt-1">
              Dark = both · Navy = heavy only · Rose = light only
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
