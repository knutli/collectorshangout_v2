require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const { Firestore } = require("@google-cloud/firestore");
const { FirestoreStore } = require("@google-cloud/connect-firestore");

const app = express();

// Enable CORS for all routes and origins
// app.use(cors());
/* app.use(
  cors({ origin: `${process.env.REACT_APP_FRONTEND_URL}`, credentials: true })
); */

app.use(cors({ 
  origin: [`${process.env.REACT_APP_FRONTEND_URL}`, 'http://localhost:3001'],
  credentials: true 
}));


// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const http = require("http"); // Required for Socket.IO
const port = process.env.SERVER_PORT || 3000; // The 3000 is a default if process.env.PORT is not set
const server = http.createServer(app); // Create a server for Socket.IO
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
  },
});

const admin = require("firebase-admin");
const serviceAccount = require("./Collectors_Hangout_Firebase_Admin.json");

// Initialize Firebase Admin with service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// NEW LOGIN TEST
var authRouter = require("./src/routes/auth2.js");

const sessionOptions = {
    store: new FirestoreStore({
      dataset: new Firestore({
        projectId: process.env.GOOGLE_PROJECT_ID,
        keyFilename: "Collectors_Hangout_Firebase_Admin.json",
      }),
      kind: "express-sessions",
    }),
    secret: process.env.PASSPORT_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // to force https (set to true in production)
      httpOnly: true, // to force httpOnly (improves security by not allowing client-side script access to the cookie)
      sameSite: 'none', // this is the setting for cross-site access
    }
  };

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionOptions.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

// DENNE HØRER TIL passport strategy OAUTH 2.0
/* app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
); */

app.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(`${process.env.REACT_APP_FRONTEND_URL}`);
  }
);

// Check current user
app.get("/current_user", (req, res) => {
  if (req.user) {
    res.send({ user: req.user });
  } else {
    res.send({ user: null });
  }
});

app.get("/", (req, res) => {
  if (!req.session.views) {
    req.session.views = 0;
  }
  const views = req.session.views++;
  res.send(`Views ${views}`);
});

// NEW AUTH TEST
app.use("/", authRouter);

const auctionRoutes = require("./src/routes/auctions.js")(io);
const userRoutes = require("./src/routes/userRoutes.js");

// Routes requiring authentication
app.post("/api/auctions", auctionRoutes.createAuction);
//app.put("/api/auctions/:auctionId", auctionRoutes.updateAuction);
app.post("/api/auctions/:auctionId/bid", auctionRoutes.placeBid);
// User routes
app.use("/api/users", userRoutes);

// Public route that does not require authentication
app.get("/api/auctions/:auctionId", auctionRoutes.getAuctionDetails);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("New client connected");

  // Handling a 'bid' event from the client
  socket.on("placeBid", (bidData) => {
    console.log("Bid received (socket):", bidData);

    // Before broadcasting, log the bid data to be emitted
    console.log("Emitting bidPlaced event with data (socket):", bidData);

    // Broadcast the bid data to all connected clients
    io.emit("bidPlaced", bidData);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// This is necessary for client-side routing in your React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the server on the specified port
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
