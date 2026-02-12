import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TaxBlog from "./pages/TaxBlog";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/taxviz" element={<TaxBlog />} />
    </Routes>
  );
}

export default App;
