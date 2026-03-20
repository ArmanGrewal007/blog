import React, { useState } from 'react';
import { useCentrifuge } from './hooks/useCentrifuge';

export default function CentrifugeBalancing() {
  const { N, setN, tubes, toggleTube, clearAll, comX, comY, isBalanced, totalMass } = useCentrifuge(12);
  const [showVectors, setShowVectors] = useState(true);

  const radius = 100;
  const center = 150;

  return (
    <div className="flex flex-col items-center justify-center p-6 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-gray-900 w-full max-w-2xl mx-auto bg-orange-50/30 border border-orange-900/10 my-8 relative overflow-hidden">
      <h3 id="centrifuge-simulator" className="text-2xl font-bold mb-4 text-gray-900">Centrifuge Simulator</h3>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 w-full justify-between">
        <div className="flex flex-col gap-2 w-full sm:w-1/2">
          <label className="text-sm font-medium text-gray-700 flex justify-between">
            <span>Number of holes (N)</span>
            <span className="font-bold">{N}</span>
          </label>
          <input
            type="range"
            min="2"
            max="36"
            value={N}
            onChange={(e) => setN(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowVectors(!showVectors)}
            className={`px-4 py-2 border rounded-xl cursor-pointer text-sm font-medium transition-colors backdrop-blur-sm ${showVectors ? 'bg-blue-500/10 border-blue-300/50 text-blue-700' : 'bg-white/30 border-white/40 text-gray-700 hover:bg-white/50'}`}
          >
            {showVectors ? 'Hide Vectors' : 'Show Vectors'}
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-white/30 hover:bg-white/50 active:bg-white/70 border border-white/40 backdrop-blur-sm rounded-xl text-sm font-medium transition-colors text-gray-800"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="relative w-[300px] h-[300px] mb-8 select-none">
        <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl">
          <defs>
            {/* Metallic Radial Gradient for the Rotor */}
            <radialGradient id="metalRotor" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="60%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>

            {/* Inset shadow gradient for holes */}
            <radialGradient id="holeInset" cx="50%" cy="50%" r="50%">
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>

            {/* Glowing Red Gradient for Tubes */}
            <radialGradient id="tubeGlow" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="40%" stopColor="#ef4444" />
              <stop offset="80%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>

            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="5" stdDeviation="4" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Outer Rotor Base */}
          <circle cx={center} cy={center} r={radius + 30} fill="url(#metalRotor)" stroke="#64748b" strokeWidth="2" filter="url(#shadow)" />

          {/* Decorative Inner Ring Pattern */}
          <circle cx={center} cy={center} r={radius + 15} fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />
          <circle cx={center} cy={center} r={radius - 18} fill="none" stroke="#334155" strokeWidth="1" opacity="0.3" />

          {/* Central Hub */}
          <circle cx={center} cy={center} r={18} fill="#334155" stroke="#1e293b" strokeWidth="1" />
          <circle cx={center} cy={center} r={8} fill="url(#metalRotor)" />
          <circle cx={center} cy={center} r={3} fill="#0f172a" />

          {/* Individual Vectors representing Physics Vector Summation */}
          {showVectors && tubes.map((isFilled, i) => {
            if (!isFilled) return null;
            const angle = (2 * Math.PI * i) / N - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={`vec-${i}`}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#3b82f6"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="opacity-90"
              />
            );
          })}

          {/* Center of Mass Indicator (Line from center to CoM) */}
          {totalMass > 0 && (
            <g className="transition-all duration-300 ease-in-out">
              <line
                x1={center}
                y1={center}
                x2={center + comX * radius}
                y2={center + comY * radius}
                stroke={isBalanced ? "#10b981" : "#f59e0b"}
                strokeWidth="4"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0px 0px 3px rgba(0,0,0,0.4))" }}
              />
              <circle
                cx={center + comX * radius}
                cy={center + comY * radius}
                r={7}
                fill={isBalanced ? "#10b981" : "#f59e0b"}
                stroke="#fff"
                strokeWidth="2"
                className={isBalanced ? "animate-pulse" : ""}
                style={{ filter: "drop-shadow(0px 0px 4px rgba(0,0,0,0.3))" }}
              />
            </g>
          )}

          {/* Holes and Tubes */}
          {tubes.map((isFilled, i) => {
            const angle = (2 * Math.PI * i) / N - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);

            return (
              <g
                key={i}
                onClick={() => toggleTube(i)}
                className="cursor-pointer transition-transform ease-out duration-200"
                style={{
                  transformOrigin: `${x}px ${y}px`,
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {/* Hole Shadow / Base */}
                <circle
                  cx={x}
                  cy={y}
                  r={13}
                  fill="url(#holeInset)"
                  stroke="#475569"
                  strokeWidth="1"
                />

                {/* The Tube */}
                {isFilled && (
                  <>
                    <circle
                      cx={x}
                      cy={y}
                      r={11}
                      fill="url(#tubeGlow)"
                      stroke="#450a0a"
                      strokeWidth="1"
                      className="transition-opacity duration-300"
                    />
                    {/* Exaggerated Specular Highlight for 3D metallic/glass effect */}
                    <path
                      d={`M ${x - 5} ${y - 6} Q ${x} ${y - 12} ${x + 6} ${y - 5}`}
                      stroke="rgba(255,255,255,0.7)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      style={{ filter: "blur(0.5px)" }}
                    />
                    <circle cx={x + 3} cy={y + 3} r={2} fill="rgba(255,255,255,0.3)" style={{ filter: "blur(0.5px)" }} />
                  </>
                )}

                {/* Slot Number */}
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isFilled ? "#fee2e2" : "#94a3b8"}
                  fontSize="12"
                  fontWeight="bold"
                  className="pointer-events-none select-none transition-colors duration-300"
                  style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.8)" }}
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className={`w-full py-4 text-center rounded-2xl border backdrop-blur-sm font-mono tracking-widest transition-colors duration-300 shadow-sm ${totalMass === 0
        ? "bg-white/40 border-white/50 text-gray-500"
        : isBalanced
          ? "bg-emerald-400/20 border-emerald-400/40 text-emerald-700"
          : "bg-amber-400/20 border-amber-400/40 text-amber-700"
        }`}>
        <div className="text-xl font-bold bg-clip-text">
          {totalMass === 0 ? "EMPTY" : (isBalanced ? "BALANCED" : "UNBALANCED")}
        </div>
        <div className="text-xs mt-1 font-sans font-medium tracking-normal opacity-70">
          Mass: {totalMass} / {N} • Center: ({comX.toFixed(3)}, {comY.toFixed(3)})
        </div>
      </div>
    </div>
  );
}
