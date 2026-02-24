// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";

// We will build these pages in the upcoming steps

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import SellerDashboard from "./pages/SellerDashboard";
import RiderPortal from "./pages/RiderPortal";

export default function App() {
  // 1. Create the search state
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <CartProvider>
      <Router>
        {/* 2. Pass the setter to the Navbar so typing updates the state */}
        <Navbar setSearchQuery={setSearchQuery} />
        <CartDrawer />
        {/* <Navbar /> */}
        <Routes>
          {/* 3. Pass the query to the Home page so it can filter products */}
          <Route path="/" element={<Home searchQuery={searchQuery} />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/rider" element={<RiderPortal />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
