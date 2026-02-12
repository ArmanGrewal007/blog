import { motion } from "framer-motion";
import BlogCard from "@/components/BlogCard";

function Home() {
  return (
    <motion.div
      className="min-h-screen max-w-5xl mx-auto px-6 py-16"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut"  }}
    >
      <h1 className="text-3xl sm:text-5xl font-bold mb-12 text-center">
        Blogs ...
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <BlogCard
          title="Old vs New Tax Regime Comparison - FY25-26"
          description="Interactive graph to tell you which Regime to choose ..."
          to="/taxviz"
        />
        {/* <BlogCard
          title="Add more ..."
          description=""
          to="/"
        /> */}
      </div>
    </motion.div>
  );
}

export default Home;
