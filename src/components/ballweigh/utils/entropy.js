/**
 * Returns all (ball, type) hypotheses consistent with observed weighings.
 *
 * A hypothesis (ball=b, type='heavy'|'light') is consistent if, for every
 * past weighing, the predicted scale result matches the observed result.
 */
export function getConsistentHypotheses(ballCount, weighings) {
  const all = [];
  for (let ball = 1; ball <= ballCount; ball++) {
    all.push({ ball, type: "heavy" });
    all.push({ ball, type: "light" });
  }

  return all.filter(({ ball, type }) =>
    weighings.every(({ left, right, result }) => {
      const inLeft = left.includes(ball);
      const inRight = right.includes(ball);

      let expected;
      if (!inLeft && !inRight) {
        expected = "balanced";
      } else if (inLeft) {
        expected = type === "heavy" ? "left" : "right";
      } else {
        // inRight
        expected = type === "heavy" ? "right" : "left";
      }

      return expected === result;
    }),
  );
}

/**
 * Shannon entropy H = log2(K) for K equally-likely outcomes.
 * Returns 0 if K === 0 or K === 1.
 */
export function entropy(count) {
  if (count <= 1) return 0;
  return Math.log2(count);
}

/**
 * Find the weighing that maximises information gain given the current
 * consistent hypotheses.
 *
 * Algorithm: classify each ball into one of three profile types:
 *   A – canHeavy AND canLight  (undetermined)
 *   B – canHeavy only
 *   C – canLight  only
 *
 * For a weighing (LP, RP) using aL/bL/cL balls of each type on the left
 * and aR/bR/cR on the right:
 *   leftOutcome    = aL + bL + aR + cR
 *   rightOutcome   = aL + cL + aR + bR
 *   balancedOutcome = total − leftOutcome − rightOutcome
 *
 * We enumerate all valid count tuples (O(k⁴) at most) and return the
 * specific ball IDs that achieve the best expected entropy.
 */
export function findBestWeighing(hypotheses, ballCount) {
  if (hypotheses.length <= 1) return null;

  const H = entropy;
  const total = hypotheses.length;
  const currentH = H(total);

  // Build per-ball profiles
  const canHeavy = new Set();
  const canLight = new Set();
  for (const { ball, type } of hypotheses) {
    if (type === "heavy") canHeavy.add(ball);
    else canLight.add(ball);
  }

  const typeA = [], typeB = [], typeC = [];
  for (let b = 1; b <= ballCount; b++) {
    const h = canHeavy.has(b), l = canLight.has(b);
    if (h && l) typeA.push(b);
    else if (h) typeB.push(b);
    else if (l) typeC.push(b);
  }

  const nA = typeA.length, nB = typeB.length, nC = typeC.length;
  const maxK = Math.floor((nA + nB + nC) / 2);

  let bestGain = -1;
  let bestCounts = null;

  for (let k = 1; k <= maxK; k++) {
    for (let aL = 0; aL <= Math.min(k, nA); aL++) {
      for (let aR = 0; aR <= Math.min(k, nA - aL); aR++) {
        for (let bL = 0; bL <= Math.min(k - aL, nB); bL++) {
          for (let bR = 0; bR <= Math.min(k - aR, nB - bL); bR++) {
            const cL = k - aL - bL;
            const cR = k - aR - bR;
            if (cL < 0 || cR < 0 || cL + cR > nC) continue;

            const leftCnt = aL + bL + aR + cR;
            const rightCnt = aL + cL + aR + bR;
            const balancedCnt = total - leftCnt - rightCnt;
            if (balancedCnt < 0) continue;

            const pL = leftCnt / total, pR = rightCnt / total, pB = balancedCnt / total;
            const expH = pL * H(leftCnt) + pR * H(rightCnt) + pB * H(balancedCnt);
            const gain = currentH - expH;

            if (gain > bestGain + 1e-9) {
              bestGain = gain;
              bestCounts = { k, aL, aR, bL, bR, cL, cR, leftCnt, rightCnt, balancedCnt, expH };
            }
          }
        }
      }
    }
  }

  if (!bestCounts) return null;
  const { aL, aR, bL, bR, cL, cR, leftCnt, rightCnt, balancedCnt, expH } = bestCounts;

  // Pick specific balls (any representative from each profile group is equivalent)
  const left = [...typeA.slice(0, aL), ...typeB.slice(0, bL), ...typeC.slice(0, cL)];
  const right = [...typeA.slice(aL, aL + aR), ...typeB.slice(bL, bL + bR), ...typeC.slice(cL, cL + cR)];

  return {
    left,
    right,
    infoGain: bestGain,
    expectedEntropy: expH,
    outcomes: { left: leftCnt, right: rightCnt, balanced: balancedCnt },
  };
}

