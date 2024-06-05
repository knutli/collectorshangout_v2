require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const authenticateToken = require("./middleware/authenticateToken");

const app = express();

app.use(
  cors({
    origin: process.env.REACT_APP_FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  next();
});

const http = require("http");
const port = process.env.SERVER_PORT || 3000;
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const admin = require("firebase-admin");
const serviceAccount = require("./Collectors_Hangout_Firebase_Admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const authRouter = require("./src/routes/auth2.js");

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

app.use("/", authRouter);

const auctionRoutes = require("./src/routes/auctions.js")(io);
const userRoutes = require("./src/routes/userRoutes.js");

app.post("/api/auctions", authenticateToken, auctionRoutes.createAuction);
app.post(
  "/api/auctions/:auctionId/bid",
  authenticateToken,
  auctionRoutes.placeBid
);
app.use("/api/users", userRoutes);

app.get("/api/auctions/:auctionId", auctionRoutes.getAuctionDetails);

app.use(express.static(path.join(__dirname, "build")));

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("placeBid", (bidData) => {
    console.log("Bid received (socket):", bidData);
    io.emit("bidPlaced", bidData);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
