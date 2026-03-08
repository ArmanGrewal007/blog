import { useCallback, useEffect, useRef, useState } from "react";
import { createEmtpyGrid, ROWS, COLS, DIRECTIONS } from "./utils";
import { PlayPauseButton } from "./components/PlayPauseButton";
import { Button } from "./components/Button";
import { Select } from "./components/Select";

function GameOfLife() {
  const [grid, setGrid] = useState(createEmtpyGrid());
  const [isPlaying, setIsPlaying] = useState(false);

  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;

  const [speed, setSpeed] = useState(100);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const runGameofLife = useCallback(() => {
    if (!playingRef.current) {
      return;
    }
    setGrid((currGrid) => {
      const newGrid = currGrid.map((arr) => [...arr]);
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          let liveNeighbours = 0;
          DIRECTIONS.forEach(([dirx, diry]) => {
            const neighborRow = row + dirx;
            const neighborCol = col + diry;
            if (
              neighborRow >= 0 &&
              neighborRow < ROWS &&
              neighborCol >= 0 &&
              neighborCol < COLS
            ) {
              liveNeighbours += currGrid[neighborRow][neighborCol];
            }
          });

          if (liveNeighbours < 2 || liveNeighbours > 3) {
            newGrid[row][col] = 0;
          } else if (currGrid[row][col] === 0 && liveNeighbours === 3) {
            newGrid[row][col] = 1;
          }
        }
      }
      return newGrid;
    });

    setTimeout(runGameofLife, speedRef.current);
  }, []);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const handleMouseDown = () => setIsMouseDown(true);
  const handleMouseUp = () => setIsMouseDown(false);

  const toggleCellState = (row, col) => {
    setGrid((currGrid) => {
      const newGrid = currGrid.map((arr) => [...arr]);
      newGrid[row][col] = currGrid[row][col] ? 0 : 1;
      return newGrid;
    });
  };

  const handleMouseEnter = (row, col) => {
    if (isMouseDown) {
      toggleCellState(row, col);
    }
  };

  const getGridSize = () => {
    const size = Math.min(
      (window.innerWidth - 64) / COLS,
      (window.innerHeight - 400) / ROWS,
      20
    );
    return Math.max(size, 10);
  };

  const [cellSize, setCellSize] = useState(getGridSize());

  useEffect(() => {
    const handleResize = () => {
      setCellSize(getGridSize());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex items-center flex-col gap-4 py-8">
      <div className="flex gap-4 items-center flex-wrap justify-center mb-4">
        <PlayPauseButton
          isPlaying={isPlaying}
          onClick={() => {
            setIsPlaying(!isPlaying);
            if (!isPlaying) {
              playingRef.current = true;
              runGameofLife();
            }
          }}
        />
        <Button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < ROWS; i++) {
              rows.push(
                Array.from(Array(COLS), () => (Math.random() > 0.7 ? 1 : 0))
              );
            }
            setGrid(rows);
          }}
        >
          Seed
        </Button>
        <Button
          onClick={() => {
            setGrid(createEmtpyGrid());
            setIsPlaying(false);
          }}
        >
          Clear
        </Button>
        <Select
          value={speed}
          onChange={(e) => setSpeed(parseInt(e.target.value))}
          label="Speed"
        >
          <option value={1000}>Slow</option>
          <option value={500}>Medium</option>
          <option value={100}>Fast</option>
          <option value={50}>Supa Fast</option>
        </Select>
      </div>

      <div
        className="grid gap-[2px] bg-emerald-100 p-2 rounded-lg shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`,
        }}
        onMouseLeave={handleMouseUp}
      >
        {grid.map((rows, i) =>
          rows.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`border border-emerald-100 aspect-square transition-all duration-100 ease-in-out cursor-pointer ${cell
                ? "bg-emerald-600 shadow-2xl transform-gpu scale-110 hover:scale-125 rounded-sm cell-wave"
                : "bg-emerald-50/50 shadow-2xl hover:scale-125 rounded-sm"
                }`}
              onMouseDown={() => {
                handleMouseDown();
                toggleCellState(i, j);
              }}
              onMouseUp={handleMouseUp}
              onMouseEnter={() => handleMouseEnter(i, j)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default GameOfLife;
