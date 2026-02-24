// src/context/AuthContext.jsx
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 1. We now default the app to a 'guest' state!
  const [user, setUser] = useState({
    id: null,
    name: "Guest User",
    role: "guest", // roles: 'guest', 'buyer', 'seller', 'rider'
  });

  const switchRole = (newRole) => {
    const names = {
      guest: "Guest User",
      buyer: "Logged-in Buyer",
      seller: "Test Seller",
      rider: "Test Rider",
    };
    // Assign a fake ID if they are logged in, or null if they are a guest
    setUser({
      id: newRole === "guest" ? null : 1,
      name: names[newRole],
      role: newRole,
    });
  };

  return (
    <AuthContext.Provider value={{ user, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
