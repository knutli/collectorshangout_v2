const schedule = require("node-schedule");
const admin = require("firebase-admin");

const io = require("socket.io")(); // You'll need to adjust this to get the instance from your server.js

const scheduleAuctionEnd = (auctionId, endTime) => {
  schedule.scheduleJob(endTime, async function () {
    // Logic to finalize the auction
    const auctionRef = admin.firestore().collection("auctions").doc(auctionId);
    const auctionSnap = await auctionRef.get();

    if (!auctionSnap.exists) {
      console.error("Auction not found:", auctionId);
      return;
    }

    const auction = auctionSnap.data();
    if (new Date() >= new Date(auction.endTime)) {
      // Finalize the auction
      const winnerId = auction.currentHighestBidderId;
      await auctionRef.update({ status: "completed", winnerId: winnerId });

      // Notify users about the auction end
      io.emit("auctionEnded", { auctionId, winnerId });
    }
  });
};

module.exports = { scheduleAuctionEnd };
