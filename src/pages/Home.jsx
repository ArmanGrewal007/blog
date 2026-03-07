import { motion } from "framer-motion";
import BlogCard from "@/components/BlogCard";

function Home({ posts = [] }) {
  // Sort posts dynamically by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <motion.div
      className="min-h-screen max-w-7xl mx-auto px-6 py-16"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="text-3xl sm:text-5xl font-bold mb-12 text-center">
        Blogs ...
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedPosts.map((post) => (
          <BlogCard
            key={post.slug}
            title={post.title}
            description={post.description}
            date={post.date}
            to={`/${post.slug}`}
            image={post.image || ""}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default Home;
