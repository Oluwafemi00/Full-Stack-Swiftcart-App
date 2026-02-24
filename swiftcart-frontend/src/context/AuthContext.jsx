// src/context/AuthContext.jsx
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // For your portfolio demo, we will create a mock user.
  // You can change this role to 'seller' or 'rider' to test the different views!
  const [user, setUser] = useState({
    id: 1,
    name: "Test Buyer",
    role: "buyer", // roles: 'buyer', 'seller', 'rider'
  });

  // A helper function so you can easily switch accounts from the UI during your demo
  const switchRole = (newRole) => {
    const names = {
      buyer: "Test Buyer",
      seller: "Test Seller",
      rider: "Abdulrahman Sanni",
    };
    setUser({ id: 1, name: names[newRole], role: newRole });
  };

  return (
    <AuthContext.Provider value={{ user, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
