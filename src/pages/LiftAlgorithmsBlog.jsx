import BlogLayout from "@/components/BlogLayout";
import LiftSimulation from "@/components/liftAlgorithms/LiftSimulation";

export const frontmatter = {
  title: "Lift Algorithms",
  date: "2024-12-13",
  description: "An overview of different elevator scheduling algorithms.",
  slug: "lift-algorithms",
};

function LiftAlgorithmsBlog() {
  return (
    <BlogLayout title="Lift Algorithms" date="Dec 13, 2024">
      <p>
        Elevators, or lifts, are a classic example of scheduling problems in computer science.
        Various algorithms dictate how an elevator decides which floor to visit next.
      </p>

      <h2 className="text-xl font-bold mt-4 mb-2">Common Algorithms</h2>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>
          <strong>FCFS (First-Come, First-Serve):</strong> The simplest approach where requests are handled in the exact order they arrive. While fair, it is highly inefficient as the elevator might constantly travel between the top and bottom floors.
        </li>
        <li>
          <strong>SSTF (Shortest Seek Time First):</strong> The elevator always processes the closest requested floor next. This minimizes current movement but can lead to starvation for passengers requesting floors far away from the elevator's current busy area.
        </li>
        <li>
          <strong>SCAN (The Elevator Algorithm):</strong> Similar to a disk drive's seek mechanism, the elevator moves all the way to the top, answering requests along the way, and then reverses direction to move all the way to the bottom. This prevents starvation and provides a predictable, uniform wait time.
        </li>
      </ul>

      <LiftSimulation />

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl mb-6">
        <h3 className="text-lg font-bold text-amber-400 mb-2">Comparing Efficiency</h3>
        <p className="text-sm text-slate-300">
          Not all scheduling algorithms are created equal! To see how they stack up against each other, try using the <strong>Run Benchmark</strong> feature in the simulator above. This queues up the identical set of requests (Floors 9, 2, 8, 3, 7).
        </p>
        <p className="text-sm text-slate-300 mt-2">
          Watch the <strong>Distance</strong> metric closely. You'll observe that <strong>SCAN</strong> and <strong>SSTF</strong> typically complete the exact same trips in far fewer floors traversed compared to the naive <strong>FCFS</strong> approach!
        </p>
      </div>
    </BlogLayout>
  );
}

export default LiftAlgorithmsBlog;
