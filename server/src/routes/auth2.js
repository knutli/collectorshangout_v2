var express = require("express");
var router = express.Router();
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const admin = require("firebase-admin");
const jwt = require('jsonwebtoken');

/**
 * Generates a JWT for a given user.
 * @param {Object} user - The user object for whom the token is being generated.
 * @returns {String} The generated JWT.
 */
function generateToken(user) {
  // Ensure you have a unique identifier for the user in your user object
  const userId = user.uid; // This could be any unique attribute from your user model

  // Define the payload for the JWT
  const payload = {
    sub: userId, // Subject (whom the token is about)
    iat: Math.floor(Date.now() / 1000), // Issued at time
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // Expiration time (24 hours from issue)
    // You can add other claims here as needed
  };

  // Generate the JWT
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256', // Use HS256 algorithm for signing the token
  });

  return token;
}


// STRATEGY FOR OAUTH
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

      // Ensure that profile.id is defined
      if (!profile.id) {
        return done(new Error("Profile ID is undefined"));
      }

      let userDoc = await usersCollection.doc(profile.id).get();
      let user;

      if (!userDoc.exists) {
        // Extract email and photoURL correctly
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;
        const photoURL =
          profile.photos && profile.photos.length > 0
            ? profile.photos[0].value
            : null;

        const newUser = {
          uid: profile.id,
          displayName: profile.displayName,
          email: email,
          photoURL: photoURL,
        };
        await usersCollection.doc(profile.id).set(newUser);
        user = newUser; 
   
        } else {
          user = userDoc.data(); // Existing user found
        }
    
        // Generate token for the user (new or existing)
        const token = generateToken(user);
    
        // Now, you can attach the token to the user object or handle it as per your requirement
        // For example, add the token to the user object that will be passed to done()
        user.token = token;
    
        done(null, user); // Pass the modified user object with the token to the next step
      }
)); 

router.get(
  "/login", (req, res) => {
  res.redirect(`${process.env.REACT_APP_FRONTEND_URL}/login`); // Redirect to the React app's login page
});

// GAMLE ROUTES
router.get(
  "/login/federated/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // The user object now includes the token
    if (req.user && req.user.token) {
      // Option 1: Send token via secure, HttpOnly cookie (secure method, recommended for immediate extraction by SPA)
      res.cookie('temporary_auth_token', req.user.token, { httpOnly: true, secure: true, sameSite: 'Lax', maxAge: 60 * 60 * 24 * 1000 }); // 1 day expiry
      res.redirect(`${process.env.REACT_APP_FRONTEND_URL}`);
    } else {
      // Handle error or invalid state
      res.redirect(`${process.env.REACT_APP_FRONTEND_URL}/login?error=authentication_failed`);
    }
  }
);

// Endpoint to check current user and return user data based on the JWT
router.get("/current_user", (req, res) => {
  const token = req.cookies['temporary_auth_token']; // Adjust based on your cookie name

  if (!token) {
    return res.send({ user: null });
  }

  // Verify JWT token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ user: null });
    }
  
    const uid = decoded.sub; // Make sure 'sub' is the property where the UID is stored
    if (!uid) {
      return res.status(401).send({ message: "Invalid token" });
    }
  
    const usersCollection = admin.firestore().collection("users");
    try {
      const userDoc = await usersCollection.doc(uid).get(); // uid must be a non-empty string
  
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


router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function (err) {
      if (err) {
        console.log(err); // Handle the error if the session wasn't destroyed properly
      }
      res.clearCookie("connect.sid"); // The name of your session cookie
      res.redirect("/"); // Redirect after logging out
    });
  });
});

// passport.serializeUser((user, done) => {
//   process.nextTick(() => {
//     console.log('user is: ', user);
//     done(null, user.uid); // Assuming 'uid' is the unique identifier for your user
//   });
// });

passport.serializeUser((id, done) => {
  done(null, id); // Directly use the ID for serialization
});

passport.deserializeUser(async (id, done) => {
  process.nextTick(async () => {
    try {
      const usersCollection = admin.firestore().collection("users");
      const userDoc = await usersCollection.doc(id).get();
      if (!userDoc.exists) {
        return done(null, false); // User not found
      }
      return done(null, userDoc.data()); // Return user data
    } catch (error) {
      return done(error);
    }
  });
});

module.exports = router;
