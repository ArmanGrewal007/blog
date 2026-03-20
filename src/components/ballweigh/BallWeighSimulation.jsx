import { useState } from "react";
import { useGameState } from "./hooks/useGameState";
import SetupScreen from "./components/SetupScreen";
import BalanceScale from "./components/BalanceScale";
import BallTray from "./components/BallTray";
import WeighingHistory from "./components/WeighingHistory";
import GuessPanel from "./components/GuessPanel";
import ResultOverlay from "./components/ResultOverlay";
import EntropyPanel from "./components/EntropyPanel";

function BallWeighSimulation() {
  const {
    state,
    startGame,
    moveBall,
    cycleBall,
    weigh,
    startGuessing,
    cancelGuessing,
    submitGuess,
    resetGame,
    resetToSetup,
    setWeighing,
  } = useGameState();

  const [
    showEntropy,
    setShowEntropy,
  ] = useState(false);

  const { ballCount, leftPan, rightPan, weighings, gamePhase, guessResult, oddBall, oddType } =
    state;

  if (gamePhase === "setup") {
    // We adjust the SetupScreen rendering slightly or just use it as is
    // Actually SetupScreen has "min-h-screen" in its layout. We can just let it render, but 
    // maybe we should patch that inside SetupScreen? For now we'll just render it.
    return (
      <div className="w-full flex-1 relative rounded-3xl backdrop-blur-xl overflow-hidden bg-orange-50/30 border border-orange-900/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <SetupScreen onStart={startGame} />
      </div>
    );
  }

  const lastResult = weighings.length > 0 ? weighings[weighings.length - 1].result : null;
  const hasAnyBallsOnScale = leftPan.length > 0 || rightPan.length > 0;

  const pill = (
    <div
      className="rounded-full px-5 py-1.5 text-[13px] font-semibold"
      style={{
        background: "rgba(255,255,255,0.5)",
        border: "1px solid rgba(120,80,30,0.3)",
      }}
    >
      {weighings.length === 0
        ? `${ballCount} balls — no weighings yet`
        : `${weighings.length} weighing${weighings.length !== 1 ? "s" : ""} done`}
    </div>
  );

  const btnStyle = (primary) =>
    primary
      ? {
        background: "#1E1308",
        color: "#F0E0C0",
        border: "2px solid #1E1308",
        boxShadow: "0 4px 16px rgba(30,19,8,0.3)",
      }
      : {
        background: "transparent",
        color: "#5C3A1E",
        border: "2px solid rgba(120,80,30,0.3)",
      };

  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-4 py-8 gap-6 rounded-3xl bg-gradient-to-br from-[#f8f0e0] to-[#f0e4d0] border border-orange-900/10 relative overflow-hidden">
      {/* Header Optional (can be removed if the host page provides title) */}
      <div className="text-center">
        <h2 id="ballweigh-simulation" className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">BallWeigh Simulation</h2>
        <p className="text-sm opacity-60 mt-2 font-medium">Find the odd ball</p>
      </div>

      {pill}

      {/* Scale */}
      <BalanceScale result={lastResult} />

      {/* Ball Tray (weighing phase) */}
      {gamePhase === "weighing" && (
        <BallTray
          ballCount={ballCount}
          leftPan={leftPan}
          rightPan={rightPan}
          onBallDrop={moveBall}
          onBallClick={cycleBall}
        />
      )}

      {/* Guess Panel */}
      {gamePhase === "guessing" && (
        <GuessPanel
          ballCount={ballCount}
          onSubmit={submitGuess}
          onCancel={cancelGuessing}
        />
      )}

      {/* Action Buttons */}
      {gamePhase === "weighing" && (
        <div className="flex gap-3 flex-wrap justify-center mt-2">
          <button
            onClick={weigh}
            disabled={!hasAnyBallsOnScale}
            className="px-7 py-2.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
            style={
              hasAnyBallsOnScale
                ? btnStyle(true)
                : { ...btnStyle(true), opacity: 0.4, cursor: "not-allowed" }
            }
          >
            ⚖ Weigh
          </button>
          <button
            onClick={startGuessing}
            className="px-7 py-2.5 rounded-2xl font-semibold text-sm transition-all active:scale-95"
            style={btnStyle(false)}
          >
            💡 I Know!
          </button>
          <button
            onClick={() => setShowEntropy(true)}
            className="px-7 py-2.5 rounded-2xl font-semibold text-sm transition-all active:scale-95"
            style={btnStyle(false)}
          >
            📊 Entropy
          </button>
          <button
            onClick={resetGame}
            className="px-5 py-2.5 rounded-2xl text-sm transition-all active:scale-95 opacity-60 ml-0 sm:ml-4"
            style={btnStyle(false)}
          >
            ↺ Restart
          </button>
          <button
            onClick={resetToSetup}
            className="px-5 py-2.5 rounded-2xl text-sm transition-all active:scale-95 opacity-60"
            style={btnStyle(false)}
          >
            ← Change Balls
          </button>
        </div>
      )}

      {/* Weighing History */}
      <div className="mt-4 w-full flex justify-center">
        <WeighingHistory weighings={weighings} />
      </div>

      {/* Entropy Panel */}
      {showEntropy && (
        <EntropyPanel
          ballCount={ballCount}
          weighings={weighings}
          leftPan={leftPan}
          rightPan={rightPan}
          onClose={() => setShowEntropy(false)}
          onApply={setWeighing}
        />
      )}

      {/* Result Overlay */}
      {gamePhase === "result" && guessResult && (
        <div className="absolute inset-0 z-40">
          <ResultOverlay
            guessResult={guessResult}
            oddBall={oddBall}
            oddType={oddType}
            weighingsCount={weighings.length}
            onReset={resetGame}
            onBackToSetup={resetToSetup}
          />
        </div>
      )}
    </div>
  );
}

export default BallWeighSimulation;
