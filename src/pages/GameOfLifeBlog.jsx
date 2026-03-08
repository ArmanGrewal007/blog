import BlogLayout from "@/components/BlogLayout";
import GameOfLife from "@/components/gameOfLife/GameOfLife";

export const frontmatter = {
  title: "Conway's Game of Life: Zero player game",
  date: "2024-12-20",
  description: "An exploration of cellular automata and the beauty of emergent complexity.",
  slug: "game-of-life",
};

function GameOfLifeBlog() {
  return (
    <BlogLayout title="Conway's Game of Life: Zero player game" date="Dec 20, 2024">
      <p>
        The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.
        It is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input.
        One interacts with the Game of Life by creating an initial configuration and observing how it evolves.
      </p>

      <h2 className="text-xl font-bold mt-6 mb-2">The Rules</h2>
      <p className="mb-4">
        The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead.
        Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent.
        At each step in time, the following transitions occur:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li><strong>Underpopulation:</strong> Any live cell with fewer than two live neighbours dies.</li>
        <li><strong>Survival:</strong> Any live cell with two or three live neighbours lives on to the next generation.</li>
        <li><strong>Overpopulation:</strong> Any live cell with more than three live neighbours dies.</li>
        <li><strong>Reproduction:</strong> Any dead cell with exactly three live neighbours becomes a live cell.</li>
      </ul>

      <p>
        These simple rules give rise to incredibly complex and beautiful patterns, ranging from stable "still lifes" to oscillating "blinkers" and moving "spaceships" like the famous Glider.
      </p>

      <div className="flex flex-col items-center justify-center backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-gray-900 w-full max-w-2xl mx-auto bg-orange-50/30 border border-orange-900/10 my-8 relative overflow-hidden">
        <GameOfLife />
      </div>
    </BlogLayout>
  );
}

export default GameOfLifeBlog;
