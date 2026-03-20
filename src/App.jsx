import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

// Automatically grab all *Blog.jsx files inside the pages directory
const postFiles = import.meta.glob('./pages/*Blog.jsx', { eager: true });
const postRawFiles = import.meta.glob('./pages/*Blog.jsx', { query: '?raw', import: 'default', eager: true });

const posts = Object.keys(postFiles).map(path => {
  const file = postFiles[path];
  const rawContent = postRawFiles[path] || "";
  
  // Extract pure text by stripping out imports, exports, and JSX tags
  const plainText = rawContent
    .replace(/import.*?['"];?/gs, '') // remove imports
    .replace(/export default.*?;/gs, '') // remove exports
    .replace(/<[^>]+>/g, ' ') // remove JSX tags
    .replace(/\s+/g, ' ') // collapse whitespace
    .toLowerCase();

  return {
    Component: file.default,
    rawText: plainText,
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
