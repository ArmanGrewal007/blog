export const ROWS = 20;
export const COLS = 30;

// Create an empty grid with all cells set to 0
export const createEmtpyGrid = () => {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
};

// Eight directions to check for neighbours
export const DIRECTIONS = [
  [0, 1], // Right
  [1, 1], // Bottom Right
  [1, 0], // Bottom
  [1, -1], // Bottom Left
  [0, -1], // Left
  [-1, -1], // Top Left
  [-1, 0], // Top
  [-1, 1], // Top Right
];
