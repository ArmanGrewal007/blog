import BlogLayout from "@/components/BlogLayout";
import { InlineMath, BlockMath } from "react-katex";
import furnitureDealerLP from "@/assets/imgs/furniture_dealer_lp.png";
import _3x3y from "@/assets/imgs/3x3y.gif";
import _5x1y from "@/assets/imgs/5x1y.gif";
import _10x3y from "@/assets/imgs/10x3y.gif";
import _6x6y from "@/assets/imgs/6x6y.gif";

export const frontmatter = {
  title: "Linear Programming and Game Theory",
  date: "2026-03-18",
  description: "An overview of different elevator scheduling algorithms.",
  slug: "linear-programming-gt",
};

function LinearProgrammingGT() {
  return (
    <BlogLayout title="Linear Programming and Game Theory" date="Mar 18, 2026">
      <p>
        Notes from Ch-8 of the book <a href="https://rksmvv.ac.in/wp-content/uploads/2021/04/Gilbert_Strang_Linear_Algebra_and_Its_Applicatio_230928_225121.pdf" className="hover:underline cursor-pointer text-blue-600">Linear Algebra and its Applications by Gilbert Strang</a>.
      </p>

      <h2 id="maximizingminimizing-and-objective-linear-function" className="text-xl font-bold mt-4 mb-2">1. Maximizing/Minimizing and objective linear function, subject to linear constraints</h2>
      <div>
        This is something we all did in Class12 NCERT book ... <br />
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
          Problem 1: We have a furniture dealer, who has max investment of Rs 50,000 and storage space of max 60 pieces.
          He can buy tables at cost of Rs 2500 and chairs at cost of Rs 500. He earns profit of Rs 250 on each table
          and Rs 75 on each chair. How many tables and chairs should he buy to maximize his profit?
        </blockquote>
        <br />
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            Let <InlineMath math="x" /> be the number of tables and <InlineMath math="y" /> be the number of chairs.
            Then we have the following constraints:
            <ul className="list-disc list-inside">
              <li><InlineMath math="2500x + 500y \le 50000" /></li>
              <li><InlineMath math="x + y \le 60" /></li>
              <li><InlineMath math="x \ge 0" /></li>
              <li><InlineMath math="y \ge 0" /></li>
            </ul>
            We want to maximize the profit, which is given by the objective function: <InlineMath math="\mathbf{Z = 250x + 75y}" />
            <div className="backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_32px_rgba(251,146,60,0.15)] bg-orange-50/40 border border-orange-200/50 p-4 my-4">
              <b>Fundamental theorem of Linear Programming</b> &rarr;
              <ul className="list-disc list-outside pl-6">
                <li>Let <InlineMath math="\mathbf{R}" /> be the feasible region (convex polygon) for a linear programming problem and
                  let <InlineMath math="\mathbf{Z = ax + by}" /> be the objective function. Then the optimal value of <InlineMath math="\mathbf{Z}" /> (max/min) occurs at a
                  vertex of the feasible region <InlineMath math="\mathbf{R}" /></li>
                <li>If <InlineMath math="\mathbf{R}" /> is bounded, then both the max and min values of <InlineMath math="\mathbf{Z}" /> exist and occur at the vertices of <InlineMath math="\mathbf{R}" /></li>
                <li>If <InlineMath math="\mathbf{R}" /> is unbounded, then the max and min values of <InlineMath math="\mathbf{Z}" /> may or may not exist. Hovever, if they exist, they must occur at a corner point.</li>
              </ul>
            </div>
            <div>
              So for our case, the maxima occurs when the dealer purchases 10 tables and 50 chairs, and his profit is Rs 6250. <br />
              <em>But this is only for 2 variables ... we are able to visualize it easily in 2 Dimensions. But what if we have more?</em>
            </div>
          </div>
          <div className="w-full md:w-1/3 top-4">
            <img src={furnitureDealerLP} alt="" className="w-full h-auto mix-blend-multiply" />
            <table className="w-full border border-black my-2 text-sm">
              <thead className="bg-gray-300">
                <tr>
                  <th className="border border-black px-4 py-2 text-left">Vertex of the feasible region</th>
                  <th className="border border-black px-4 py-2 text-left">Profit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-4 py-2">(0, 0)</td>
                  <td className="border border-black px-4 py-2">0</td>
                </tr>
                <tr>
                  <td className="border border-black px-4 py-2">(0, 60)</td>
                  <td className="border border-black px-4 py-2">4500</td>
                </tr>
                <tr className="bg-green-200">
                  <td className="border border-black px-4 py-2 font-bold">(10, 50)</td>
                  <td className="border border-black px-4 py-2 font-bold">6250</td>
                </tr>
                <tr>
                  <td className="border border-black px-4 py-2">(20, 0)</td>
                  <td className="border border-black px-4 py-2">5000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h3 id="why-the-optimal-solution-is-always-a-corner" className="text-l font-bold mt-4 mb-2"> 1.1 Why the optimal solution is always a corner? - Intuitive Explanation</h3>
        We know that all solutions to our constraints will lie in the feasible region. <br />
        Since the objective function is linear ... it can be represented as a vector, which defines a direction in which its value increases. <br />
        We can move in this direction until we hit the last boundary of the feasible region ... <b>That will be our optimal solution</b> ... and if you think about it a little, <b>you will realize that it will always be a corner!!</b> <br />
        Below are some gifs displaying how different objective functions sweep a line perpendicular to them, to get the optimal solution. <br />
        Sometimes, the perpendicular line touches the feasible region at a vertex (<b>single optimal solution</b>), and sometimes it touches the feasible region at a line segment (<b>multiple optimal solutions</b>). <br />
        <em>Source: <a className="text-blue-600 hover:underline" href="https://www.youtube.com/watch?v=E72DWgKP_1Y">Art of linear programming by Tom S.</a></em>
        <div className="grid grid-cols-2 gap-4">
          <figure>
            <img src={_10x3y} className="mix-blend-multiply" />
            <figcaption className="text-center">Fig1.1: <InlineMath math="\mathbf{Z = 250x + 75y}" />, optimal solution is <InlineMath math="\mathbf{(10, 50)}" /> </figcaption>
          </figure>

          <figure>
            <img src={_3x3y} className="mix-blend-multiply" />
            <figcaption className="text-center">Fig1.2: <InlineMath math="\mathbf{Z = 3x + 3y}" />, optimal solutions are <InlineMath math="\mathbf{(0, 60), (10, 50)}" /> </figcaption>
          </figure>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <figure>
            <img src={_5x1y} className="mix-blend-multiply" />
            <figcaption className="text-center">Fig1.3: <InlineMath math="\mathbf{Z = 5x + y}" />, optimal solutions are <InlineMath math="\mathbf{(10, 50), (20, 0)}" /> </figcaption>
          </figure>

          <figure>
            <img src={_6x6y} className="mix-blend-multiply" />
            <figcaption className="text-center">Fig1.4: <InlineMath math="\mathbf{Z = 6x + 6y}" />, optimal solutions are <InlineMath math="\mathbf{(0, 60), (10, 50)}" /> </figcaption>
          </figure>
        </div>
      </div>
      <h3 id="the-simplex-method" className="text-l font-bold mt-4 mb-2">1.2. The Simplex Method - generalizing in n Dimensions</h3>
      <div>
        General form of a Linear Programming Problem with <InlineMath math="n" /> variables and <InlineMath math="m" /> constraints: <br />
        <BlockMath math="\mathbf{\max_{x \ge 0} Z = c_1x_1 + c_2x_2 + \dots + c_nx_n} \text{ subject to } \mathbf{Ax \le b, x \ge 0}" />
        <BlockMath math={`
                \\mathbf{A x \\le b} = \\begin{bmatrix} 
                                                  a_{11} & a_{12} & \\cdots & a_{1n} \\\\ 
                                                  a_{21} & a_{22} & \\cdots & a_{2n} \\\\ 
                                                  \\vdots & \\vdots & \\ddots & \\vdots \\\\ 
                                                  a_{m1} & a_{m2} & \\cdots & a_{mn}\\end{bmatrix}_{m \\times n}
                                                \\cdot
                                                \\begin{bmatrix} x_1 \\\\ x_2 \\\\ \\vdots \\\\ x_n \\end{bmatrix}_{n \\times 1} 
                                                \\le 
                                                \\begin{bmatrix} b_1 \\\\ b_2 \\\\ \\vdots \\\\ b_m \\end{bmatrix}_{m \\times 1}
                                                \\implies 
                                                \\left\\{\\begin{aligned}
                                                  a_{11}x_1 + a_{12}x_2 + \\cdots + a_{1n}x_n &\\le b_1 \\\\
                                                  a_{21}x_1 + a_{22}x_2 + \\cdots + a_{2n}x_n &\\le b_2 \\\\
                                                  \\vdots \\\\
                                                  a_{m1}x_1 + a_{m2}x_2 + \\cdots + a_{mn}x_n &\\le b_m
                                                \\end{aligned}\\right.
                `} />
      </div>

      <h4 id="understanding-it-geometrically" className="text-md font-bold mt-4 mb-2">1.2.1 Understanding it geometrically</h4>
      <div>

      </div>

      <h4 id="understanding-it-algorithmically" className="text-md font-bold mt-4 mb-2">1.2.2 Understanding it algorithmically</h4>
      <div>
        Let's try to understand this algorithm with an example (same as above)
        <BlockMath math="\mathbf{\max_{x \ge 0} Z = 250x_1 + 75x_2} \text{ subject to } \mathbf{5x_1 + x_2 \le 100, x_1 + x_2 \le 60, x_1, x_2 \ge 0}" />
        <b>Slack variable</b> <InlineMath math="(s_1, s_2)" /> &rarr; Variable which is introduced to an inequality to make it an equality.
        <BlockMath math="\left \{ \begin{aligned} 5x_1 + x_2 &\le 100 \\ x_1 + x_2 &\le 60 \\ x_1, x_2 &\ge 0 \end{aligned} \right. \implies \left \{ \begin{aligned} 5x_1 + x_2 + s_1 &= 100 \\ x_1 + x_2 + s_2 &= 60 \\ x_1, x_2, s_1, s_2 &\ge 0 \end{aligned} \right." />
        <ul className="list-disc list-outside mb-6">
          <li>
            Now suppose we start at the point <InlineMath math="\mathbf{(x_1, x_2) = (0, 0)}" />, we see that two inequalities are tight (<b>left side is equal to right side</b>) i.e. <InlineMath math="\mathbf{x_1 \ge 0}" /> and <InlineMath math="\mathbf{x_2 \ge 0}" />.
          </li>
          <li>
            Now, if we want to move to the point <InlineMath math="\mathbf{(x_1, x_2) = (20, 0)}" />, we would have to loosen one inequality (<b>which determines the direction we move in</b>) and tighten another (<b>which determines how far we should go</b>).
            Here, we loosen <InlineMath math="\mathbf{x_2 \ge 0}" /> and tighten <InlineMath math="\mathbf{5x_1 + x_2 \le 100}" />. <br />
            Now, in our case ... two inequalities being tight is equivalent to two variables being zero., we have 4 inequalities and selecting 2 from them
            <InlineMath math="\implies \left( \begin{aligned} 4 \\ 2 \end{aligned} \right) = 6" />
            <table className="w-full border border-black my-2 text-sm">
              <thead className="bg-gray-200">
                <tr><th>Sr No.</th><th className="border border-black px-4 py-2">Tight inequalities</th><th className="border border-black px-4 py-2">Correspoding zero variables</th><th className="border border-black px-4 py-2">Point that it denotes</th></tr>
              </thead>
              <tr>
                <td className="border border-black px-4 py-2">1</td>
                <td className="border border-black px-4 py-2"><InlineMath math="x_1 \ge 0 \,\,\,\,\,\, and \,\,\,\,\,\, x_2 \ge 0" /></td>
                <td className="border border-black px-4 py-2"><InlineMath math="\mathbf{x_1 = 0} \,\,\,\,\,\, and \,\,\,\,\,\, \mathbf{x_2 = 0}" /></td>
                <td className="border border-black px-4 py-2"><InlineMath math="\mathbf{(0, 0)}" /></td>
              </tr>
              <tr>
                <td className="border border-black px-4 py-2">2</td>
                <td className="border border-black px-4 py-2"><InlineMath math="x_1 \ge 0 \,\,\,\,\,\, and \,\,\,\,\,\, 5x_1 + x_2 \le 100" /></td>
                <td className="border border-black px-4 py-2"><InlineMath math="\mathbf{x_1 = 0} \,\,\,\,\,\, and \,\,\,\,\,\, \mathbf{s_1 = 0}" /></td>
                <td className="border border-black px-4 py-2"><InlineMath math="\mathbf{(0, 100)}" /></td>
              </tr>
              <tr>
                <td className="border border-black px-4 py-2">3</td>
                <td className="border border-black px-4 py-2"><InlineMath math="x_1 \ge 0 \,\,\,\,\,\, and \,\,\,\,\,\, x_1 + x_2 \le 60" /></td>
                <td className="border border-black px-4 py-2"><InlineMath math="\mathbf{x_1 = 0} \,\,\,\,\,\, and \,\,\,\,\,\, \mathbf{s_2 = 0}" /></td>
                <td className="border border-black px-4 py-2"><InlineMath math="\mathbf{(60, 0)}" /></td>
              </tr>
              <tr>
                <td className="border border-black px-4 py-2">4</td>
                <td className="border border-black px-4 py-2"><InlineMath math="x_2 \ge 0 \,\,\,\,\,\, and \,\,\,\,\,\, 5x_1 + x_2 \le 100" /></td>
                <td className="border border-black px-4 py-2"><InlineMath math="\mathbf{x_2 = 0} \,\,\,\,\,\, and \,\,\,\,\,\, \mathbf{s_1 = 0}" /></td>
                <td className="border border-black px-4 py-2"><InlineMath math="\mathbf{(20, 0)}" /></td>
              </tr>
              <tr>
                <td className="border border-black px-4 py-2">5</td>
                <td className="border border-black px-4 py-2"><InlineMath math="x_2 \ge 0 \,\,\,\,\,\, and \,\,\,\,\,\, x_1 + x_2 \le 60" /></td>
                <td className="border border-black px-4 py-2"><InlineMath math="\mathbf{x_2 = 0} \,\,\,\,\,\, and \,\,\,\,\,\, \mathbf{s_2 = 0}" /></td>
                <td className="border border-black px-4 py-2"><InlineMath math="\mathbf{(60, 0)}" /></td>
              </tr>
              <tr>
                <td className="border border-black px-4 py-2">6</td>
                <td className="border border-black px-4 py-2"><InlineMath math="x_1 + x_2 \le 60 \,\,\,\,\,\, and \,\,\,\,\,\, 5x_1 + x_2 \le 100" /></td>
                <td className="border border-black px-4 py-2"><InlineMath math="\mathbf{s_1 = 0} \,\,\,\,\,\, and \,\,\,\,\,\, \mathbf{s_2 = 0}" /></td>
                <td className="border border-black px-4 py-2"><InlineMath math="\mathbf{(10, 50)}" /></td>
              </tr>
            </table>
          </li>
          <li>
            In order to identify which variables to loosen and which to tighten, we look at the coefficients of the objective function.
          </li>
        </ul>
      </div>

      <h3 id="karmarkar-method" className="text-l font-bold mt-4 mb-2">1.3. Karmarkar's method</h3>
      <div>

      </div>

      <h2 id="halls-marriage-problem" className="text-xl font-bold mt-4 mb-2">2. Hall's marriage problem</h2>
      <div>

      </div>

      <h2 id="optimal-assignment-problem" className="text-xl font-bold mt-4 mb-2">3. Optimal assignment problem</h2>
      <div>

      </div>

      <h2 id="transportation-problem" className="text-xl font-bold mt-4 mb-2">4. Transportation problem</h2>
      <div>

      </div>

      <h2 id="two-person-zero-sum-games" className="text-xl font-bold mt-4 mb-2">5. Two-person zero-sum games</h2>
      <div>

      </div>

      <h3 id="minimax-theorem" className="text-l font-bold mt-4 mb-2">3.1 Minimax theorem</h3>
      <div>

      </div>

    </BlogLayout >
  );
}

export default LinearProgrammingGT;
