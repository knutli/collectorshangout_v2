import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuctionCreateStepOne from "./AuctionCreateStepOne";
import AuctionCreateStepTwo from "./AuctionCreateStepTwo";

const AuctionCreate = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [auctionData, setAuctionData] = useState({});

  const handleNext = (data) => {
    setAuctionData(data);
    setStep(2); // Move to step two
  };

  const handleBack = () => {
    setStep(1); // Move back to step one
  };

  const handleAuctionSubmit = async (fullData) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auctions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fullData),
          credentials: "include", // Ensure cookies are included with the request
        }
      );
      const responseData = await response.json();

      if (response.ok) {
        navigate(`/auction/${responseData.id}`);
      } else {
        console.error("Error submitting auction:", responseData.message);
      }
    } catch (error) {
      console.error("Error submitting auction:", error);
    }
  };

  const handleCancel = () => {
    navigate("/"); // Navigate back to the front page
  };

  return (
    <div>
      {step === 1 && (
        <AuctionCreateStepOne
          onNext={handleNext}
          onCancel={handleCancel}
          previousData={auctionData}
        />
      )}
      {step === 2 && (
        <AuctionCreateStepTwo
          onAuctionSubmit={handleAuctionSubmit}
          onBack={handleBack}
          onCancel={handleCancel}
          previousData={auctionData}
        />
      )}
    </div>
  );
};

export default AuctionCreate;
