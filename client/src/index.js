import "./firebase-config";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Mock process for the browser environment to avoid "process is not defined error in browser"
if (typeof process === "undefined") {
  window.process = {
    env: {
      NODE_ENV: "development", // or 'production'
      // Add other environment variables here as needed
    },
  };
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
