import React from "react";
import "../styles/header.css";
import { Button } from "@nextui-org/react";

function Login() {
  const handleLogin = () => {
    // Redirect to the server's authentication route
    // window.location.href = `https://collectors-hangout.ew.r.appspot.com/login/federated/google`;
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/login/federated/google`;
    // window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
  };

  const googleLoginButtonUrl =
    "https://firebasestorage.googleapis.com/v0/b/collectors-hangout.appspot.com/o/web_dark_rd_ctn%404x.png?alt=media&token=f5c9a642-1412-43df-8277-1cb2a9eead31";

  return (
    <div className="login-container">
      <h2 className="login-header">Registrer eller logg in</h2>
      <div className="login-screen-google-button">
        <img
          src={googleLoginButtonUrl}
          alt="Continue with Google"
          onClick={handleLogin}
          style={{ cursor: "pointer" }}
        />
        {/* Other UI elements */}
      </div>
    </div>
  );
}

export default Login;
