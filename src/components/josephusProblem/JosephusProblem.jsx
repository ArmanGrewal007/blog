import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Compute the full elimination order for the Josephus problem.
 * Returns an array of 0-indexed positions in elimination order.
 */
function computeEliminationOrder(n, k) {
  const alive = Array.from({ length: n }, (_, i) => i);
  const order = [];
  let idx = 0;
  while (alive.length > 0) {
    idx = (idx + k - 1) % alive.length;
    order.push(alive[idx]);
    alive.splice(idx, 1);
    if (idx >= alive.length) idx = 0;
  }
  return order;
}

export default function JosephusProblem() {
  const [n, setN] = useState(10);
  const [k, setK] = useState(3);
  const [eliminationStep, setEliminationStep] = useState(0);
  const [status, setStatus] = useState('idle'); // 'idle' | 'running' | 'paused' | 'finished'

  const eliminationOrderRef = useRef([]);

  const recompute = useCallback((newN, newK) => {
    eliminationOrderRef.current = computeEliminationOrder(newN, newK);
    setEliminationStep(0);
    setStatus('idle');
  }, []);

  // Initialize
  useEffect(() => {
    recompute(n, k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNChange = (newN) => {
    setN(newN);
    recompute(newN, k);
  };

  const handleKChange = (newK) => {
    setK(newK);
    recompute(n, newK);
  };

  const isFinished = eliminationStep >= n;
  const eliminatedSet = new Set(eliminationOrderRef.current.slice(0, eliminationStep));
  const survivor = isFinished ? eliminationOrderRef.current[n - 1] : null;
  const nextToEliminate = !isFinished ? eliminationOrderRef.current[eliminationStep] : null;

  // The step function for one tick
  const step = useCallback(() => {
    setEliminationStep((prev) => {
      if (prev >= n) {
        setStatus('finished');
        return prev;
      }
      const next = prev + 1;
      if (next >= n) {
        setStatus('finished');
      }
      return next;
    });
  }, [n]);

  // useEffect-based interval (same pattern as BoardingSimulator) — fixes the pause bug
  useEffect(() => {
    if (status === 'running') {
      const id = setInterval(step, 500);
      return () => clearInterval(id);
    }
  }, [status, step]);

  const reset = () => {
    recompute(n, k);
  };

  // Build a map: person → elimination index (0-based) for spiral calculation
  const eliminationIndexMap = {};
  eliminationOrderRef.current.forEach((person, idx) => {
    eliminationIndexMap[person] = idx;
  });

  // SVG layout
  const svgSize = 300;
  const radius = 110;
  const center = svgSize / 2;
  const nodeRadius = n <= 15 ? 16 : n <= 22 ? 13 : 10;
  const fontSize = n <= 15 ? 12 : n <= 22 ? 10 : 8;

  return (
    <div className="flex flex-col items-center w-full gap-6 my-8 font-sans">
      <div className="flex bg-[#FCF8EE] p-6 lg:p-8 backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_32px_rgba(251,146,60,0.15)] bg-orange-50/40 border border-orange-200/50 w-full overflow-hidden justify-center relative flex-col">

        {/* Top Header & Controls — matching Aeroplane Boarding Simulator layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-700 pb-6 mb-6 w-full max-w-5xl mx-auto">

          <div className="text-center md:text-left flex-shrink-0">
            <h3 id="josephus-simulator" className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight leading-tight">Josephus Simulator</h3>
          </div>

          <div className="flex gap-3 items-center w-full sm:w-auto justify-center flex-wrap">
            {status !== 'running' ? (
              <button
                onClick={() => {
                  if (status === 'finished') {
                    reset();
                  } else {
                    setStatus('running');
                  }
                }}
                className="h-9 px-6 bg-emerald-500/90 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-[0_4px_20px_rgba(16,185,129,0.3)] flex items-center gap-2 backdrop-blur-sm border border-emerald-400/50 flex-1 sm:flex-auto min-w-[100px] justify-center"
              >
                {status === 'finished' ? 'Restart' : 'Play'}
              </button>
            ) : (
              <button
                onClick={() => setStatus('paused')}
                className="h-9 px-6 bg-amber-500/90 hover:bg-amber-500 text-white rounded-xl font-bold shadow-[0_4px_20px_rgba(245,158,11,0.3)] backdrop-blur-sm border border-amber-400/50 flex-1 sm:flex-auto min-w-[100px] flex items-center justify-center"
              >
                Pause
              </button>
            )}

            <button
              onClick={step}
              disabled={isFinished || status === 'running'}
              className="h-9 px-6 bg-white/70 hover:bg-white/90 border border-gray-200 rounded-xl font-bold text-gray-700 shadow-sm backdrop-blur-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            >
              Step
            </button>

            <div className="h-9 flex items-center bg-white/70 px-4 rounded-xl border border-white/60 shadow-sm backdrop-blur-md min-w-[80px]">
              <span className="text-gray-500 font-medium text-sm mr-2 uppercase tracking-wider">n</span>
              <span className="font-mono font-bold text-xl text-gray-800">{n}</span>
            </div>

            <div className="h-9 flex items-center bg-white/70 px-4 rounded-xl border border-white/60 shadow-sm backdrop-blur-md min-w-[80px]">
              <span className="text-gray-500 font-medium text-sm mr-2 uppercase tracking-wider">k</span>
              <span className="font-mono font-bold text-xl text-gray-800">{k}</span>
            </div>
          </div>
        </div>

        {/* Sliders for n and k */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-5xl mx-auto mb-6">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium text-gray-600 flex justify-between">
              <span>People (n)</span>
              <span className="font-bold text-gray-800">{n}</span>
            </label>
            <input
              type="range"
              min="2"
              max="30"
              value={n}
              onChange={(e) => handleNChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium text-gray-600 flex justify-between">
              <span>Step (k)</span>
              <span className="font-bold text-gray-800">{k}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={k}
              onChange={(e) => handleKChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Circle visualization */}
        <div className="flex justify-center mb-6">
          <div className="relative select-none" style={{ width: svgSize, height: svgSize }}>
            <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-full h-full drop-shadow-xl">
              <defs>
                <radialGradient id="josephusAlive" cx="40%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="#bae6fd" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0369a1" />
                </radialGradient>
                <radialGradient id="josephusSurvivor" cx="40%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="#bbf7d0" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#15803d" />
                </radialGradient>
                <radialGradient id="josephusNext" cx="40%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="#fecaca" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </radialGradient>
                <radialGradient id="josephusDead" cx="50%" cy="50%" r="50%">
                  <stop offset="50%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </radialGradient>
              </defs>

              {/* Faint guide circle */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="4 6"
                opacity="0.5"
              />

              {/* Nodes */}
              {Array.from({ length: n }, (_, i) => {
                const angle = (2 * Math.PI * i) / n - Math.PI / 2;
                const outerX = center + radius * Math.cos(angle);
                const outerY = center + radius * Math.sin(angle);

                const isDead = eliminatedSet.has(i);
                const isSurvivor = survivor === i;
                const isNext = nextToEliminate === i;

                // Spiral inward: eliminated nodes move toward center based on elimination order
                let x = outerX;
                let y = outerY;
                let nodeOpacity = 1;

                if (isDead && !isSurvivor) {
                  const elimIdx = eliminationIndexMap[i]; // 0 = first eliminated
                  // Spiral inward: factor goes from ~0.85 (first eliminated) down to ~0.15 (last eliminated before survivor)
                  const totalEliminated = n - 1;
                  const spiralFactor = totalEliminated > 0
                    ? 1 - ((elimIdx + 1) / totalEliminated) * 0.85
                    : 0.5;
                  // Add a slight angular rotation for spiral effect
                  const spiralAngle = angle + (elimIdx + 1) * 0.15;
                  x = center + radius * spiralFactor * Math.cos(spiralAngle);
                  y = center + radius * spiralFactor * Math.sin(spiralAngle);
                  nodeOpacity = 0.3;
                }

                let fill = 'url(#josephusAlive)';
                let stroke = '#0c4a6e';

                if (isSurvivor) {
                  fill = 'url(#josephusSurvivor)';
                  stroke = '#166534';
                  nodeOpacity = 1;
                } else if (isDead) {
                  fill = 'url(#josephusDead)';
                  stroke = '#64748b';
                } else if (isNext) {
                  fill = 'url(#josephusNext)';
                  stroke = '#991b1b';
                }

                return (
                  <g
                    key={i}
                    style={{
                      opacity: nodeOpacity,
                      transition: 'opacity 0.4s ease, transform 0.5s ease',
                    }}
                  >
                    {/* Glow ring for survivor */}
                    {isSurvivor && (
                      <circle
                        cx={x}
                        cy={y}
                        r={nodeRadius + 6}
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2"
                        className="animate-pulse"
                        opacity="0.6"
                      />
                    )}

                    {/* Node body — use CSS transform for smooth spiral transition */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isDead && !isSurvivor ? nodeRadius * 0.7 : nodeRadius}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth="1.5"
                      style={{ transition: 'cx 0.5s ease, cy 0.5s ease, r 0.3s ease' }}
                    />

                    {/* Specular highlight for alive/survivor */}
                    {!isDead && (
                      <ellipse
                        cx={x - nodeRadius * 0.2}
                        cy={y - nodeRadius * 0.25}
                        rx={nodeRadius * 0.35}
                        ry={nodeRadius * 0.2}
                        fill="rgba(255,255,255,0.4)"
                        style={{ filter: 'blur(0.5px)' }}
                      />
                    )}

                    {/* X mark for eliminated */}
                    {isDead && !isSurvivor && (
                      <>
                        <line
                          x1={x - nodeRadius * 0.35}
                          y1={y - nodeRadius * 0.35}
                          x2={x + nodeRadius * 0.35}
                          y2={y + nodeRadius * 0.35}
                          stroke="#475569"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          style={{ transition: 'x1 0.5s ease, y1 0.5s ease, x2 0.5s ease, y2 0.5s ease' }}
                        />
                        <line
                          x1={x + nodeRadius * 0.35}
                          y1={y - nodeRadius * 0.35}
                          x2={x - nodeRadius * 0.35}
                          y2={y + nodeRadius * 0.35}
                          stroke="#475569"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          style={{ transition: 'x1 0.5s ease, y1 0.5s ease, x2 0.5s ease, y2 0.5s ease' }}
                        />
                      </>
                    )}

                    {/* Number label */}
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isDead ? '#94a3b8' : '#fff'}
                      fontSize={isDead && !isSurvivor ? fontSize * 0.8 : fontSize}
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                      style={{
                        textShadow: isDead ? 'none' : '0px 1px 2px rgba(0,0,0,0.5)',
                        transition: 'x 0.5s ease, y 0.5s ease',
                      }}
                    >
                      {i + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Elimination order log */}
        <div className="w-full max-w-5xl mx-auto mb-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Elimination order</div>
          <div className="flex flex-wrap gap-1.5">
            {eliminationOrderRef.current.slice(0, eliminationStep).map((person, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 ${idx === n - 1
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 ring-2 ring-emerald-400'
                  : idx === eliminationStep - 1 && !isFinished
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
              >
                {person + 1}
              </span>
            ))}
            {eliminationStep === 0 && (
              <span className="text-gray-400 text-sm italic">Press Play or Step to begin...</span>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div
          className={`w-full max-w-5xl mx-auto py-4 text-center rounded-2xl border backdrop-blur-sm font-mono tracking-widest transition-colors duration-300 shadow-sm ${eliminationStep === 0
            ? 'bg-white/40 border-white/50 text-gray-500'
            : isFinished
              ? 'bg-emerald-400/20 border-emerald-400/40 text-emerald-700'
              : 'bg-blue-400/20 border-blue-400/40 text-blue-700'
            }`}
        >
          <div className="text-xl font-bold bg-clip-text">
            {eliminationStep === 0
              ? 'READY'
              : isFinished
                ? `SURVIVOR: Person ${survivor + 1}`
                : `ELIMINATING...`}
          </div>
          <div className="text-xs mt-1 font-sans font-medium tracking-normal opacity-70">
            Eliminated: {eliminationStep} / {n}
            {isFinished && ` • Survivor position: ${survivor + 1}`}
          </div>
        </div>

      </div>
    </div>
  );
}
