import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import AuctionImageGallery from "./AuctionImageGallery";
import { Tabs, Tab, Card, CardBody, Progress } from "@nextui-org/react";
import BidInfo from "./BidInfo";
import AuctionAttributes from "./AuctionAttributes";
import AuctionDescription from "./AuctionDescription";
import CountdownTimer from "./CountdownTimer";
import CurrentBid from "./CurrentBid";
import BidHistory from "./BidHistory";
import TempHeader from "../TempHeader";
import { AuthContext } from "../../AuthContext";
import "../../styles/auctionView.css";

const AuctionView = () => {
  const { user } = useContext(AuthContext);
  const { auctionId } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [socket, setSocket] = useState(null);

  const isUserLoggedIn = !!user;

  // Fetch auction data
  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/auctions/${auctionId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAuction(data);
        if (data && data.bidHistory) {
          setBidHistory(data.bidHistory); // Initialize bidHistory with fetched data
        }
        setLoading(false); // Set loading to false once data is received
      } catch (error) {
        console.error("Failed to fetch auction data:", error);
        setError(error);
        setLoading(false);
      }
    };

    if (auctionId) {
      fetchAuctionData();
    }
  }, [auctionId]);

  // Set up Socket.IO connection
  useEffect(() => {
    if (auction && auctionId) {
      const newSocket = io(`${process.env.REACT_APP_BACKEND_URL}`);
      setSocket(newSocket);

      newSocket.on("bidPlaced", async (bidData) => {
        if (auction && bidData.auctionId === auction.id) {
          try {
            // Fetch user details for the bidder
            const userResponse = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/api/users/${bidData.userId}`
            );
            if (!userResponse.ok) {
              throw new Error("Failed to fetch user data");
            }
            const bid = await userResponse.json();

            // Update auction and bid history with user details
            setAuction((prevAuction) => ({
              ...prevAuction,
              currentBid: bidData.bidAmount,
              currentBidderId: bidData.userId,
              currentHighestBid: bidData.bidAmount,
              endTime: bidData.newEndTime || prevAuction.endTime,
            }));

            setBidHistory((prevHistory) => [
              ...prevHistory,
              {
                bidAmount: bidData.bidAmount,
                bidderName: bid.displayName,
                bidderPhotoURL: bid.photoURL,
                bidTimestamp: bidData.timestamp || new Date().toISOString(),
              },
            ]);
          } catch (error) {
            console.error("Error fetching user data for bid:", error);
          }
        }
      });

      return () => newSocket.close();
    }
  }, [auction, auctionId]);

  if (loading) {
    return (
      <div className="auction-view_loading-before-auction">
        <Progress
          size="md"
          isIndeterminate
          aria-label="Laster auksjon..."
          className="max-w-md"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        Noe gikk visst galt. Send denne feilmeldingen til admin: {error.message}
      </div>
    );
  }

  if (!auction) {
    return <div>Finner ikke auksjon...</div>;
  }

  return (
    <div>
      <TempHeader isUserLoggedIn={isUserLoggedIn} isBlackText={true} />

      <div className="auction-view__container">
        <div className="auction-view__left-column">
          {/* Auction image gallery */}
          {auction && (
            <div className="auction-view__image-gallery">
              <AuctionImageGallery images={auction.imageUrls} />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="auction-view__right-column">
          {/* Auction title section */}
          {auction && (
            <div className="auction-details__title">
              <h1>{auction.title}</h1>
              <div className="title-divider"></div>
            </div>
          )}

          {/* Starting price */}
          {auction &&
            (auction.currentHighestBid === 0 ||
              auction.currentHighestBid == null) && (
              <div className="auction-view-starting_price">
                Åpningspris: {auction.startingPrice}
              </div>
            )}
          {/* Current bid */}
          {auction && (
            <div className="auction-view__current-bid">
              <CurrentBid
                currentBid={auction.currentHighestBid}
                minimumIncrement={auction.bidIncrement}
              />
            </div>
          )}

          {auction && (
            <div className="auction-view__countdown">
              <CountdownTimer endTime={auction.endTime} />
            </div>
          )}

          {/* Bid information section */}
          {auction && (
            <div className="auction-view__bid-info">
              <BidInfo
                auctionId={auction.id}
                bid={auction.bid}
                socket={socket}
                minimumBid={auction.minimumBid}
                minimumIncrement={auction.bidIncrement}
                currentHighestBid={auction.currentHighestBid}
                startingPrice={auction.startingPrice}
                endTime={auction.endTime}
                auctionCreatorId={auction.creatorId}
              />
            </div>
          )}

          {/* Tab navigation */}
          <div className="auction-view-tabs">
            <div className="flex w-full flex-col">
              <Tabs disabledKeys={["chat"]} aria-label="Auction Tabs">
                <Tab key="details" title="Produktdetaljer">
                  <Card>
                    <AuctionAttributes attributes={auction} />
                  </Card>
                </Tab>
                <Tab key="description" title="Selgers beskrivelse">
                  <Card>
                    <CardBody>
                      {/* Auction description section */}
                      {auction && (
                        <AuctionDescription description={auction.description} />
                      )}
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="bidhistory" title="Budhistorikk">
                  {/* Auction bid history section */}
                  {auction.bidHistory && <BidHistory bidHistory={bidHistory} />}
                </Tab>
                <Tab key="chat" title="Chat">
                  <Card>
                    <CardBody>
                      {/* Chat component will go here */}
                      Chat will go here
                    </CardBody>
                  </Card>
                </Tab>
                {/* Add more tabs as needed */}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionView;
