import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Users from "./pages/Users";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products"; 
import PromoCode from "./pages/admin/PromoCode";

import Orders from "./pages/admin/orders"; 
import CompletePayment from "./pages/admin/CompletePayment";

 
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/promo" element={<PromoCode />} />
        <Route path="/payments" element={<CompletePayment />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App
