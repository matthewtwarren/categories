import { HashRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Create } from "./pages/Create";
import { Play } from "./pages/Play";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
