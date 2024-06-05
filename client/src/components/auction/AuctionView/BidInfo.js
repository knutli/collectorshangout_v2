import React, { useState, useContext } from "react";
import { AuthContext } from "../../../AuthContext";
import "../../../styles/bidButton.css";
import { Button, Input } from "@nextui-org/react";
import BidIcon from "../../../increasearrow.png";

const BidInfo = ({
  auctionId,
  socket,
  minimumBid,
  bidIncrement,
  currentHighestBid,
  endTime,
  startingPrice,
  auctionCreatorId,
}) => {
  const { user } = useContext(AuthContext);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const isAuctionEnded = new Date() > new Date(endTime);

  const isUserLoggedIn = !!user;

  const validateBid = (amount) => {
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid bid amount.");
      return false;
    }
    if (amount < startingPrice) {
      setError(`Budet må være høyere enn startprisen på NOK ${startingPrice}.`);
      return false;
    }
    if (amount < minimumBid) {
      setError(`Bid must be at least ${minimumBid}.`);
      return false;
    }
    if (amount < currentHighestBid + bidIncrement) {
      setError(
        `Bid must be at least ${
          currentHighestBid + bidIncrement
        } (current highest bid plus minimum increment).`
      );
      return false;
    }

    /* if (auctionCreatorId === user.uid) {
      setError("Du har ikke lov til å by på din egen auksjon.");
      return false;
    }*/

    setError("");
    return true;
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);

    if (!validateBid(amount)) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auctions/${auctionId}/bid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bidAmount: amount }),
          credentials: "include", // Ensure cookies are included with the request
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "En feil har oppstått. Prøv igjen.");
      }

      setSuccessMessage("Takk for ditt bud!");
      setBidAmount(""); // Reset bid amount after successful submission
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (error) {
      console.error("Feil:", error);
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  // Login to bid
  const handleLoginClick = () => {
    localStorage.setItem("preLoginUrl", window.location.pathname);
    window.location.href = "/login"; // Redirect to the login page
  };

  return (
    <div className="bid-info-container">
      <form onSubmit={handleBidSubmit} className="bid-info-form">
        <div className="bid-input-field">
          <Input
            size="md"
            variant="bordered"
            type="number"
            description={!isUserLoggedIn ? "" : "Husk! Budet ditt er bindende."}
            startContent="kr"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            label="Bud"
            disabled={!isUserLoggedIn} // Disable input if user is not logged in
          />
        </div>

        <div className="bid-button">
          <Button
            color={!isUserLoggedIn || isAuctionEnded ? "default" : "success"}
            size="md"
            variant="shadow"
            type="submit"
            startContent={
              <img
                src={BidIcon}
                alt="Bid"
                style={{ width: "20px", height: "20px" }}
              />
            }
            onClick={handleBidSubmit}
            disabled={!isUserLoggedIn || isAuctionEnded} // Disable button if user is not logged in or auction ended
          >
            Legg inn bud
          </Button>
        </div>

        {!isUserLoggedIn && (
          <p className="login-to-bid-notification">
            Du må{" "}
            <a href="/login" onClick={handleLoginClick}>
              <u>logge inn eller registrere deg</u>
            </a>{" "}
            for å by på auksjoner.
          </p>
        )}
      </form>
      <div className="bid-success-error-message mt-4">
        {error && <p style={{ color: "red", fontSize: "small" }}>{error}</p>}
        {successMessage && (
          <p style={{ color: "green", fontSize: "small" }}>{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default BidInfo;
