export function calculateCenterOfMass(N, tubes) {
  let totalMass = 0;
  let x = 0.0;
  let y = 0.0;

  const TWO_PI = 2 * Math.PI;

  for (let t = 0; t < N; t++) {
    if (tubes[t]) {
      // User's specific logic (using t + 1 for angle)
      const angle = TWO_PI * (t + 1) / N;
      x += Math.cos(angle);
      y += Math.sin(angle);
      totalMass++;
    }
  }

  if (totalMass === 0) {
    return { x: 0, y: 0, isBalanced: true, totalMass: 0 };
  }

  const comX = x / totalMass;
  const comY = y / totalMass;

  // The user's Python logic for balancing:
  // return round(math.hypot(x, y) * 10) / 10 == 0.0
  const magnitude = Math.hypot(x, y);
  const isBalanced = Math.round(magnitude * 10) / 10 === 0.0;

  return {
    x: isBalanced ? 0 : comX,
    y: isBalanced ? 0 : comY,
    isBalanced,
    totalMass
  };
}
