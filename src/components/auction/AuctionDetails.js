import React from "react";

const AuctionDetails = ({ details }) => {
  return (
    <div className="auction-details">
      {/* Description with more emphasis */}
      <p className="auction-details__description">{details.description}</p>
      {/* Starting price and bid increment can be smaller and less emphasized */}
      <p className="auction-details__price">
        <strong>Starting Price:</strong> ${details.startingPrice}
      </p>
      <p className="auction-details__increment">
        <strong>Bid Increment:</strong> ${details.bidIncrement}
      </p>
      {/* More details if needed */}
    </div>
  );
};

export default AuctionDetails;
