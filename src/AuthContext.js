import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/current_user`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // If the response is not OK, assume no user is logged in
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking user session:", error);
        setUser(null);
      }
    };

    checkUserSession();
  }, []);

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
        `${process.env.REACT_APP_BACKEND_URL}/logout`
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
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
