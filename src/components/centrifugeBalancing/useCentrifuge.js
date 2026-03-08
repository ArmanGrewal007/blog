import { useState, useMemo } from 'react';
import { calculateCenterOfMass } from './utils';

export function useCentrifuge(initialN = 12) {
  const [N, setNState] = useState(initialN);
  const [tubes, setTubes] = useState(Array(initialN).fill(false));

  const setN = (newN) => {
    setNState(newN);
    setTubes(Array(newN).fill(false));
  };

  const toggleTube = (index) => {
    setTubes((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const clearAll = () => setTubes(Array(N).fill(false));

  const { x: comX, y: comY, isBalanced, totalMass } = useMemo(
    () => calculateCenterOfMass(N, tubes),
    [N, tubes]
  );

  return {
    N,
    setN,
    tubes,
    toggleTube,
    clearAll,
    comX,
    comY,
    isBalanced,
    totalMass,
  };
}
