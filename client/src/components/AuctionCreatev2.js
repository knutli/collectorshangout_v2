import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase-config.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AuctionCreateStepOne from "./AuctionCreateStepOne.js";
import AuctionCreateStepTwo from "./AuctionCreateStepTwo.js";

const AuctionCreate = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [auctionData, setAuctionData] = useState({});
  const [imageFiles, setImageFiles] = useState([]);

  const handleNextFromStepOne = async (data) => {
    // Assuming data includes imageFiles
    setImageFiles(data.imageFiles);
    setAuctionData({ ...auctionData, ...data });
    setStep(2);
  };

  const handleNextFromStepTwo = async (data) => {
    const imageUrls = await uploadImages();
    const fullAuctionData = { ...auctionData, ...data, imageUrls };
    await handleAuctionSubmit(fullAuctionData);
  };

  const uploadImages = async () => {
    const urls = await Promise.all(
      imageFiles.map(async (file) => {
        const imageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(imageRef, file);
        return await getDownloadURL(imageRef);
      })
    );
    return urls;
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
          onNext={handleNextFromStepOne}
          onCancel={handleCancel}
          previousData={auctionData}
        />
      )}
      {step === 2 && (
        <AuctionCreateStepTwo
          onNext={handleNextFromStepTwo}
          onBack={handleBack}
          onCancel={handleCancel}
          previousData={auctionData}
        />
      )}
    </div>
  );
};

export default AuctionCreate;
