import BlogLayout from "@/components/BlogLayout";
import BallWeighSimulation from "@/components/ballweigh/BallWeighSimulation";

export const frontmatter = {
  title: "Balancing Problems and Information Theory",
  date: "2026-03-08",
  description: "Find the odd ball interactively ...",
  slug: "balancing-problems-and-information-theory",
};

function BalancingProblemsBlog() {
  return (
    <BlogLayout title="Balancing Problems and Information Theory" date="Mar 8, 2026">
      <div className="flex flex-col gap-6 text-[15px] leading-relaxed mb-10 w-[95%] mx-auto">
        <div className="mt-6 mb-12 flex justify-center w-full">
          <BallWeighSimulation />
        </div>
      </div>
    </BlogLayout>
  );
}

export default BalancingProblemsBlog;
