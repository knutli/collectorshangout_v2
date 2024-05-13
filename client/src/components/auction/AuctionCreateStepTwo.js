import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import TempHeader from "../TempHeader";

const AuctionCreateStepTwo = ({ onBack, onCancel, previousData }) => {
  const { user } = useContext(AuthContext);
  const [additionalData, setAdditionalData] = useState({
    startingPrice: "",
    bidIncrement: "",
    startTime: "",
    endTime: "",
    // Add other fields as necessary
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setAdditionalData({ ...additionalData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert endTime to a Firestore Timestamp
      const endTime = new Date(additionalData.endTime).toISOString();
      // Create the full auction data object including the converted endTime
      const fullAuctionData = {
        ...previousData,
        ...additionalData,
        endTime: endTime,
      };

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auctions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fullAuctionData),
          credentials: "include", // Ensure cookies are included with the request
        }
      );

      const responseData = await response.json();
      if (response.status === 201) {
        navigate(`/auction/${responseData.id}`);
      } else if (response.status === 401) {
        // Redirect to login or show an error message
      } else {
        console.error("Error submitting auction:", responseData);
      }
    } catch (error) {
      console.error("Error submitting auction:", error);
    }
  };

  return (
    <div>
      <TempHeader isBlackText={true} />
      <div className="auction-create-container">
        <h2 className="auction-create-title">Opprett auksjon</h2>
        {/* <div className="auction-create-title-divider"></div> */}
        <form onSubmit={handleSubmit} className="auction-form">
          {/* Additional fields for auction */}
          <div className="form-group">
            <label htmlFor="startingPrice" className="form-label">
              Åpningspris
            </label>
            <input
              type="number"
              name="startingPrice"
              placeholder=" f.eks. 1200"
              value={additionalData.startingPrice}
              onChange={handleChange}
              className="form-input"
              required
            />
            <span className="input-form-helper-text">
              Legg inn prisen du ønsker auksjonen skal åpnes med. Sett en
              realistisk pris, og undersøk gjerne hva tilsvarende trøyer blir
              solgt for.
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="bidIncrement" className="form-label">
              Minimum budøkning
            </label>
            <input
              type="number"
              name="bidIncrement"
              value={additionalData.bidIncrement}
              onChange={handleChange}
              className="form-input"
              required
            />
            <span className="input-form-helper-text">
              Hva er minste budøkning du tillater? Vi anbefaler NOK 50 - 100.
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="startTime" className="form-label">
              Når starter auksjonen?
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={additionalData.startTime}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endTime" className="form-label">
              Når avsluttes auksjonen?
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={additionalData.endTime}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          {/* Add other fields as necessary */}
          <div className="form-footer">
            <span className="step-indicator">
              <strong>2/2</strong>
            </span>
            <button type="button" onClick={onBack} className="btn-secondary">
              Tilbake
            </button>
            <button onClick={onCancel} className="cancel-button">
              Avbryt
            </button>

            <button type="submit" className="btn-primary">
              Opprett auksjon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuctionCreateStepTwo;
