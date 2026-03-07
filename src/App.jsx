import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import TaxBlog from "@/pages/1TaxBlog";
import WaveArrayBlog from "@/pages/2WaveArrayBlog";
import RankSelectionBlog from "@/pages/3RankSelectionBlog";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/taxviz" element={<TaxBlog />} />
      <Route path="/waveArray" element={<WaveArrayBlog />} />
      <Route path="/rankSelection" element={<RankSelectionBlog />} />
    </Routes>
  );
}

export default App;
