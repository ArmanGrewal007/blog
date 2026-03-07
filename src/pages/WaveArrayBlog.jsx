import BlogLayout from "@/components/BlogLayout";
import { InlineMath } from "react-katex";
import CodeBlock from "@/components/CodeBlock";
import sortedWave from "@/assets/imgs/sorted_wave.png";
import sortedWave2 from "@/assets/imgs/sorted_wave2.png";

export const frontmatter = {
  title: "Primer on wave arrays",
  date: "2026-02-25",
  description: "Some proofs on waves in arrays ...",
  slug: "waveArray",
};

function WaveArrayBlog() {
  return (
    <BlogLayout title="Primer on wave arrays" date="Feb 25, 2026">
      <div>
        <div>A wave array is an array where elements follow an alternating up-down or down-up pattern.<br />
          Two valid forms:</div>
        <ul className="list-disc pl-6">
          <li><InlineMath math="a_0 \gt a_1 \lt a_2 \gt a_3 \lt a_4 \dots" /></li>
          <li><InlineMath math="a_0 \lt a_1 \gt a_2 \lt a_3 \gt a_4 \dots" /></li>
        </ul>
        <div>
          So every element is either a <strong>peak</strong> (greater than its neighbors),
          or a <strong>valley</strong> (less than its neighbors), except the end elements.
        </div>
        <br /> <hr className="mb-8 border-gray-400" />
        <div>
          Most people are familiar with the basic questions around wave arrays:
          <ol className="list-decimal pl-6 text-blue-600">
            <li>
              <a href="#check-wave" className="hover:underline">
                How do we check whether a given array is already a wave array?
              </a>
            </li>
            <li>
              <a href="#convert-wave" className="hover:underline">
                How can we convert an array into a wave array?
              </a>
            </li>
          </ol>
          <br />
          But while exploring the topic further, I started wondering about deeper follow-up questions.
          <ol start={3} className="list-decimal pl-6 text-blue-600">
            <li>
              <a href="#rearrange-wave" className="hover:underline">
                Can an array be rearranged to form a wave array at all?
              </a>
            </li>
            <li>
              <a href="#count-wave" className="hover:underline">
                How many distinct wave arrays can be formed by rearranging its elements?
              </a>
            </li>
            <li>
              <a href="#min-swaps" className="hover:underline">
                If a wave arrangement is possible, what is the minimum number of swaps required to achieve it?
              </a>
            </li>
          </ol> <br />
          Surprisingly, I couldn't find clear answers to all of them online.
          So I decided to think through the problems myself and work them out from scratch🫨 <br />
          <strong>Note that, if array has duplicates, they can't be adjacent ... otherwise that would not be a peak or valley, but a plateau.</strong>
        </div>
      </div>

      <h2 id="check-wave" className="text-2xl font-bold mt-12 mb-4">1. How do we check whether a given array is already a wave array?</h2>
      <div className="grid md:grid-cols-2 gap-4 items-start">

        {/* Explanation */}
        <div className="text-gray-700 leading-relaxed">
          A basic solution is already available{" "}
          <a
            href="https://www.geeksforgeeks.org/dsa/check-if-an-array-is-wave-array/"
            className="text-blue-600 hover:underline"
          >
            on GeeksForGeeks
          </a>, and this can easily be solved in <InlineMath math="\color{green}\mathbf{O(n)}" /><br />
          Only condition for an array to be a wave array is - <i>except for the first and last elements, every element must behave as either
            a <strong>peak</strong> or a <strong>valley</strong>.</i>
          <br />
          If this condition is not satisfied, then array is not a wave.
        </div>

        {/* Code */}
        <CodeBlock
          language="python"
          code={`def is_wave(arr):
    n = len(arr)
    for i in range(1, n-1):
        if not ((arr[i-1] < arr[i] > arr[i+1]) or
                (arr[i-1] > arr[i] < arr[i+1])):
            return False
    return True`}
        />
      </div>

      <h2 id="convert-wave" className="text-2xl font-bold mt-12 mb-4">2. How can we convert an array, with all distinct elements into a wave array?</h2>
      <div className="grid md:grid-cols-2 gap-4 items-start">

        {/* Explanation */}
        <div className="text-gray-700 leading-relaxed">
          Basic solution is again present {" "}
          <a
            href="https://www.geeksforgeeks.org/dsa/sort-array-wave-form-2/"
            className="text-blue-600 hover:underline"
          >
            on GeeksForGeeks
          </a>, but it is an <InlineMath math="\color{orange}\mathbf{O(n\,log n)}" />
          <ol className="list-decimal pl-6">
            <li>Sort the array, so that it becomes monotonic</li>
            <li>Swap adjacent pairs.</li>
          </ol>
          This works for both odd and even length arrays. The below figures are self-explanatory-
        </div>
        <CodeBlock
          language="python"
          code={`def to_wave_sorted(arr):
    arr.sort()
    for i in range(0, len(arr)-1, 2):
        arr[i], arr[i + 1] = arr[i + 1], arr[i]
    return arr`}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4 items-start">
        <figure className="text-center">
          <img src={sortedWave} className="w-full" style={{ mixBlendMode: "multiply" }} />
          <figcaption className="text-sm text-gray-700">Fig 2.1: Odd length array <InlineMath math="[10, 20, 30, 40, 50]" /></figcaption>
        </figure>
        <figure className="text-center">
          <img src={sortedWave2} className="w-full" style={{ mixBlendMode: "multiply" }} />
          <figcaption className="text-sm text-gray-700">Fig 2.2: Even length array <InlineMath math="[10, 20, 30, 40]" /></figcaption>
        </figure>
      </div>
      <br />
      <div className="grid md:grid-cols-2 gap-4 items-start">
        <div className="text-gray-700 leading-relaxed">
          But we have a better solution in <InlineMath math="\color{green}\mathbf{O(n)}" />
        </div>
        <CodeBlock
          language="python"
          code={`def to_wave_linear(arr):
    for i in range(0, len(arr)-1, 2):
        arr[i], arr[i + 1] = arr[i + 1], arr[i]
    return arr`}
        />
      </div>

      <h2 id="rearrange-wave" className="text-2xl font-bold mt-12 mb-4">
        3. Can an array be rearranged to form a wave array at all?
      </h2>

      <h2 id="count-wave" className="text-2xl font-bold mt-12 mb-4">
        4. How many distinct wave arrays can be formed by rearranging its elements?
      </h2>

      <h2 id="min-swaps" className="text-2xl font-bold mt-12 mb-4">
        5. If a wave arrangement is possible, what is the minimum number of swaps required?
      </h2>


    </BlogLayout>
  );
}

export default WaveArrayBlog;
