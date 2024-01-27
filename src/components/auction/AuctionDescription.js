import React from "react";

const AuctionDescription = ({ description }) => {
  return (
    <div className="auction-details__description">
      <p>{description}</p>
    </div>
  );
};

export default AuctionDescription;
