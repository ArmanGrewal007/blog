import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const getFormattedDate = () => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date().toLocaleDateString("en-IN", options);
};

function BlogLayout({ title, children }) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Main Content Animation */}
      <motion.div
        className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >

        {/* Top Navigation */}
        <div className="mb-6">
          <Link to="/" className="text-sm text-gray-600 hover:underline">
            ← Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-2">
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            {title}
          </h1>

          <span className="text-sm text-gray-600">{getFormattedDate()}</span>
        </div>

        {/* Divider */}
        <hr className="mb-8 border-gray-800" />

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none text-gray-800">
          {children}
        </div>

      </motion.div>

      {/* Footer Animation (separate + delayed) */}
      <motion.footer
        className="border-t border-gray-200 py-6 bg-slate-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-6 text-sm text-gray-600 flex justify-between">
          <span>© {new Date().getFullYear()} Arman Singh Grewal</span>
          <Link to="/" className="hover:underline">Home</Link>
        </div>
      </motion.footer>

    </div>
  );
}

export default BlogLayout;
