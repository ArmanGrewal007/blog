import BlogLayout from "@/components/BlogLayout";
import JosephusProblem from "@/components/josephusProblem/JosephusProblem";
import { InlineMath, BlockMath } from "react-katex";
import CodeBlock from "@/components/CodeBlock";

export const frontmatter = {
  title: "The Josephus Problem",
  date: "2024-07-08",
  description: "A classic elimination puzzle — who survives when every k-th person is removed from a circle?",
  slug: "josephus-problem",
};

export default function JosephusProblemBlog() {
  return (
    <BlogLayout title={frontmatter.title} date="Jul 8, 2024">
      <div className="flex flex-col gap-6 text-[15px] leading-relaxed mb-10 w-[95%] mx-auto text-gray-800">

        <p>
          The Josephus problem is one of the oldest and most elegant puzzles in mathematics and computer science.
          It is named after <strong>Flavius Josephus</strong>, a first-century Jewish historian who, according to legend,
          found himself trapped in a cave with 40 soldiers during the Roman siege of Yodfat in 67 AD.
          Rather than surrender, the group chose to form a circle and eliminate every third person until only one remained.
          Josephus, so the story goes, quickly computed where to stand — and survived.
        </p>

        <h2 id="problem-statement" className="text-xl font-bold mt-4 text-gray-900">Problem Statement</h2>

        <p>
          Given <InlineMath math="n" /> people standing in a circle numbered
          {" "}<InlineMath math="1" /> to <InlineMath math="n" />,
          starting from person <InlineMath math="1" />, count every <InlineMath math="k" />-th person
          and eliminate them. Continue counting from the next alive person until only one survivor remains.
          The question: <strong>what is the position of the survivor?</strong>
        </p>

        <p>
          For example, with <InlineMath math="n = 7" /> and <InlineMath math="k = 3" />,
          the elimination order is <InlineMath math="3, 6, 2, 7, 5, 1" /> and the survivor is
          person <strong>4</strong>. Try it yourself in the interactive simulator below!
        </p>

        <div className="my-8">
          <JosephusProblem />
        </div>

        <h2 id="the-recurrence-relation" className="text-xl font-bold mt-4 text-gray-900">The Recurrence Relation</h2>

        <p>
          The Josephus problem has a beautiful recursive solution. Let <InlineMath math="J(n, k)" /> denote
          the <strong>0-indexed</strong> position of the survivor among <InlineMath math="n" /> people with
          step size <InlineMath math="k" />.
        </p>

        <BlockMath math="J(1, k) = 0" />
        <BlockMath math="J(n, k) = \bigl(J(n-1,\, k) + k\bigr) \bmod n" />

        <p>
          The intuition is: after the first person is eliminated (the person at 0-indexed position <InlineMath math="k-1" />),
          the remaining <InlineMath math="n-1" /> people form a smaller circle.
          The survivor's position in the smaller circle is <InlineMath math="J(n-1, k)" />,
          but we need to shift by <InlineMath math="k" /> to map it back to the original numbering,
          then take <InlineMath math="\bmod\; n" /> to wrap around.
        </p>

        <h2 id="special-case-k-2" className="text-xl font-bold mt-4 text-gray-900">Special Case: <InlineMath math="k = 2" /></h2>

        <p>
          When <InlineMath math="k = 2" />, there is a stunning closed-form solution.
          Write <InlineMath math="n" /> in binary, rotate the leading 1-bit to the end,
          and you get the answer. More precisely:
        </p>

        <BlockMath math="J(n, 2) = 2L + 1" />

        <p>
          where <InlineMath math="n = 2^m + L" /> and <InlineMath math="0 \le L < 2^m" />.
          In other words, find the largest power of 2 not exceeding <InlineMath math="n" />,
          subtract it to get <InlineMath math="L" />, and the survivor
          is <InlineMath math="2L + 1" /> (using 1-indexed positions).
        </p>

        <h2 id="implementation" className="text-xl font-bold mt-4 text-gray-900">Implementation</h2>

        <p>
          The iterative solution runs in <InlineMath math="\color{green}\mathbf{O(n)}" /> time
          and <InlineMath math="\color{green}\mathbf{O(1)}" /> space:
        </p>

        <CodeBlock
          language="python"
          code={`def josephus(n, k):
    """Returns the 1-indexed survivor position."""
    pos = 0  # J(1, k) = 0
    for i in range(2, n + 1):
        pos = (pos + k) % i
    return pos + 1  # convert to 1-indexed`}
        />

        <p>And the closed-form for <InlineMath math="k = 2" />:</p>

        <CodeBlock
          language="python"
          code={`def josephus_k2(n):
    """Closed-form for k=2, returns 1-indexed position."""
    # Find highest power of 2 <= n
    p = 1
    while p * 2 <= n:
        p *= 2
    L = n - p
    return 2 * L + 1`}
        />

        <h2 id="complexity-analysis" className="text-xl font-bold mt-4 text-gray-900">Complexity Analysis</h2>

        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Brute force simulation</strong> (like the visualization above):
            {" "}<InlineMath math="\color{orange}\mathbf{O(n^2)}" /> — each elimination requires scanning through alive people.
          </li>
          <li>
            <strong>Iterative recurrence</strong>: <InlineMath math="\color{green}\mathbf{O(n)}" /> time,
            {" "}<InlineMath math="\color{green}\mathbf{O(1)}" /> space — the optimal general solution.
          </li>
          <li>
            <strong>Closed-form for <InlineMath math="k=2" /></strong>:
            {" "}<InlineMath math="\color{green}\mathbf{O(log\,n)}" /> — just find the highest power of 2.
          </li>
        </ul>

      </div>
    </BlogLayout>
  );
}
