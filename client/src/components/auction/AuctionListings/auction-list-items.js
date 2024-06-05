import React from "react";
import { Button, Image, Card } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { cn } from "./cn";
import CountdownTimer from "../AuctionView/CountdownTimer";

const AuctionListItem = React.forwardRef(
  ({ auction, removeWrapper, className, ...props }, ref) => {
    const navigate = useNavigate();
    const [isStarred, setIsStarred] = React.useState(false);
    const handleClick = () => navigate(`/auction/${auction.id}`);
    const bidCount = auction.bidHistory ? auction.bidHistory.length : 0;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full max-w-xs flex-col gap-2 bg-white p-8 rounded-lg ",
          className
        )}
        {...props}
      >
        <Button
          isIconOnly
          className="absolute right-4 top-4 z-20"
          radius="full"
          size="sm"
          variant="flat"
          onPress={() => setIsStarred(!isStarred)}
        >
          <Icon
            className={cn("text-gray-500", {
              "text-yellow-400": isStarred,
            })}
            icon="solar:star-bold"
            width={16}
          />
        </Button>
        <Card className="relative  flex h-full w-full items-center justify-center overflow-hidden  bg-gray-100">
          <Image
            removeWrapper
            alt={auction.title}
            className="z-0 h-full w-full object-cover hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
            src={auction.imageUrls?.[0] || "default_image_url"}
            onClick={handleClick}
          />
          <div className="absolute bottom-0 left-0 bg-white bg-opacity-90 py-1 px-1 rounded-sm text-sm">
            <CountdownTimer endTime={auction.endTime} />
          </div>
        </Card>

        <div className="flex flex-col px-1">
          <p className="text-sm text-gray-500">{auction.team}</p>
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
