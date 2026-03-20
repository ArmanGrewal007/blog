import React, { useState, useEffect } from 'react';

const ROWS = 20;
const SEATS_PER_ROW = 6;
const SEAT_COLS = [0, 1, 2, 4, 5, 6]; // Column 3 is the aisle

function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const generatePassengers = (method) => {
  let queue = [];

  if (method === 'Random') {
    for (let r = 0; r < ROWS; r++) {
      for (let s of SEAT_COLS) {
        queue.push({ row: r, seat: s });
      }
    }
    queue = shuffle(queue);
  }
  else if (method === 'Back-to-Front') {
    const zones = [[15, 19], [10, 14], [5, 9], [0, 4]];
    for (let zone of zones) {
      let zoneQueue = [];
      for (let r = zone[0]; r <= zone[1]; r++) {
        for (let s of SEAT_COLS) {
          zoneQueue.push({ row: r, seat: s });
        }
      }
      queue.push(...shuffle(zoneQueue));
    }
  }
  else if (method === 'WilMA') {
    let windows = [], middles = [], aisles = [];
    for (let r = 0; r < ROWS; r++) {
      for (let s of SEAT_COLS) {
        if (s === 0 || s === 6) windows.push({ row: r, seat: s });
        else if (s === 1 || s === 5) middles.push({ row: r, seat: s });
        else aisles.push({ row: r, seat: s });
      }
    }
    queue.push(...shuffle(windows));
    queue.push(...shuffle(middles));
    queue.push(...shuffle(aisles));
  }
  else if (method === 'Steffen') {
    const groups = [
      { rows: 0, seats: [0] }, { rows: 0, seats: [6] },
      { rows: 1, seats: [0] }, { rows: 1, seats: [6] },
      { rows: 0, seats: [1] }, { rows: 0, seats: [5] },
      { rows: 1, seats: [1] }, { rows: 1, seats: [5] },
      { rows: 0, seats: [2] }, { rows: 0, seats: [4] },
      { rows: 1, seats: [2] }, { rows: 1, seats: [4] }
    ];
    for (let g of groups) {
      let sub = [];
      for (let r = ROWS - 1; r >= 0; r--) {
        if (r % 2 === g.rows) {
          for (let s of g.seats) {
            sub.push({ row: r, seat: s });
          }
        }
      }
      queue.push(...sub);
    }
  }

  // Add stow times and IDs
  return queue.map((p, i) => ({
    ...p,
    id: i,
    stowing: Math.floor(Math.random() * 8) + 4, // 4 to 11 ticks to stow luggage
    color: `hsl(${(p.row / ROWS) * 360}, 75%, 60%)` // color based on target row
  }));
};

