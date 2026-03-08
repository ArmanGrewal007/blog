import BlogLayout from "@/components/BlogLayout";
import BoardingSimulator from "@/components/aeroplaneBoarding/BoardingSimulator";

export const frontmatter = {
  title: "Aeroplane Boarding Methods",
  date: "2024-12-14",
  description: "Exploring different aeroplane boarding methods and their efficiencies.",
  slug: "aeroplane-boarding-methods",
};

export default function AeroplaneBoardingMethodsBlog() {
  return (
    <BlogLayout title={frontmatter.title} date="Dec 14, 2024">
      <div className="flex flex-col gap-6 text-[15px] leading-relaxed mb-10 w-[95%] mx-auto text-gray-800">
        <div>
          Boarding an airplane is a complex process often constrained by human behavior, physical space (the aisle), and luggage stowage. Which boarding method is actually the fastest?
          <h3 className="text-xl font-bold mt-4 text-gray-900">Standard Boarding Methods</h3>
          Various airlines have attempted different boarding methods over the years:

          <ul className="list-disc pl-6">
            <li><strong>Back-to-Front:</strong> The traditional approach where passengers seated in the rear board first. Surprisingly, this often turns out to be one of the slowest methods due to aisle congestion.</li>
            <li><strong>Outside-In (WilMA):</strong> Window area first, then middle seats, and finally aisle seats. This is highly efficient theoretically.</li>
            <li><strong>Random Boarding:</strong> With no assigned groups, passengers board randomly. Studies have shown this can actually be faster than back-to-front!</li>
            <li><strong>Steffen Method:</strong> A mathematically optimized method by Jason Steffen that boards passengers in a specific order (e.g., alternating rows, window to aisle) to completely eliminate aisle interference.</li>
          </ul>

          <BoardingSimulator />

        </div>
      </div>
    </BlogLayout>
  );
}
