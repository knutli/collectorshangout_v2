const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const passport = require("passport");

/* // Passport Google Authentication Route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Passport Google Callback Route
router.get(
  `${process.env.REACT_APP_BACKEND_URL}/auth/google/callback`,
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    try {
      // Successful authentication, redirect to frontend
      console.log("User:", req.user); // Log the user object
      res.redirect(`${process.env.REACT_APP_FRONTEND_URL}/authenticated`); // Redirect to your frontend
    } catch (error) {
      console.error("Error in Google callback:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
); */

/*
// Check auth status
router.get("/current_user", (req, res) => {
  if (req.isAuthenticated()) {
    // Check if the user is authenticated
    res.json(req.user); // Send back the user data
    console.log("router current_user sends back:", req.user);
  } else {
    res.status(401).json({ message: "No authenticated user" }); // Send 401 if not authenticated
  }
}); 
*/

/*

// POST route to handle user data
router.post("/", async (req, res) => {
  const userData = req.body;
  const usersCollection = admin.firestore().collection("users");

  try {
    const userDoc = await usersCollection.doc(userData.uid).get();

    if (userDoc.exists) {
      // Update existing user
      await usersCollection.doc(userData.uid).update(userData);
    } else {
      // Create new user
      await usersCollection.doc(userData.uid).set(userData);
    }
  } catch (error) {
    console.error("Error processing user data:", error);
    res.status(500).send({ message: "Error processing user data" });
  }
});

*/

// GET route to fetch user details
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const usersCollection = admin.firestore().collection("users");

  try {
    const userDoc = await usersCollection.doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).send({ message: "User not found" });
    }

    const userData = userDoc.data();
    res.status(200).header("Content-Type", "application/json").send(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send({ message: "Error fetching user data" });
  }
});

module.exports = router;
