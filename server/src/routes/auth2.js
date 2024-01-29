var express = require("express");
var router = express.Router();
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const admin = require("firebase-admin");

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
      console.log("profile.id is: ", profile.id);
      console.log("the entire profile is: ", profile);

      // Ensure that profile.id is defined
      if (!profile.id) {
        return done(new Error("Profile ID is undefined"));
      }

      let userDoc = await usersCollection.doc(profile.id).get();

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
        done(null, newUser);
      } else {
        done(null, userDoc.data());
      }
    }
  )
); 

router.get("/login", (req, res) => {
  // In a full-stack app, you might render a server-side login page here.
  // For a React SPA, you could redirect to your React app's login page or just omit this route.
  res.redirect(`${process.env.REACT_APP_FRONTEND_URL}/login`); // Redirect to the React app's login page
});

// GAMLE ROUTES
router.get(
  "/login/federated/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: `${process.env.REACT_APP_FRONTEND_URL}`,
    failureRedirect: "/login",
  })
);

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

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, user.uid); // Assuming 'uid' is the unique identifier for your user
  });
});

passport.deserializeUser(async (uid, done) => {
  process.nextTick(async () => {
    try {
      const usersCollection = admin.firestore().collection("users");
      const userDoc = await usersCollection.doc(uid).get();
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
