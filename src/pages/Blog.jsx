import { Link } from "react-router-dom";

function Blog() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl sm:text-4xl font-bold mb-5">
        Blog
      </h1>

      <Link
        to="/taxviz"
        className="text-blue-600 underline text-lg"
      >
        Open Tax Visualizer
      </Link>
    </div>
  );
}

export default Blog;
