// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: null,
    name: "Guest User",
    role: "guest",
  });

  // 1. Check for token on initial load
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Ask the backend who this token belongs to
          const response = await fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }, // Send the token!
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData); // Automatically log them back in!
          } else {
            // If the token is expired or invalid, destroy it
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Failed to verify session", error);
        }
      }
    };

    verifyUser();
  }, []); // Empty array means this runs exactly once when the app opens

  // 1. A real function to register users via your Express API
  const registerAccount = async (userData) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the secure token to the browser so they stay logged in
        localStorage.setItem("token", data.token);
        // Update the React state with the real database user!
        setUser(data.user);
        return { success: true };
      } else {
        // If the email is taken, or something else fails
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Network error:", error);
      return { success: false, error: "Failed to connect to the server." };
    }
  };

  // 2. A function to log in existing users
  const loginAccount = async (credentials) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Save the secure token
        setUser(data.user); // Update React state
        return { success: true, role: data.user.role }; // We return the role so the Login page knows where to redirect!
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Network error:", error);
      return { success: false, error: "Failed to connect to the server." };
    }
  };

  // 3. A function to log out securely
  const logout = () => {
    localStorage.removeItem("token"); // Destroy the secure token
    setUser({ id: null, name: "Guest User", role: "guest" }); // Reset to guest state
  };

  return (
    <AuthContext.Provider
      value={{ user, registerAccount, loginAccount, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 👈 ADD THIS COMMENT RIGHT HERE!
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
