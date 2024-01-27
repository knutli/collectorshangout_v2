const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const {
  differenceInMilliseconds,
  addMilliseconds,
  formatISO,
} = require("date-fns");

const db = admin.firestore();

module.exports = function (io) {
  // POST route to create a new auction
  async function createAuction(req, res) {
    if (!req.isAuthenticated()) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    try {
      const newAuction = req.body; // Your frontend will send the auction details as the request body
      const auctionRef = await db.collection("auctions").add(newAuction);
      res.status(201).send({ id: auctionRef.id, ...newAuction });
    } catch (error) {
      console.error("Error creating auction: ", error);
      res.status(500).send("Error creating auction");
    }
  }

  // GET route to get a single auction's details
  async function getAuctionDetails(req, res) {
    try {
      const auctionId = req.params.auctionId;
      const auctionDoc = await db.collection("auctions").doc(auctionId).get();

      if (!auctionDoc.exists) {
        return res.status(404).send("Auction not found");
      }

      let auctionData = auctionDoc.data();

      // Convert endTime to ISO string using date-fns
      if (auctionData.endTime && auctionData.endTime.toDate) {
        auctionData.endTime = formatISO(auctionData.endTime.toDate());
      }

      // Check if auction has bid history
      if (auctionData.bidHistory && auctionData.bidHistory.length > 0) {
        const usersCollection = db.collection("users");

        // Fetch user details for each bid
        const bidsWithUserDetails = await Promise.all(
          auctionData.bidHistory.map(async (bid) => {
            const userDoc = await usersCollection.doc(bid.bidderId).get();
            if (!userDoc.exists) {
              return bid; // Return the bid as-is if user not found
            }
            const userData = userDoc.data();
            return {
              ...bid,
              bidderName: userData.displayName,
              bidderPhotoURL: userData.photoURL,
            };
          })
        );

        auctionData.bidHistory = bidsWithUserDetails;
      }

      res.status(200).send({ id: auctionDoc.id, ...auctionData });
    } catch (error) {
      console.error("Error getting auction: ", error);
      res.status(500).send("Error getting auction");
    }
  }

  // POST route to handle a new bid
  async function placeBid(req, res) {
    const { bidAmount } = req.body;
    const { auctionId } = req.params;
    if (!req.user) {
      return res.status(401).send({ message: "User not authenticated" });
    }
    const userId = req.user.uid;
    // const userId = "martin";

    try {
      // Fetch the auction from the database
      const auctionRef = db.collection("auctions").doc(auctionId);
      const auctionSnap = await auctionRef.get();

      if (!auctionSnap.exists) {
        return res.status(404).send({ message: "Auction not found" });
      }

      const auction = auctionSnap.data();
      const bidHistory = auction.bidHistory || [];
      const minimumIncrement = auction.bidIncrement || 0;
      const currentHighestBid = auction.currentHighestBid || 0;
      const antiSnipeTime = auction.antiSnipeTime || 300000; // e.g., 5 minutes before auction ends
      const antiSnipeExtension = auction.antiSnipeExtension || 300000; // e.g., extend by 5 minutes
      const startingPrice = auction.startingPrice;

      // Validate bid amount
      if (bidAmount <= currentHighestBid + minimumIncrement - 1) {
        return res.status(400).send({
          message: `For lavt bud. Minste budøkning er ${minimumIncrement}.`,
        });
      }

      // Validate bid is higher than starting price
      if (bidAmount <= startingPrice - 1) {
        return res
          .status(400)
          .send({ message: `For lavt bud. Startpris er ${startingPrice}.` });
      }

      // Create a new bid entry
      const newBidEntry = {
        bidAmount: bidAmount,
        bidderId: userId,
        bidTimestamp: new Date().toISOString(), // Store the timestamp as ISO string
      };

      // Add the new bid to the history
      bidHistory.push(newBidEntry);

      // Anti-snipe logic
      const timeNow = new Date();
      console.log("Auction End Time String:", auction.endTime);

      let newEndTime;

      // Check if endTime is a Firestore Timestamp
      if (auction.endTime && auction.endTime.toDate) {
        newEndTime = auction.endTime.toDate();
      } else if (typeof auction.endTime === "string") {
        newEndTime = new Date(auction.endTime);
      } else {
        console.error("Unexpected endTime format:", auction.endTime);
        return res.status(500).send({ message: "Invalid endTime format" });
      }

      if (differenceInMilliseconds(newEndTime, timeNow) <= antiSnipeTime) {
        newEndTime = addMilliseconds(newEndTime, antiSnipeExtension);
      }
      const updatedEndTime = admin.firestore.Timestamp.fromMillis(
        newEndTime.getTime()
      );

      await auctionRef.update({
        currentHighestBid: bidAmount,
        currentHighestBidderId: userId,
        endTime: updatedEndTime,
        bidHistory: bidHistory,
      });

      // Emit updated end time along with the bid details
      console.log("Emitting bidPlaced with data:", {
        auctionId,
        bidAmount,
        userId,
        newEndTime: updatedEndTime.toDate().toISOString(),
        bidCount: bidHistory.length,
      });

      io.emit("bidPlaced", {
        auctionId,
        bidAmount,
        userId,
        newEndTime: updatedEndTime.toDate().toISOString(), // Send as ISO string
        bidCount: bidHistory.length,
      });

      return res.status(200).send({ message: "Bid placed successfully" });
    } catch (error) {
      console.error("Bid placement error:", error);
      return res.status(500).send({ message: "Error placing bid" });
    }
  }
  // Export the route handlers
  return {
    createAuction,
    getAuctionDetails,
    placeBid,
  };
};
