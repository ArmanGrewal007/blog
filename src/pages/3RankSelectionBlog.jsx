import BlogLayout from "@/components/BlogLayout";

function RankSelectionBlog() {
  return (
    <BlogLayout title="Rank-Selection duality" date="Feb 25, 2026">

      <div>
        <strong>What is duality? </strong> - Duality is the principle that a problem can be transformed 
        into a complementary version where roles (like inputs/outputs, max/min, primal/constraint) 
        are reversed, yet the two formulations encode the same underlying structure.<br/>
        Kind of like an inverse function, at structural level.
        <ul className="list-disc pl-6">
          <li><strong>Rank Problem</strong> &rarr; </li>
          <li><strong>Selection Problem</strong> &rarr; </li>
        </ul>
      </div>

    </BlogLayout>
  );
}

export default RankSelectionBlog;
