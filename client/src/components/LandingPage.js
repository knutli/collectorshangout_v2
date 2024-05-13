import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../firebase-config";
import TempHeader from "./TempHeader";

const LandingPage = ({ isUserLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [buttonState, setButtonState] = useState("default");

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const db = getFirestore(app);

  const handleSuccess = () => {
    setEmail("");
    setMessage("");
    setButtonState("default");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setMessage("Please input a valid email.");
      return;
    }
    setButtonState("loading");

    try {
      await addDoc(collection(db, "waitlist"), { email });
      setMessage("You're on the list!");
      setTimeout(() => {
        setButtonState("completed");
        setTimeout(handleSuccess, 120000); // Synchronize message with checkmark
      }, 150); // Duration of the loading animation
    } catch (error) {
      console.error("Error adding document: ", error);
      setMessage("Error registering for the waitlist. Please try again.");
      setButtonState("default");
    }
  };

  const getButtonClassName = () => {
    switch (buttonState) {
      case "loading":
        return "text-white bg-gray-800 font-bold py-2 px-6 rounded-md onclic";
      case "completed":
        return "text-white bg-gray-800 font-bold py-2 px-6 rounded-md validate";
      default:
        return "text-white bg-gray-800 hover:bg-gray-700 font-bold py-2 px-6 rounded-md";
    }
  };

  return (
    <div>
      <TempHeader isUserLoggedIn={isUserLoggedIn} />
      <div className="min-h-screen flex flex-col bg-black text-white relative bg-black text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat responsive-bg"
          style={{
            paddingTop: "56.25%",
            backgroundImage:
              "url('https://firebasestorage.googleapis.com/v0/b/collectors-hangout.appspot.com/o/Jersey%20Web%20App%20Background%20(1)..webp?alt=media&token=7fcf11f6-37c7-4151-ae42-05204e26683d')",
            opacity: 0.9, // Opacity of BG image
            backgroundPosition: "calc(50% + 180px) center",
          }}
        ></div>
        <div className="absolute inset-0 flex flex-col justify-center items-left max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-4rem]">
          <h1 className="text-5xl sm:text-5xl md:text-5xl lg:text-7xl font-bold mb-6">
            Collect.
            <br />
            Connect.
            <br />
            Complete.
          </h1>
          <p className="mb-5 text-base md:text-lg sm:text-md">
            Build your collection, one auction win at a time.
            <br />
            Welcome to the first ever community-powered marketplace 🦄
            <br />
            <br />
            <i>Coming 2024.</i>
          </p>
          <div id="waitlist" className="mt-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row justify-start gap-4"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className={getButtonClassName()}>
                {buttonState === "default" && "Join the waitlist!"}
                {buttonState === "completed" && (
                  <i className="fa fa-check"></i>
                )}{" "}
              </button>
            </form>
            {message && <p className="mt-4">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
