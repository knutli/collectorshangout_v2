import React from "react";
import { Image, Card } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../auction/AuctionListings/cn";
import CountdownTimer from "../../../auction/AuctionView/CountdownTimer";

const AuctionListItem = React.forwardRef(
  ({ auction, removeWrapper, className, ...props }, ref) => {
    const navigate = useNavigate();
    const handleClick = () => navigate(`/auction/${auction.id}`);
    const bidCount = auction.bidHistory ? auction.bidHistory.length : 0;
    const endTime = new Date(auction.endTime.seconds * 1000);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full max-w-xs flex-col gap-2   p-4 rounded-lg ",
          className
        )}
        {...props}
      >
        <Card className="relative flex h-full w-full items-center  justify-center overflow-hidden  bg-gray-100">
          <Image
            removeWrapper
            alt={auction.title}
            className="z-0 h-full w-full object-cover hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
            src={auction.imageUrls?.[0] || "default_image_url"}
            onClick={handleClick}
          />
          <div className="absolute bottom-0 left-0 bg-white bg-opacity-90 py-1 px-1 rounded-sm text-sm">
            <CountdownTimer endTime={endTime} />
          </div>
        </Card>

        <div className="flex flex-col px-1">
          <h3 className="text-lg font-semibold text-gray-800 -mt-1">
            {auction.player}
          </h3>
          <p className="text-xl font-bold text-gray-800 mt-2">
            {auction.currentHighestBid} kr
          </p>
          <p className="text-sm text-gray-500 -mt-1">
            {bidCount ? `Høyeste av ${bidCount} bud` : "Ingen bud enda."}
          </p>
        </div>
      </div>
    );
  }
);

AuctionListItem.displayName = "AuctionListItem";

export default AuctionListItem;
