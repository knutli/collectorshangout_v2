/* import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Refactored function to fetch current user
  const fetchCurrentUser = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/current_user`)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(setCurrentUser) // Assuming the API returns the user directly
      .catch((error) => {
        console.error("Auth.js... Error fetching current user:", error);
        setCurrentUser(null);
      });
  };

  // Call the fetchCurrentUser function on component mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const signIn = () => {
    // Redirect to Google OAuth login
    window.location.href = "/api/users/auth/google";
  };

  const signOut = () => {
    // Sign out from the backend session
    fetch("/api/logout", { method: "POST" })
      .then(() => setCurrentUser(null))
      .catch((error) => console.error("Error logging out:", error));
  };

  const value = {
    currentUser,
    fetchCurrentUser,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
 */
