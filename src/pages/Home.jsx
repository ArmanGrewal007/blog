import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BlogCard from "@/components/BlogCard";
import SearchBar from "@/components/SearchBar";

function Home({ posts = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedQuery(searchQuery.toLowerCase()); }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Sort posts dynamically by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredPosts = sortedPosts.filter(post => {
    if (!debouncedQuery) return true;
    const inTitle = post.title?.toLowerCase().includes(debouncedQuery);
    const inDesc = post.description?.toLowerCase().includes(debouncedQuery);
    const inContent = post.rawText && post.rawText.includes(debouncedQuery);
    return inTitle || inDesc || inContent;
  });

  return (
    <motion.div
      className="min-h-screen max-w-7xl mx-auto px-6 py-16"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="text-3xl sm:text-5xl font-bold mb-8 text-center">
        Blogs ...
      </h1>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPosts.map((post) => (
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
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No matching blogs found for "{searchQuery}".</p>
        </div>
      )}
    </motion.div>
  );
}

export default Home;
