const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Scheduled function to check and close inactive auctions
exports.scheduledAuctionCheck = functions.pubsub
  .schedule("every 10 minutes")
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    console.log(`Scheduled function running at ${now.toDate().toISOString()}`);

    try {
      const snapshot = await db
        .collection("auctions")
        .where("isLive", "==", true)
        .where("endTime", "<=", now)
        .get();

      const batch = db.batch();
      snapshot.forEach((doc) => {
        console.log(
          `Closing auction ${doc.id} with endTime ${doc
            .data()
            .endTime.toDate()
            .toISOString()}`
        );
        batch.update(doc.ref, { isLive: false });
      });

      await batch.commit();
      console.log("Inactive auctions closed successfully.");
    } catch (error) {
      console.error("Error closing inactive auctions:", error);
    }
  });

// Cloud Function to close auctions when endTime passes
exports.closeAuctionOnEndTime = functions.firestore
  .document("auctions/{auctionId}")
  .onUpdate(async (change, context) => {
    const auctionId = context.params.auctionId;
    const after = change.after.data();
    const now = admin.firestore.Timestamp.now();
    console.log(
      `Firestore trigger running at ${now
        .toDate()
        .toISOString()} for auction ${auctionId}`
    );

    // Check if the auction end time has passed and it is still live
    if (
      after.endTime &&
      after.endTime.toMillis() <= now.toMillis() &&
      after.isLive
    ) {
      try {
        await db
          .collection("auctions")
          .doc(auctionId)
          .update({ isLive: false });
        console.log(`Auction ${auctionId} closed.`);
      } catch (error) {
        console.error(`Error closing auction ${auctionId}:`, error);
      }
    } else {
      console.log(
        `Auction ${auctionId} is still live or endTime has not passed`
      );
    }
  });
