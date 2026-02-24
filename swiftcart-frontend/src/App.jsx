// src/App.jsx
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import SellerDashboard from "./pages/SellerDashboard";
import RiderPortal from "./pages/RiderPortal";
import RegisterSeller from "./pages/RegisterSeller";
import RegisterRider from "./pages/RegisterRider";
import RegisterBuyer from "./pages/RegisterBuyer";
import Login from "./pages/Login";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* Navbar and Drawer sit OUTSIDE the Routes so they show on every page */}
          <Navbar setSearchQuery={setSearchQuery} />
          <CartDrawer />

          {/* All Route components MUST be wrapped inside Routes */}
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={["guest", "buyer"]}>
                  <Home searchQuery={searchQuery} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={["guest", "buyer"]}>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/order-success"
              element={
                <ProtectedRoute allowedRoles={["guest", "buyer"]}>
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />

            {/* REGISTRATION ROUTES */}
            <Route
              path="/register-seller"
              element={
                <ProtectedRoute allowedRoles={["guest", "buyer"]}>
                  <RegisterSeller />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register-rider"
              element={
                <ProtectedRoute allowedRoles={["guest", "buyer"]}>
                  <RegisterRider />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register-buyer"
              element={
                <ProtectedRoute allowedRoles={["guest", "buyer"]}>
                  <RegisterBuyer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/seller"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/rider"
              element={
                <ProtectedRoute allowedRoles={["rider"]}>
                  <RiderPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedRoute allowedRoles={["guest"]}>
                  <Login />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
