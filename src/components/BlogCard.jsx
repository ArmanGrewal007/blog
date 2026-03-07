import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function BlogCard({ title, description, to, image }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
      className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md bg-white"
    >
      <Link to={to} className="block">
        {/* Image */}
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
          />
        )}

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            {title}
          </h2>
          <p className="text-gray-600 text-sm">
            {description}
          </p>
          <div className="mt-4 text-blue-600 text-sm font-medium">
            Read more →
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default BlogCard;
