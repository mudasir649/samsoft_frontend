import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import Page from "./components/Page";
import EditServices from "./components/EditServices";
import EditPackage from "./components/EditPackage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Main/>} />
          <Route path="/package" element={<Page/>} />
          <Route path="/editservice/:id" element={<EditServices/>} />
          <Route path="/editpackage/:id" element={<EditPackage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
