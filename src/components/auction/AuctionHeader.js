import React from "react";

const AuctionHeader = ({ title, status }) => {
  // If status is not provided, set a default status
  const effectiveStatus = status || "Auction Live";
  const statusClass =
    effectiveStatus === "Live" ? "text-green-500" : "text-red-500";

  return (
    <div className="bg-white shadow-md p-4 rounded-lg mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {/* Use effectiveStatus to ensure something is displayed even if status is undefined */}
      <span className={`font-semibold ${statusClass}`}>{effectiveStatus}</span>
    </div>
  );
};

export default AuctionHeader;
