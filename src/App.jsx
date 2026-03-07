import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

// Automatically grab all *Blog.jsx files inside the pages directory
const postFiles = import.meta.glob('./pages/*Blog.jsx', { eager: true });

const posts = Object.values(postFiles).map(file => {
  return {
    Component: file.default,
    ...(file.frontmatter || {})
  };
});

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home posts={posts} />} />
      {posts.map(post => (
        <Route key={post.slug} path={`/${post.slug}`} element={<post.Component />} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
