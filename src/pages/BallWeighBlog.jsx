import BlogLayout from "@/components/BlogLayout";
import BallWeighSimulation from "@/components/ballweigh/BallWeighSimulation";

export const frontmatter = {
  title: "BallWeigh problem",
  date: "2026-03-08",
  description: "Find the odd ball interactively ...",
  slug: "ballweigh",
};

function BallWeighBlog() {
  return (
    <BlogLayout title="BallWeigh Problem" date="Mar 8, 2026">
      <div className="flex flex-col gap-6 text-[15px] leading-relaxed mb-10 w-[95%] mx-auto">
        <p>
          The <strong>BallWeigh</strong> problem is a classic puzzle: You have $N$ balls, all of which look identical, but exactly one is slightly heavier or lighter. You have a balance scale, and your goal is to identify the odd ball and tell whether it is heavier or lighter using the minimum number of weighings.
        </p>
        <p>
          For example, when $N = 12$, you can always find the odd ball in just 3 weighings! Play the interactive simulation below to test your strategies, or click the <strong>Entropy</strong> button to see how Information Theory perfectly solves the puzzle by calculating the exact bits of information gained from every possible grouping.
        </p>

        <div className="mt-6 mb-12 flex justify-center w-full">
          <BallWeighSimulation />
        </div>
      </div>
    </BlogLayout>
  );
}

export default BallWeighBlog;
