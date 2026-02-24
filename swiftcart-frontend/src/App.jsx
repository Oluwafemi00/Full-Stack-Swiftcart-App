// src/App.jsx
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import Auth

import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import SellerDashboard from "./pages/SellerDashboard";
import RiderPortal from "./pages/RiderPortal";

// 1. Create a Route Guard Component
// This checks if the user's role matches the allowed role for the page
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  if (user.role !== allowedRole) {
    // If a buyer tries to go to the seller page, kick them back to the home page!
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AuthProvider>
      {" "}
      {/* 2. Wrap the whole app in AuthProvider */}
      <CartProvider>
        <Router>
          <Navbar setSearchQuery={setSearchQuery} />
          <CartDrawer />

          <Routes>
            {/* BUYER ROUTES */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <Home searchQuery={searchQuery} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />

            {/* SELLER ROUTES */}
            <Route
              path="/seller"
              element={
                <ProtectedRoute allowedRole="seller">
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />

            {/* RIDER ROUTES */}
            <Route
              path="/rider"
              element={
                <ProtectedRoute allowedRole="rider">
                  <RiderPortal />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