export default function BoardingSimulator() {
  const [method, setMethod] = useState('Random');
  const [status, setStatus] = useState('idle'); // 'idle', 'running', 'paused', 'finished'

  const [benchmarking, setBenchmarking] = useState(false);
  const [benchmarkQueue, setBenchmarkQueue] = useState(null);
  const [benchmarkResults, setBenchmarkResults] = useState({});
  const algorithms = ['Random', 'Back-to-Front', 'WilMA', 'Steffen'];

  const [simState, setSimState] = useState({
    queue: [],
    aisle: Array(ROWS).fill(null),
    seated: Array.from({ length: ROWS }, () => Array(7).fill(null)),
    ticks: 0,
  });

  const reset = (newMethod = method, queueToUse = null) => {
    setMethod(newMethod);
    setSimState({
      queue: queueToUse || generatePassengers(newMethod),
      aisle: Array(ROWS).fill(null),
      seated: Array.from({ length: ROWS }, () => Array(7).fill(null)),
      ticks: 0
    });
    setStatus('idle');
  };

  const startBenchmark = () => {
    // Generate an initial random baseline queue, or specific for testing
    const queue = generatePassengers('Random');
    setBenchmarkQueue(queue);
    setBenchmarkResults({});
    setBenchmarking(true);
    reset('Random', [...queue]);
    setStatus('running');
  };

  useEffect(() => {
    reset();
  }, []);

  const tick = () => {
    setSimState(prev => {
      let nextAisle = [...prev.aisle];
      let nextSeated = prev.seated.map(r => [...r]);
      let nextQueue = [...prev.queue];
      let someoneMoved = false;

      for (let r = ROWS - 1; r >= 0; r--) {
        let p = nextAisle[r];
        if (!p) continue;
        someoneMoved = true;

        if (p.row === r) {
          if (p.stowing > 0) {
            nextAisle[r] = { ...p, stowing: p.stowing - 1 };
          } else {
            // Sit down
            nextSeated[r][p.seat] = p;
            nextAisle[r] = null;
          }
        } else {
          // Move forward
          if (r + 1 < ROWS && !nextAisle[r + 1]) {
            nextAisle[r + 1] = p;
            nextAisle[r] = null;
          }
        }
      }

      // Enter plane
      if (nextQueue.length > 0 && !nextAisle[0]) {
        let p = nextQueue.shift();
        nextAisle[0] = p;
        someoneMoved = true;
      }

      const isFinished = nextQueue.length === 0 && !someoneMoved;

      if (isFinished && status === 'running') {
        if (benchmarking) {
          setBenchmarkResults(prevRes => {
            const newRes = { ...prevRes, [method]: prev.ticks };
            const currentIndex = algorithms.indexOf(method);

            if (currentIndex < algorithms.length - 1) {
              const nextMethod = algorithms[currentIndex + 1];
              // To benchmark purely the algorithm efficiency, generate fresh queue based on that method
              const nextQueue = generatePassengers(nextMethod);

              setTimeout(() => {
                reset(nextMethod, nextQueue);
                setStatus('running');
              }, 1000); // 1 sec pause
            } else {
              setBenchmarking(false);
              setStatus('finished');
            }
            return newRes;
          });
        } else {
          setStatus('finished');
        }
      }

      return {
        queue: nextQueue,
        aisle: nextAisle,
        seated: nextSeated,
        ticks: isFinished ? prev.ticks : prev.ticks + 1
      };
    });
  };

  useEffect(() => {
    if (status === 'running') {
      const id = setInterval(tick, benchmarking ? 10 : 25);
      return () => clearInterval(id);
    }
  }, [status, benchmarking, method]);

  return (
    <div className="flex flex-col items-center w-full gap-6 my-8 font-sans">
      <div className="flex bg-[#FCF8EE] p-6 lg:p-8 backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_32px_rgba(251,146,60,0.15)] bg-orange-50/40 border border-orange-200/50 w-full overflow-hidden justify-center relative flex-col">

        {/* Top Header & Controls */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 border-b border-slate-700 pb-6 mb-6 w-full max-w-5xl mx-auto">

          <div className="text-center xl:text-left flex-shrink-0">
            <h3 id="aeroplane-boarding-simulator" className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight leading-tight">Aeroplane Boarding Simulator</h3>
          </div>


          <div className="flex gap-3 items-center w-full sm:w-auto justify-center">
            {status !== 'running' ? (
              <button
                onClick={() => status === 'finished' ? reset() : setStatus('running')}
                disabled={benchmarking}
                className="h-9 px-6 bg-emerald-500/90 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-[0_4px_20px_rgba(16,185,129,0.3)] flex items-center gap-2 backdrop-blur-sm border border-emerald-400/50 disabled:opacity-50 disabled:scale-100 flex-1 sm:flex-auto min-w-[100px] justify-center"
              >
                {status === 'finished' ? 'Restart' : 'Play'}
              </button>
            ) : (
              <button
                onClick={() => setStatus('paused')}
                disabled={benchmarking}
                className="h-9 px-6 bg-amber-500/90 hover:bg-amber-500 text-white rounded-xl font-bold shadow-[0_4px_20px_rgba(245,158,11,0.3)] backdrop-blur-sm border border-amber-400/50 disabled:opacity-50 disabled:scale-100 flex-1 sm:flex-auto min-w-[100px] flex items-center justify-center"
              >
                Pause
              </button>
            )}

            <div className="h-9 flex flex-1 sm:flex-none justify-center items-center bg-white/70 px-4 rounded-xl border border-white/60 shadow-sm backdrop-blur-md min-w-[100px]">
              <span className="text-gray-500 font-medium text-sm mr-2 uppercase tracking-wider">Ticks</span>
              <span className="font-mono font-bold text-xl text-gray-800">{simState.ticks}</span>
            </div>

            <select
              value={method}
              onChange={(e) => reset(e.target.value)}
              disabled={benchmarking}
              className="h-9 px-4 rounded-xl bg-white/70 border border-gray-200 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50 min-w-[140px]"
            >
              {algorithms.map(m => (<option key={m} value={m}>{m}</option>))}
            </select>

            <button
              onClick={startBenchmark}
              disabled={benchmarking || status === 'running'}
              className="h-9 px-6 bg-purple-600/90 hover:bg-purple-600 text-white rounded-xl font-bold shadow-[0_4px_20px_rgba(147,51,234,0.3)] backdrop-blur-sm border border-purple-400/50 disabled:opacity-50 disabled:scale-100 flex items-center gap-2 flex-1 sm:flex-auto whitespace-nowrap justify-center"
            >
              {benchmarking ? 'Testing...' : 'Test Benchmark'}
            </button>
          </div>
        </div>

        {/* Benchmark Results Display */}
        {Object.keys(benchmarkResults).length > 0 && (
          <div className="flex gap-4 w-full justify-center max-w-5xl mx-auto flex-wrap mb-6">
            {algorithms.map(alg => (
              <div key={alg} className={`px-4 py-2 rounded-xl backdrop-blur-sm border ${benchmarkResults[alg] ? 'bg-white/80 border-purple-200 shadow-sm transition-all scale-105' : 'bg-white/40 border-gray-200/50 opacity-60'} flex flex-col items-center min-w-[120px]`}>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{alg}</span>
                <span className="font-mono text-xl font-bold text-purple-700">{benchmarkResults[alg] || '---'}</span>
              </div>
            ))}
          </div>
        )}

        {/* Plane and Queue Layout Fixed */}
        <div className='flex flex-col'>
          <div className="flex flex-row items-start justify-center gap-12 my-4 w-full max-w-4xl">

            {/* Plane container */}
            <div className="flex flex-col gap-[3px] bg-white/80 backdrop-blur-md p-6 rounded-t-[5rem] border border-gray-200/80 shadow-2xl relative pt-10">

              {/* Seat Letters Header */}
              <div className="flex gap-2 items-center mb-1">
                <div className="flex gap-[3px]">
                  {['A', 'B', 'C'].map(l => (
                    <div key={l} className="w-5 text-center text-[11px] font-bold text-gray-400/90 select-none">{l}</div>
                  ))}
                </div>
                <div className="w-8"></div>
                <div className="flex gap-[3px]">
                  {['D', 'E', 'F'].map(l => (
                    <div key={l} className="w-5 text-center text-[11px] font-bold text-gray-400/90 select-none">{l}</div>
                  ))}
                </div>
              </div>

              {Array.from({ length: ROWS }).map((_, r) => (
                <div key={r} className="flex gap-2 items-center">
                  {/* Left seats: 0, 1, 2 */}
                  <div className="flex gap-[3px]">
                    {[0, 1, 2].map(c => {
                      const p = simState.seated[r][c];
                      return (
                        <div key={c} className="w-5 h-5 rounded flex items-center justify-center transition-colors duration-300 shadow-inner border border-black/5"
                          style={{ backgroundColor: p ? p.color : '#f8fafc' }}>
                        </div>
                      );
                    })}
                  </div>

                  {/* Aisle */}
                  <div className="w-8 h-8 rounded-sm flex items-center justify-center bg-gray-100/50 relative border-x border-dashed border-gray-300">
                    {/* Row Number Marker */}
                    <span className="absolute -left-30 text-[11px] text-gray-400/80 font-mono hidden sm:block w-6 text-right pr-2 select-none">
                      {r + 1}
                    </span>
                    {simState.aisle[r] && (
                      <div className="w-5 h-5 rounded-full shadow-md transition-all duration-100"
                        style={{ backgroundColor: simState.aisle[r].color, transform: simState.aisle[r].stowing > 0 ? 'scale(0.8)' : 'scale(1)' }}>
                      </div>
                    )}
                  </div>

                  {/* Right seats: 4, 5, 6 */}
                  <div className="flex gap-[3px]">
                    {[4, 5, 6].map(c => {
                      const p = simState.seated[r][c];
                      return (
                        <div key={c} className="w-5 h-5 rounded flex items-center justify-center transition-colors duration-300 shadow-inner border border-black/5"
                          style={{ backgroundColor: p ? p.color : '#f8fafc' }}>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Queue container */}
            <div className="flex flex-col pt-4 w-[160px] min-w-[360px] max-w-[160px] bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-sm h-fit">
              <div className="flex items-center justify-between border-b border-gray-200/50 pb-3 mb-4">
                <h4 className="font-bold text-gray-600 uppercase tracking-wider text-sm">Queue</h4>
                <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-full">{simState.queue.length}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 content-start w-full">
                {simState.queue.slice(0, 100).map((p, i) => (
                  <div key={p.id} className="w-3.5 h-3.5 rounded-full shadow-sm border border-black/10 transition-all duration-300 hover:scale-150 cursor-crosshair"
                    style={{ backgroundColor: p.color }} title={`Target: Row ${p.row + 1} Seat ${['A', 'B', 'C', '', 'D', 'E', 'F'][p.seat]}`}>
                  </div>
                ))}
                {simState.queue.length > 100 && <div className="text-xs text-gray-500 font-medium ml-1 flex items-center bg-white/50 px-2 rounded-full border border-gray-200">+{simState.queue.length - 100}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
