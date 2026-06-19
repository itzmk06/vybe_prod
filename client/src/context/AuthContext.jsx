import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Check authentication status when app loads
    useEffect(() => {

        const checkAuth = async () => {

            try {

                const res = await api.get("/user");

                console.log("Auth check success:", res.data);

                const userData =
                    res.data.user ||
                    res.data.data ||
                    res.data;

                setUser(userData);

            } catch (error) {

                console.log(
                    "Auth check failed:",
                    error.response?.status,
                    error.message
                );

                setUser(null);

                // Don't navigate here
                // Interceptor/Auth flow handles session expiration

            } finally {

                setLoading(false);

            }
        };

        checkAuth();

    }, []);




    const login = async (email, password) => {

        try {

            const res = await api.post("/login", {
                emailId: email,
                password,
            });

            console.log("Login response:", res.data);

            const userData =
                res.data.user ||
                res.data.data ||
                res.data;

            setUser(userData);

            navigate("/home");

        } catch (error) {

            console.error("Login failed:", error);

            throw new Error(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        }
    };




    const signup = async (userData) => {

        try {

            const res = await api.post(
                "/signup",
                userData
            );

            console.log("Signup response:", res.data);

            const newUser =
                res.data.user ||
                res.data.data ||
                res.data;

            setUser(newUser);

            navigate("/home");

        } catch (error) {

            console.error("Signup failed:", error);

            throw new Error(
                error.response?.data?.message ||
                "Signup failed. Please try again."
            );
        }
    };




    const logout = async () => {

        try {

            await api.post("/logout");

        } catch (error) {

            console.error("Logout failed:", error);

        } finally {

            setUser(null);

            navigate("/");

        }
    };




    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};