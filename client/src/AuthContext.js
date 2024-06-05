import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/current_user`,
        { credentials: "include" }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (userData) => {
    try {
      const loginResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
          credentials: "include",
        }
      );

      if (loginResponse.ok) {
        fetchCurrentUser();
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {}
  };

  const register = async (userData) => {
    try {
      const registerResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
          credentials: "include",
        }
      );

      if (registerResponse.ok) {
        fetchCurrentUser();
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const signOut = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/logout`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        setUser(null);
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, setUser, signIn, register, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
