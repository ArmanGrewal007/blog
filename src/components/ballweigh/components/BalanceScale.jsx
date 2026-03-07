import { useEffect, useRef, useState } from "react";

function useSpringTilt(result) {
  const [tilt, setTilt] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const target = result === "left" ? -26 : result === "right" ? 26 : 0;

    if (result === null) {
      setTilt(0);
      return;
    }

    // Spring: overshoot → undershoot → settle
    const steps = [
      [0, target * 1.45],
      [180, target * 0.82],
      [340, target * 1.10],
      [470, target * 0.96],
      [580, target * 1.02],
      [680, target],
    ];

    steps.forEach(([delay, val]) => {
      timers.current.push(setTimeout(() => setTilt(val), delay));
    });

    return () => timers.current.forEach(clearTimeout);
  }, [result]);

  return tilt;
}

export default function BalanceScale({ result }) {
  const tilt = useSpringTilt(result);

  // SVG layout constants
  const cx = 160;       // pivot X
  const cy = 105;       // pivot Y
  const armLen = 105;   // half-beam length
  const chainLen = 52;  // chain length
  const panRx = 34;     // pan half-width

  // Beam end positions (rotated)
  const rad = (tilt * Math.PI) / 180;
  const lx = cx - armLen * Math.cos(rad);
  const ly = cy - armLen * Math.sin(rad);
  const rx = cx + armLen * Math.cos(rad);
  const ry = cy + armLen * Math.sin(rad);

  // Chain bottom (hangs straight down)
  const lbx = lx;
  const lby = ly + chainLen;
  const rbx = rx;
  const rby = ry + chainLen;

  const panColors = {
    beam: "#1A0E06",
    beamHighlight: "#4A340A",
    brass: "#C8960C",
    chain: "#8A6A20",
    panTop: "#C8960C",
    panBowl: "#9A6C08",
    panInner: "#E0A820",
    pivot: "#8A6A20",
    stand: "#2C1A08",
    base: "#1A0E06",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width="340"
        height="210"
        viewBox="0 0 340 210"
        className="overflow-visible"
        style={{ filter: "drop-shadow(0 6px 18px rgba(30,15,0,0.18))" }}
      >
        {/* Stand column */}
        <rect x="154" y="105" width="12" height="85" rx="5" fill={panColors.stand} />
        {/* Base */}
        <rect x="120" y="190" width="80" height="11" rx="5" fill={panColors.base} />
        <rect x="110" y="196" width="100" height="7" rx="3.5" fill={panColors.beamHighlight} opacity="0.4" />

        {/* Pivot housing */}
        <circle cx={cx} cy={cy} r={12} fill={panColors.stand} />
        <circle cx={cx} cy={cy} r={8} fill={panColors.brass} />
        <circle cx={cx} cy={cy} r={4} fill={panColors.beamHighlight} />

        {/* Beam */}
        <line
          x1={lx} y1={ly} x2={rx} y2={ry}
          stroke={panColors.beam}
          strokeWidth="10"
          strokeLinecap="round"
          style={{ transition: "x1 0.14s ease-out, y1 0.14s ease-out, x2 0.14s ease-out, y2 0.14s ease-out" }}
        />
        <line
          x1={lx} y1={ly} x2={rx} y2={ry}
          stroke={panColors.beamHighlight}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Left chain */}
        {[0, 1, 2, 3].map((i) => {
          const t1 = i / 4;
          const t2 = (i + 1) / 4;
          return (
            <line
              key={`lc-${i}`}
              x1={lx} y1={ly + chainLen * t1}
              x2={lx} y2={ly + chainLen * t2}
              stroke={panColors.chain}
              strokeWidth="2.5"
              strokeDasharray="5 3"
            />
          );
        })}

        {/* Right chain */}
        {[0, 1, 2, 3].map((i) => {
          const t1 = i / 4;
          const t2 = (i + 1) / 4;
          return (
            <line
              key={`rc-${i}`}
              x1={rx} y1={ry + chainLen * t1}
              x2={rx} y2={ry + chainLen * t2}
              stroke={panColors.chain}
              strokeWidth="2.5"
              strokeDasharray="5 3"
            />
          );
        })}

        {/* Left pan */}
        <g>
          {/* Pan shadow */}
          <ellipse cx={lbx} cy={lby + 14} rx={panRx - 4} ry={5} fill="rgba(0,0,0,0.15)" />
          {/* Bowl */}
          <path
            d={`M${lbx - panRx},${lby} Q${lbx - panRx},${lby + 16} ${lbx},${lby + 16} Q${lbx + panRx},${lby + 16} ${lbx + panRx},${lby}`}
            fill={panColors.panBowl}
          />
          {/* Rim */}
          <ellipse cx={lbx} cy={lby} rx={panRx} ry={7} fill={panColors.panTop} />
          <ellipse cx={lbx} cy={lby - 1} rx={panRx - 4} ry={5} fill={panColors.panInner} opacity="0.6" />
        </g>

        {/* Right pan */}
        <g>
          <ellipse cx={rbx} cy={rby + 14} rx={panRx - 4} ry={5} fill="rgba(0,0,0,0.15)" />
          <path
            d={`M${rbx - panRx},${rby} Q${rbx - panRx},${rby + 16} ${rbx},${rby + 16} Q${rbx + panRx},${rby + 16} ${rbx + panRx},${rby}`}
            fill={panColors.panBowl}
          />
          <ellipse cx={rbx} cy={rby} rx={panRx} ry={7} fill={panColors.panTop} />
          <ellipse cx={rbx} cy={rby - 1} rx={panRx - 4} ry={5} fill={panColors.panInner} opacity="0.6" />
        </g>

        {/* Status label */}
        <text
          x={cx}
          y="36"
          textAnchor="middle"
          fontSize="13"
          fontFamily="Gill Sans, sans-serif"
          fontWeight="600"
          fill={
            result === "balanced"
              ? "#2A6A2A"
              : result
                ? "#6A2A10"
                : "#AAA"
          }
          fontStyle={result ? "normal" : "italic"}
        >
          {result === "balanced"
            ? "⚖  Balanced"
            : result === "left"
              ? "◀  Left side heavier"
              : result === "right"
                ? "Right side heavier  ▶"
                : "Place balls on the pans to weigh"}
        </text>
      </svg>
    </div>
  );
}
