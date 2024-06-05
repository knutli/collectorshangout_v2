var express = require("express");
var router = express.Router();
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

/**
 * Generates a JWT for a given user.
 * @param {Object} user - The user object for whom the token is being generated.
 * @returns {String} The generated JWT.
 */
function generateToken(user) {
  const userId = user.uid;

  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });

  return token;
}

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.REACT_APP_BACKEND_URL}/oauth2/redirect/google`,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const usersCollection = admin.firestore().collection("users");

      if (!profile.id) {
        return done(new Error("Profile ID is undefined"));
      }

      try {
        let userDoc = await usersCollection.doc(profile.id).get();
        let user;

        if (!userDoc.exists) {
          const email = profile.emails?.[0]?.value || null;
          const photoURL = profile.photos?.[0]?.value || null;

          const newUser = {
            uid: profile.id,
            displayName: profile.displayName,
            email: email,
            photoURL: photoURL,
          };
          await usersCollection.doc(profile.id).set(newUser);
          user = newUser;
        } else {
          user = userDoc.data();
        }

        const token = generateToken(user);
        user.token = token;

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

router.get("/login", (req, res) => {
  res.redirect(`${process.env.REACT_APP_FRONTEND_URL}/login`);
});

router.get(
  "/login/federated/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    if (req.user && req.user.token) {
      res.cookie("temporary_auth_token", req.user.token, {
        httpOnly: true,
        secure: false, // Ensure this is false for localhost
        sameSite: "Lax", // Use SameSite=Lax for local development
        path: "/", // Explicitly set path to root
        maxAge: 60 * 60 * 24 * 1000,
      });
      console.log("Cookie set with JWT:", req.user.token);
      res.redirect(`${process.env.REACT_APP_FRONTEND_URL}`);
    } else {
      res.redirect(
        `${process.env.REACT_APP_FRONTEND_URL}/login?error=authentication_failed`
      );
    }
  }
);

router.get("/current_user", async (req, res) => {
  const token = req.cookies["temporary_auth_token"];

  if (!token) {
    console.error("No token found in cookies");
    return res.send({ user: null });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(401).send({ user: null });
    }

    const uid = decoded.sub;
    if (!uid) {
      console.error("Invalid token: missing UID");
      return res.status(401).send({ message: "Invalid token" });
    }

    const usersCollection = admin.firestore().collection("users");
    try {
      const userDoc = await usersCollection.doc(uid).get();

      if (!userDoc.exists) {
        return res.status(404).send({ message: "User not found" });
      }

      res.status(200).send({ user: userDoc.data() });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).send({ message: "Error fetching user data" });
    }
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("temporary_auth_token");
  res.redirect("/");
});

// Register new user with username and password
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const usersCollection = admin.firestore().collection("users");

  try {
    let userDoc = await usersCollection.where("email", "==", username).get();
    if (!userDoc.empty) {
      return res.status(400).send({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      uid: uuidv4(), // Generate a unique UID
      displayName: username,
      email: username,
      photoURL: "https://via.placeholder.com/150", // Placeholder image URL
      password: hashedPassword,
    };
    await usersCollection.doc(newUser.uid).set(newUser);

    const token = generateToken(newUser);
    console.log("Generated JWT token for registration:", token);
    res.cookie("temporary_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 60 * 60 * 24 * 1000,
    });
    console.log("Cookie set with JWT:", token);

    res.status(201).send({ user: newUser });
  } catch (error) {
    console.error("Error registering new user:", error);
    res.status(500).send({ message: "Error registering new user" });
  }
});

// Login user with username and password
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const usersCollection = admin.firestore().collection("users");

  try {
    const userQuery = await usersCollection
      .where("email", "==", username)
      .get();
    if (userQuery.empty) {
      console.error("Invalid username or password: user not found");
      return res.status(400).send({ message: "Invalid username or password" });
    }

    const userDoc = userQuery.docs[0];
    const user = userDoc.data();

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.error("Invalid username or password: incorrect password");
      return res.status(400).send({ message: "Invalid username or password" });
    }

    const token = generateToken(user);
    console.log("Generated JWT token for login:", token);
    res.cookie("temporary_auth_token", token, {
      httpOnly: true,
      secure: false, // Ensure this is false for localhost
      sameSite: "Lax", // Use SameSite=Lax for local development
      path: "/", // Explicitly set path to root
      maxAge: 60 * 60 * 24 * 1000,
    });
    console.log("Cookie set with JWT:", token);

    res.status(200).send({ user });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send({ message: "Error logging in user" });
  }
});

module.exports = router;
