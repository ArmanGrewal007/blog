import { Routes, Route } from "react-router-dom";
import Blog from "./pages/Blog";
import TaxViz from "./pages/TaxViz";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Blog />} />
      <Route path="/taxviz" element={<TaxViz />} />
    </Routes>
  );
}

export default App;