/**
 * For a PROPOSED weighing (leftPan, rightPan), and the current consistent
 * hypotheses, compute how many hypotheses survive each of the 3 outcomes
 * and the expected remaining entropy after the weighing.
 */
export function analyzeProposedWeighing(hypotheses, leftPan, rightPan) {
  const outcomes = { left: [], right: [], balanced: [] };

  for (const h of hypotheses) {
    const { ball, type } = h;
    const inLeft = leftPan.includes(ball);
    const inRight = rightPan.includes(ball);

    let predicted;
    if (!inLeft && !inRight) {
      predicted = "balanced";
    } else if (inLeft) {
      predicted = type === "heavy" ? "left" : "right";
    } else {
      predicted = type === "heavy" ? "right" : "left";
    }

    outcomes[predicted].push(h);
  }

  const total = hypotheses.length;
  const pLeft = outcomes.left.length / total;
  const pRight = outcomes.right.length / total;
  const pBalanced = outcomes.balanced.length / total;

  // Expected entropy after weighing (weighted sum)
  const expectedEntropy =
    pLeft * entropy(outcomes.left.length) +
    pRight * entropy(outcomes.right.length) +
    pBalanced * entropy(outcomes.balanced.length);

  const informationGain = entropy(total) - expectedEntropy;

  return { outcomes, expectedEntropy, informationGain };
}

/**
 * Returns ALL informationally-distinct weighing configurations available
 * given the current hypotheses, sorted by information gain (best first).
 *
 * Two configurations are considered identical if they produce the same
 * (loSide, hiSide, balanced) outcome tuple (symmetric weighings treated equal).
 *
 * Each entry:  { k, left, right, outcomes, infoGain, expectedEntropy }
 */
export function getAllWeighingOptions(hypotheses, ballCount) {
  if (hypotheses.length <= 1) return [];

  const H = entropy;
  const total = hypotheses.length;
  const currentH = H(total);

  const canHeavy = new Set();
  const canLight = new Set();
  for (const { ball, type } of hypotheses) {
    if (type === "heavy") canHeavy.add(ball);
    else canLight.add(ball);
  }

  const typeA = [], typeB = [], typeC = [];
  for (let b = 1; b <= ballCount; b++) {
    const h = canHeavy.has(b), l = canLight.has(b);
    if (h && l) typeA.push(b);
    else if (h) typeB.push(b);
    else if (l) typeC.push(b);
  }

  const nA = typeA.length, nB = typeB.length, nC = typeC.length;
  const maxK = Math.floor((nA + nB + nC) / 2);

  const seen = new Map();

  for (let k = 1; k <= maxK; k++) {
    for (let aL = 0; aL <= Math.min(k, nA); aL++) {
      for (let aR = 0; aR <= Math.min(k, nA - aL); aR++) {
        for (let bL = 0; bL <= Math.min(k - aL, nB); bL++) {
          for (let bR = 0; bR <= Math.min(k - aR, nB - bL); bR++) {
            const cL = k - aL - bL;
            const cR = k - aR - bR;
            if (cL < 0 || cR < 0 || cL + cR > nC) continue;

            const leftCnt = aL + bL + aR + cR;
            const rightCnt = aL + cL + aR + bR;
            const balancedCnt = total - leftCnt - rightCnt;
            if (balancedCnt < 0) continue;

            // Symmetric key so (L,R) and (R,L) are not double-counted
            const lo = Math.min(leftCnt, rightCnt);
            const hi = Math.max(leftCnt, rightCnt);
            const key = `${k}|${lo},${hi},${balancedCnt}`;
            if (seen.has(key)) continue;

            const pL = leftCnt / total, pR = rightCnt / total, pB = balancedCnt / total;
            const expH = pL * H(leftCnt) + pR * H(rightCnt) + pB * H(balancedCnt);
            const gain = currentH - expH;

            const left = [...typeA.slice(0, aL), ...typeB.slice(0, bL), ...typeC.slice(0, cL)];
            const right = [...typeA.slice(aL, aL + aR), ...typeB.slice(bL, bL + bR), ...typeC.slice(cL, cL + cR)];

            seen.set(key, {
              k,
              left,
              right,
              outcomes: { left: leftCnt, right: rightCnt, balanced: balancedCnt },
              infoGain: gain,
              expectedEntropy: expH,
            });
          }
        }
      }
    }
  }

  return [...seen.values()].sort((a, b) => b.infoGain - a.infoGain);
}
