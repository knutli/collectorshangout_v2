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
        console.log("No user data returned"); // Log if no data returned
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
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
        }
      );

      if (loginResponse.ok) {
        const userResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/current_user`
        );
        const userData = await userResponse.json();
        setUser(userData.user);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  const signOut = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/logout`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        setUser(null);
        localStorage.removeItem("token");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
