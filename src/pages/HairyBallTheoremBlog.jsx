import BlogLayout from "@/components/BlogLayout";
import HairyBallSimulator from "@/components/hairyBall/HairyBallSimulator";
import { InlineMath, BlockMath } from "react-katex";

export const frontmatter = {
  title: "The Hairy Ball Theorem",
  date: "2026-03-09",
  description:
    "You can't comb a hairy ball flat — every continuous tangent vector field on a sphere must have at least one zero.",
  slug: "hairy-ball-theorem",
};

export default function HairyBallTheoremBlog() {
  return (
    <BlogLayout title={frontmatter.title} date="Mar 9, 2026">
      <div className="flex flex-col gap-6 text-[15px] leading-relaxed mb-10 w-[95%] mx-auto text-gray-800">

        <div>
          <a className="text-blue-600 hover:underline cursor-pointer" href="http://localhost:5173/blog/#/hairy-ball-theorem">... 3B1B video on this topic</a>
        </div>
        <p>
          Imagine you have a perfectly furry tennis ball — every point on the surface has a tiny hair
          sticking out of it. Now try to comb all the hairs flat against the surface so they all lie
          tangent to the ball and vary smoothly from point to point.
          The <strong>Hairy Ball Theorem</strong> says: <em>you can't do it</em>. There will always be
          at least one spot where some hair sticks straight up — or equivalently where the hair
          vanishes entirely. There must be at least one <strong>bald spot</strong>.
        </p>

        <h2 id="formal-statement" className="text-xl font-bold mt-4 text-gray-900">Formal Statement</h2>

        <p>
          More precisely, the theorem states that there is no nonvanishing continuous tangent vector
          field on even-dimensional <InlineMath math="n" />-spheres. For the ordinary sphere{" "}
          <InlineMath math="S^2" />, every continuous map
        </p>

        <BlockMath math="v : S^2 \to \mathbb{R}^3 \quad\text{with}\quad v(p) \cdot p = 0 \;\;\forall\, p \in S^2" />

        <p>
          must satisfy <InlineMath math="v(p) = 0" /> for at least one{" "}
          <InlineMath math="p" />. The condition{" "}
          <InlineMath math="v(p) \cdot p = 0" /> ensures that every vector is tangent to the sphere.
        </p>

        <h2 id="why-does-it-happen" className="text-xl font-bold mt-4 text-gray-900">Why Does It Happen?</h2>

        <p>
          The deep reason is <strong>topological</strong>. The Euler characteristic of{" "}
          <InlineMath math="S^2" /> is <InlineMath math="\chi(S^2) = 2" />, which is nonzero.
          By the <strong>Poincaré–Hopf theorem</strong>, the sum of the indices of the zeros of
          any continuous tangent vector field must equal the Euler characteristic. Since{" "}
          <InlineMath math="\chi \neq 0" />, at least one zero must exist.
        </p>

        <p>
          In contrast, the torus (<InlineMath math="\chi = 0" />) <em>can</em> be combed flat — you can
          draw continuous tangent vectors everywhere on a doughnut with no bald spots.
        </p>

        <h3 id="real-world-consequences" className="text-xl font-bold mt-4 text-gray-900">Real-World Consequences</h3>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Meteorology :</strong> The Earth is (approximately) a sphere. Wind is a tangent
            vector field. So at any instant, there must be at least one point on Earth where the
            wind speed is exactly zero — the eye of a cyclone!
          </li>
          <li>
            <strong>Antenna design :</strong> An omnidirectional antenna that radiates equally in
            every direction on a sphere is impossible; there must be a null direction.
          </li>
          <li>
            <strong>Robotics :</strong> Smoothly assigning orientations to a robot's end-effector
            over a spherical workspace inevitably encounters a singularity.
          </li>
        </ul>

        <h2 id="interactive-simulation" className="text-xl font-bold mt-4 text-gray-900">Interactive Simulation</h2>

        <p>
          The simulator below covers a sphere in 2 000 tiny hairs.
          <strong>Drag on the sphere</strong> to comb the hair in any direction you like —
          you'll see it flatten as you stroke. <strong>Drag outside the sphere</strong> to rotate
          and inspect every angle. Can you comb it perfectly flat everywhere?
          The theorem guarantees you can't — there will always be at least one stubborn bald spot!
        </p>

        <div className="my-8">
          <HairyBallSimulator />
        </div>

        <h3 id="understanding-the-fields" className="text-xl font-bold mt-4 text-gray-900">Understanding the Fields</h3>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Dipole:</strong> Rotation around the vertical axis. Two zeros at the north and
            south poles — like combing meridians of a globe eastward.
          </li>
          <li>
            <strong>Spiral:</strong> Vectors spiral from one pole toward the other, creating two
            pole zeros with a twist.
          </li>
          <li>
            <strong>Source/Sink:</strong> Vectors flow away from the north pole (source) and into
            the south pole (sink). Both poles are zeros with index{" "}
            <InlineMath math="+1" />, summing to <InlineMath math="\chi = 2" />.
          </li>
          <li>
            <strong>Cyclone:</strong> A blend of rotation and source/sink flow, giving a spiral
            cyclone pattern — reminiscent of weather systems.
          </li>
        </ul>

        <h2 id="the-poincare-hopf-theorem" className="text-xl font-bold mt-4 text-gray-900">The Poincaré-Hopf Theorem</h2>

        <p>
          The Hairy Ball Theorem is actually a corollary of a much more general result. If{" "}
          <InlineMath math="M" /> is a compact manifold without boundary and{" "}
          <InlineMath math="v" /> is a continuous vector field on <InlineMath math="M" /> with
          finitely many zeros, then:
        </p>

        <BlockMath math="\sum_{p : v(p)=0} \operatorname{ind}_p(v) \;=\; \chi(M)" />

        <p>
          For <InlineMath math="S^2" />, the right-hand side is <InlineMath math="2" />,
          so the zeros of any field must have total index 2. A simple zero (like a source
          or sink) has index <InlineMath math="+1" />, so the minimum number of zeros is two.
          A "dipole" zero has index <InlineMath math="+2" />, requiring just one zero — but such
          points look wilder. Either way, <strong>you cannot escape the bald spot</strong>.
        </p>

      </div>
    </BlogLayout>
  );
}
