const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

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

// PUT route to update user details
router.put("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const usersCollection = admin.firestore().collection("users");

  try {
    const userDoc = await usersCollection.doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).send({ message: "User not found" });
    }

    // Assuming req.body contains the fields to update
    await usersCollection.doc(userId).update(req.body);
    const updatedUser = await usersCollection.doc(userId).get();

    res
      .status(200)
      .header("Content-Type", "application/json")
      .send(updatedUser.data());
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send({ message: "Error updating user data" });
  }
});

// DELETE route to delete user details
router.delete("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const usersCollection = admin.firestore().collection("users");

  try {
    const userDoc = await usersCollection.doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).send({ message: "User not found" });
    }

    await usersCollection.doc(userId).delete(); // Perform the deletion
    // Clear the HttpOnly cookie by setting its expiry to the past
    res.setHeader(
      "Set-Cookie",
      "temporary_auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure;"
    );
    res.status(200).send({ message: "User successfully deleted" });
  } catch (error) {
    console.error("Error deleting user data:", error);
    res.status(500).send({ message: "Error deleting user data" });
  }
});

module.exports = router;
