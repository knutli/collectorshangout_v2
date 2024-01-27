import React from "react";
import "../../styles/auctionView.css";

const CurrentBid = ({ currentBid, minimumIncrement }) => {
  return (
    <div>
      <p className="CURRENT_BID-current_highest_bid">
        Høyeste bud: NOK&nbsp;
        {currentBid || currentBid === 0 ? currentBid : "0"}
      </p>
      <p className="CURRENT_BID-minimum_bid_increment">
        Minste budøkning: NOK {minimumIncrement}
      </p>
    </div>
  );
};

export default CurrentBid;
