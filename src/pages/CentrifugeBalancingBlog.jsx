import BlogLayout from "@/components/BlogLayout";
import CentrifugeBalancing from "@/components/centrifugeBalancing/CentrifugeBalancing";
import { InlineMath } from "react-katex";


export const frontmatter = {
  title: "Centrifuge Balancing problem",
  date: "2024-11-13",
  description: "Exploring the centrifuge balancing problem...",
  slug: "centrifuge-balancing-problem",
};

export default function CentrifugeBalancingBlog() {
  return (
    <BlogLayout title={frontmatter.title} date="Nov 13, 2024">
      <div className="flex flex-col gap-6 text-[15px] leading-relaxed mb-10 w-[95%] mx-auto text-gray-800">

        <p>
          The centrifuge balancing problem explores the mathematics and physics behind balancing a centrifuge rotor with test tubes.
          A centrifuge spins samples at incredibly high speeds, meaning an unbalanced rotor could lead to catastrophic failure.
          But how do we know if a specific configuration of test tubes is balanced?
        </p>

        <h3 className="text-xl font-bold mt-4 text-gray-900">Physics Vector Summation</h3>

        <p>
          When solving the centrifuge balancing problem, it's helpful to model the rotor as a 2D plane.
          Each test tube acts as a point mass <InlineMath math="m" /> located at a specific angle from the center axis.
          We can represent the position of each placed tube as a vector  <InlineMath math="\vec{v}" /> pointing from the origin (center) to the tube's position.
        </p>

        <p>
          For the centrifuge to be physically balanced, the overall center of mass must lie exactly at the origin.
          Mathematically, this means the <strong>vector sum</strong> of all the individual mass vectors must evaluate to exactly zero:
          <InlineMath math="\sum \vec{v_i} = 0" />
        </p>

        <p>
          In the interactive simulation below, you can visualize these individual vectors (drawn as blue lines originating from the center).
          As you add or remove tubes, watch how their respective vectors combine and cancel each other out depending on their symmetry.
          The bold line ending in a dot represents the resultant net vector (the center of mass). When its magnitude reaches zero, the centrifuge achieves a balanced state!
        </p>

        <div className="my-8">
          <CentrifugeBalancing />
        </div>

        <h3 className="text-xl font-bold mt-4 text-gray-900">Solving with Divisors</h3>

        <p>
          A more formal way to look at this problem involves the factors of the number of holes, <InlineMath math="N" />.
          A centrifuge can be balanced with <InlineMath math="n" /> tubes if: <InlineMath math="n = a_1 d_1 + a_2 d_2 + \dots" />
        </p>

        <p>
          where <InlineMath math="d_i" /> are divisors of the rotor size <InlineMath math="N" /> (except 1, because a single tube cannot balance itself unless symmetry strictly requires pairs, which only occurs if <InlineMath math="N" /> is mathematically restricted in a specific design), and <InlineMath math="a_i" /> are non-negative integers representing how many times we use a given divisor pattern.
        </p>

        <p>
          In practice, when you place <InlineMath math="d" /> tubes (where <InlineMath math="d" /> is a divisor of <InlineMath math="N" />), you place them equally spaced around the rotor.
          The vector sum of any set of equally spaced point masses around a circle is always zero.
          Therefore, any combination of these balanced symmetrical groups will also result in a completely balanced centrifuge!
        </p>

      </div>
    </BlogLayout>
  );
}
