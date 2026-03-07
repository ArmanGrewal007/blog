import { useState, useCallback } from "react";

function createGameState(ballCount) {
  const oddBall = Math.floor(Math.random() * ballCount) + 1;
  const oddType = Math.random() < 0.5 ? "heavy" : "light";
  return {
    ballCount,
    oddBall,
    oddType,
    leftPan: [],
    rightPan: [],
    weighings: [],
    gamePhase: "weighing",
    guessResult: null,
  };
}

export function useGameState() {
  const [state, setState] = useState({ gamePhase: "setup", ballCount: null });

  const startGame = useCallback((ballCount) => {
    setState(createGameState(ballCount));
  }, []);

  // Move a ball to a specific zone: 'left' | 'right' | 'tray'
  const moveBall = useCallback((ballId, targetZone) => {
    setState((prev) => {
      if (prev.gamePhase !== "weighing") return prev;
      const removeFrom = (arr) => arr.filter((b) => b !== ballId);
      const addTo = (arr) => arr.includes(ballId) ? arr : [...arr, ballId];

      return {
        ...prev,
        leftPan:
          targetZone === "left"
            ? addTo(removeFrom(prev.leftPan))
            : removeFrom(prev.leftPan),
        rightPan:
          targetZone === "right"
            ? addTo(removeFrom(prev.rightPan))
            : removeFrom(prev.rightPan),
      };
    });
  }, []);

  // Click-to-cycle: tray → left → right → tray
  const cycleBall = useCallback((ballId) => {
    setState((prev) => {
      if (prev.gamePhase !== "weighing") return prev;
      const inLeft = prev.leftPan.includes(ballId);
      const inRight = prev.rightPan.includes(ballId);
      if (!inLeft && !inRight) {
        return { ...prev, leftPan: [...prev.leftPan, ballId] };
      } else if (inLeft) {
        return {
          ...prev,
          leftPan: prev.leftPan.filter((b) => b !== ballId),
          rightPan: [...prev.rightPan, ballId],
        };
      } else {
        return { ...prev, rightPan: prev.rightPan.filter((b) => b !== ballId) };
      }
    });
  }, []);

  const weigh = useCallback(() => {
    setState((prev) => {
      if (prev.gamePhase !== "weighing") return prev;
      if (prev.leftPan.length === 0 && prev.rightPan.length === 0) return prev;

      const { oddBall, oddType, leftPan, rightPan } = prev;
      const w = oddType === "heavy" ? 1.5 : 0.5;

      const leftW = leftPan.reduce((s, b) => s + (b === oddBall ? w : 1), 0);
      const rightW = rightPan.reduce((s, b) => s + (b === oddBall ? w : 1), 0);

      let result;
      if (Math.abs(leftW - rightW) < 0.01) result = "balanced";
      else if (leftW > rightW) result = "left";
      else result = "right";

      return {
        ...prev,
        weighings: [...prev.weighings, { left: [...leftPan], right: [...rightPan], result }],
        leftPan: [],
        rightPan: [],
      };
    });
  }, []);

  const startGuessing = useCallback(() => {
    setState((prev) => ({ ...prev, gamePhase: "guessing" }));
  }, []);

  const cancelGuessing = useCallback(() => {
    setState((prev) => ({ ...prev, gamePhase: "weighing" }));
  }, []);

  const submitGuess = useCallback((guessedBall, guessedType) => {
    setState((prev) => {
      const correct = guessedBall === prev.oddBall && guessedType === prev.oddType;
      return { ...prev, gamePhase: "result", guessResult: { guessedBall, guessedType, correct } };
    });
  }, []);

  const setWeighing = useCallback((left, right) => {
    setState((prev) => {
      if (prev.gamePhase !== "weighing") return prev;
      return { ...prev, leftPan: left, rightPan: right };
    });
  }, []);

  const resetToSetup = useCallback(() => {
    setState({ gamePhase: "setup", ballCount: null });
  }, []);

  const resetGame = useCallback(() => {
    setState((prev) => createGameState(prev.ballCount || 12));
  }, []);

  return { state, startGame, moveBall, cycleBall, weigh, startGuessing, cancelGuessing, submitGuess, resetGame, resetToSetup, setWeighing };
}
