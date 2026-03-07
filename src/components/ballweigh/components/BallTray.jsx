import { useState } from "react";
import Ball from "./Ball";

function DropZone({ label, zone, balls, onDrop, onBallClick, accentColor, bgColor, borderColor }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const ballId = parseInt(e.dataTransfer.getData("ballId"));
    if (!isNaN(ballId)) onDrop(ballId, zone);
  };

  return (
    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
      <span
        className="text-[11px] font-bold uppercase tracking-widest"
        style={{ color: accentColor }}
      >
        {label}
      </span>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="w-full min-h-[64px] rounded-2xl flex flex-wrap gap-2 p-3 justify-center items-center transition-all duration-200"
        style={{
          background: isDragOver
            ? `${bgColor}55`
            : `${bgColor}22`,
          border: `2px dashed ${isDragOver ? accentColor : borderColor}`,
          boxShadow: isDragOver ? `0 0 16px ${accentColor}44` : "none",
          transform: isDragOver ? "scale(1.015)" : "scale(1)",
        }}
      >
        {balls.length === 0 ? (
          <span className="text-[11px] opacity-30 italic select-none">
            {zone === "tray" ? "all on scale" : "drop here"}
          </span>
        ) : (
          balls.map((id) => (
            <Ball key={id} id={id} location={zone} onClick={onBallClick} />
          ))
        )}
      </div>
    </div>
  );
}

export default function BallTray({ ballCount, leftPan, rightPan, onBallDrop, onBallClick }) {
  const allBalls = Array.from({ length: ballCount }, (_, i) => i + 1);
  const trayBalls = allBalls.filter((b) => !leftPan.includes(b) && !rightPan.includes(b));

  return (
    <div className="flex flex-col gap-3 items-center w-full max-w-2xl">
      <div className="flex gap-3 w-full">
        <DropZone
          label="Left Pan"
          zone="left"
          balls={leftPan}
          onDrop={onBallDrop}
          onBallClick={onBallClick}
          accentColor="#4A90D9"
          bgColor="#0F2140"
          borderColor="rgba(74,144,217,0.4)"
        />
        <DropZone
          label="Tray"
          zone="tray"
          balls={trayBalls}
          onDrop={onBallDrop}
          onBallClick={onBallClick}
          accentColor="#9A7A4A"
          bgColor="#1E1308"
          borderColor="rgba(154,122,74,0.3)"
        />
        <DropZone
          label="Right Pan"
          zone="right"
          balls={rightPan}
          onDrop={onBallDrop}
          onBallClick={onBallClick}
          accentColor="#D94A8A"
          bgColor="#3A0F25"
          borderColor="rgba(217,74,138,0.4)"
        />
      </div>
      <p className="text-[11px] opacity-40 italic text-center">
        Drag balls into the pans — or click to cycle: Tray → Left → Right → Tray
      </p>
    </div>
  );
}
