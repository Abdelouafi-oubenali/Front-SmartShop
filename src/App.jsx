import { BrowserRouter, Routes, Route } from "react-router-dom";
import Users from "./pages/Users";
import Dashboard from "./pages/admin/Dashboard";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/users" element={<Users />} />
          <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App
