import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./Components/Auth";
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
