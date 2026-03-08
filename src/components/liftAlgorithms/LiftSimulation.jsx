import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const TOTAL_FLOORS = 10;
const FLOOR_HEIGHT = 60; // px
const LIFT_SPEED = 800; // ms per floor

// Helper to get floor label
const getFloorLabel = (index) => (index === 0 ? "G" : index.toString());

function LiftSimulation() {
  const [currentFloor, setCurrentFloor] = useState(0);
  const [requests, setRequests] = useState([]);
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState(null); // 'UP' | 'DOWN' | null
  const [algorithm, setAlgorithm] = useState("FCFS");
  const [totalDistance, setTotalDistance] = useState(0);
  const [targetFloor, setTargetFloor] = useState(0);
  const [moveDuration, setMoveDuration] = useState(0);

  // Ref to hold the latest state for the simulation loop to access without dependencies
  const stateRef = useRef({ currentFloor, requests, algorithm, isMoving, direction });

  useEffect(() => {
    stateRef.current = { currentFloor, requests, algorithm, isMoving, direction };
  }, [currentFloor, requests, algorithm, isMoving, direction]);

  const addRequest = (floor) => {
    if (!requests.includes(floor) && floor !== currentFloor) {
      setRequests((prev) => [...prev, floor]);
    }
  };

  const calculateNextFloor = () => {
    const state = stateRef.current;
    if (state.requests.length === 0) return null;

    let nextFloor = null;

    switch (state.algorithm) {
      case "FCFS":
        nextFloor = state.requests[0];
        break;

      case "SSTF": {
        // Find closest request
        let minDiff = Infinity;
        for (const req of state.requests) {
          const diff = Math.abs(req - state.currentFloor);
          if (diff < minDiff) {
            minDiff = diff;
            nextFloor = req;
          } else if (diff === minDiff) {
            // Tie-breaker: keep moving in current direction if possible
            if (state.direction === "UP" && req > state.currentFloor) nextFloor = req;
            if (state.direction === "DOWN" && req < state.currentFloor) nextFloor = req;
          }
        }
        break;
      }

      case "SCAN": {
        const upRequests = state.requests.filter((r) => r > state.currentFloor).sort((a, b) => a - b);
        const downRequests = state.requests.filter((r) => r < state.currentFloor).sort((a, b) => b - a);

        let currentDir = state.direction || "UP";

        if (currentDir === "UP") {
          if (upRequests.length > 0) {
            nextFloor = upRequests[0];
          } else if (downRequests.length > 0) {
            currentDir = "DOWN";
            nextFloor = downRequests[0];
          } else {
            // Edge case where current direction yields nothing, flip it
            currentDir = "DOWN";
          }
        } else {
          if (downRequests.length > 0) {
            nextFloor = downRequests[0];
          } else if (upRequests.length > 0) {
            currentDir = "UP";
            nextFloor = upRequests[0];
          } else {
            // Edge case where current direction yields nothing, flip it
            currentDir = "UP";
          }
        }
        // Ensure direction updates if it changed during SCAN decision
        if (state.direction !== currentDir && nextFloor !== null) {
          setDirection(currentDir);
        }
        break;
      }
      default:
        nextFloor = state.requests[0];
    }
    return nextFloor;
  };

  useEffect(() => {
    if (isMoving || requests.length === 0) return;

    const nextFloor = calculateNextFloor();
    if (nextFloor === null) return;

    setIsMoving(true);
    const newDir = nextFloor > currentFloor ? "UP" : "DOWN";
    setDirection(newDir);

    const distance = Math.abs(nextFloor - currentFloor);
    const moveTime = distance * LIFT_SPEED;

    setTargetFloor(nextFloor);
    setMoveDuration(distance * (LIFT_SPEED / 1000));
    setTotalDistance((prev) => prev + distance);

    // Simulate travel waiting time
    setTimeout(() => {
      setCurrentFloor(nextFloor);
      setRequests((prev) => prev.filter((r) => r !== nextFloor));

      // Wait a moment at the floor before picking next
      setTimeout(() => {
        setIsMoving(false);
        if (stateRef.current.requests.length === 0) {
          setDirection(null);
        }
      }, 500);

    }, moveTime);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests.length, isMoving, algorithm]);

  // Handle clearing requests when changing algorithm to prevent confusion
  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
    setRequests([]);
    setTotalDistance(0);
    setTimeout(() => setIsMoving(false), 50); // Reset moving state gracefully if changed
  };

  const runBenchmark = () => {
    setCurrentFloor(0);
    setTargetFloor(0);
    setMoveDuration(0);
    setRequests([9, 2, 8, 3, 7]);
    setTotalDistance(0);
    setIsMoving(false);
    setDirection(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6  backdrop-blur-xl rounded-2xl bg-orange-50/30 border border-orange-900/10 text-white my-10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)]">

      {/* Settings Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-700 pb-4">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-black">Elevator Scheduler</h3>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-end">
          <div className="text-sm font-medium text-amber-400 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 shadow-inner">
            Distance: {totalDistance} floors
          </div>
          <button
            onClick={runBenchmark}
            disabled={isMoving}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors shadow-md"
            title="Queues a predefined set of floors to compare distance across algorithms"
          >
            Run Benchmark
          </button>
          <div className="flex items-center gap-2">

            <select
              value={algorithm}
              onChange={handleAlgorithmChange}
              disabled={isMoving}
              className="bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-colors disabled:opacity-50 appearance-none"
            >
              <option value="FCFS">First-Come, First-Serve (FCFS)</option>
              <option value="SSTF">Shortest Seek Time First (SSTF)</option>
              <option value="SCAN">Elevator Algorithm (SCAN)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Building Container */}
        <div className="flex-1 relative border-l-4 border-r-4 border-slate-700 bg-slate-950 px-8 py-4 rounded-b-md shadow-[inset_0_20px_20px_-20px_rgba(0,0,0,0.5)]">
          {/* Lift Shaft Background Line */}
          <div className="absolute left-1/2 top-4 bottom-4 w-1 bg-slate-800/50 -translate-x-1/2 rounded-full z-0" />

          <div className="relative z-10 w-full" style={{ height: `${TOTAL_FLOORS * FLOOR_HEIGHT}px` }}>

            {/* Floors */}
            {Array.from({ length: TOTAL_FLOORS }).map((_, i) => {
              const floorNum = TOTAL_FLOORS - 1 - i;
              return (
                <div
                  key={floorNum}
                  className="w-full flex justify-between items-center border-b border-slate-800/30"
                  style={{ height: `${FLOOR_HEIGHT}px` }}
                >
                  <div className="w-16 font-semibold text-slate-500 text-lg tabular-nums border-r border-slate-800 h-full flex items-center pr-4">
                    Floor {getFloorLabel(floorNum)}
                  </div>

                  {/* Hall Call Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addRequest(floorNum)}
                      disabled={currentFloor === floorNum && !isMoving}
                      className={`p-2 rounded-full transition-all duration-300 shadow-lg border ${requests.includes(floorNum)
                        ? 'bg-amber-500/30 text-amber-400 border-amber-500/50 hover:bg-amber-500/40 ring-2 ring-amber-500/20 backdrop-blur-md'
                        : 'bg-slate-800/40 backdrop-blur-md text-slate-300 border-slate-600/50 hover:bg-slate-700/60 hover:text-white shadow-[0_4px_10px_rgba(0,0,0,0.2)]'
                        }`}
                      title="Call Lift Here"
                    >
                      <div className="flex flex-col justify-center items-center h-4 w-4">
                        <div className="h-2 w-2 rounded-full bg-current" />
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* The Lift Car */}
            <motion.div
              className="absolute left-1/2 w-10 bg-gradient-to-br from-slate-200 via-slate-400 to-slate-500 border border-slate-300 rounded-lg shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_8px_20px_rgba(0,0,0,0.6)] flex flex-col justify-center items-center"
              style={{
                height: `${FLOOR_HEIGHT - 10}px`,
                marginLeft: "-1.25rem",
              }}
              animate={{
                // Calculate position relative to top. 
                // Floor N is (TOTAL_FLOORS - 1 - N) * FLOOR_HEIGHT from the top
                top: (TOTAL_FLOORS - 1 - targetFloor) * FLOOR_HEIGHT + 5,
              }}
              transition={{
                // Base duration on the actual travel distance requested
                duration: moveDuration,
                ease: "easeInOut"
              }}
            >
              {/* Doors visual */}
              <div className="w-full h-full flex gap-[2px] px-[2px] py-[2px] bg-slate-900 rounded-md shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]">
                <div className="flex-1 bg-gradient-to-b from-slate-300 to-slate-400 rounded-sm border border-slate-400 shadow-[inset_1px_0_3px_rgba(255,255,255,0.6)]" />
                <div className="flex-1 bg-gradient-to-b from-slate-300 to-slate-400 rounded-sm border border-slate-400 shadow-[inset_-1px_0_3px_rgba(255,255,255,0.6)]" />
              </div>

              {/* Floor Indicator on Lift */}
              <div className="absolute -top-6 bg-slate-800 px-3 py-1 rounded border border-slate-700 shadow-lg text-xs font-bold text-emerald-400 tracking-wider flex items-center gap-2">
                <span>{getFloorLabel(currentFloor)}</span>
                {isMoving && direction === "UP" && <FaArrowUp className="w-3 h-3 text-emerald-400 animate-pulse" />}
                {isMoving && direction === "DOWN" && <FaArrowDown className="w-3 h-3 text-emerald-400 animate-pulse" />}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Inside Lift Control Panel */}
        <div className="w-full md:w-64 bg-gradient-to-br from-slate-200 via-slate-400 to-slate-500 p-6 rounded-xl border border-slate-100 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_10px_25px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden">
          {/* Metallic sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

          <h4 className="text-lg font-bold text-slate-800 mb-6 text-center tracking-wider uppercase text-xs drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] relative z-10">Internal Control Panel</h4>

          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-lg p-6 flex-1 shadow-[inset_0_5px_15px_rgba(0,0,0,0.8)] relative z-10">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: TOTAL_FLOORS }).map((_, i) => {
                const floorNum = TOTAL_FLOORS - 1 - i;
                const isRequested = requests.includes(floorNum);
                return (
                  <button
                    key={floorNum}
                    onClick={() => addRequest(floorNum)}
                    disabled={currentFloor === floorNum && !isMoving}
                    className={`
                        w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all mx-auto shadow-md
                        ${isRequested
                        ? 'bg-amber-400/80 backdrop-blur-md text-amber-950 border border-amber-300 shadow-[inset_0_1px_4px_rgba(255,255,255,0.6),0_0_15px_rgba(245,158,11,0.6)] ring-2 ring-amber-400/50'
                        : 'bg-white/10 backdrop-blur-md text-slate-200 border border-white/20 hover:bg-white/20 hover:border-white/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_4px_6px_rgba(0,0,0,0.2)]'
                      }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                  >
                    {getFloorLabel(floorNum)}
                  </button>
                );
              })}
            </div>

            {/* Queue Display */}
            <div className="mt-8 pt-4 border-t border-slate-700/50">
              <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">Active Queue:</div>
              <div className="flex flex-wrap gap-2 text-sm max-h-24 overflow-y-auto pr-1">
                {requests.length > 0 ? (
                  requests.map((r, i) => (
                    <span key={i} className="px-2 py-1 bg-black/40 backdrop-blur-md border border-slate-700 rounded text-amber-400 font-mono text-xs shadow-inner">
                      {getFloorLabel(r)}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic text-xs">No pending requests</span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LiftSimulation;
