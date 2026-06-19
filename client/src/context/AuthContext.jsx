import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check auth on mount - no manual cookie check!
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/user", { withCredentials: true });
        console.log("Auth check success:", res.data);
        setUser(res.data.user || res.data.data);
      } catch (error) {
        console.log(
          "Auth check failed:",
          error.response?.status,
          error.message,
        );
        setUser(null);
        // ❌ NO navigate here!
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post(
        "/login",
        { emailId: email, password },
        { withCredentials: true },
      );
      console.log("Login Response:", res.data);

      // Adjust based on your backend response structure!
      const userData = res.data.user || res.data.data || res.data;
      setUser(userData);

      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error(
        error.response?.data?.message || "Login failed. Try again!",
      );
    }
  };

  const signup = async (userData) => {
    try {
      const res = await api.post("/signup", userData, {
        withCredentials: true,
      });
      console.log("Signup Response:", res.data);

      const newUser = res.data.user || res.data.data || res.data;
      setUser(newUser);
      navigate("/home");
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error(
        error.response?.data?.message || "Signup failed. Try again!",
      );
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
