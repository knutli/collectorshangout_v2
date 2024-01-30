const express = require("express");
const axios = require("axios");
require("dotenv").config();
const router = express.Router();

async function redirectToVippsLogin(req, res) {
  try {
    const vippsAuthUrl =
      "https://api.vipps.no/access-management-1.0/access/oauth2/auth";
    const clientId = process.env.VIPPS_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.VIPPS_REDIRECT_URI);
    const responseType = "code";
    const scope = encodeURIComponent("openid");

    const authUrl = `${vippsAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    res.redirect(authUrl);
  } catch (error) {
    console.error("Error redirecting to Vipps: ", error);
    res.status(500).send("Error redirecting to Vipps login");
  }
}

async function handleVippsCallback(req, res) {
  const authCode = req.query.code;

  try {
    const response = await axios.post(
      "https://api.vipps.no/access-management-1.0/access/oauth2/token",
      {
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: process.env.VIPPS_REDIRECT_URI,
      },
      {
        auth: {
          username: process.env.VIPPS_CLIENT_ID,
          password: process.env.VIPPS_CLIENT_SECRET,
        },
      }
    );

    const accessToken = response.data.access_token;

    // Now use the access token to get the user's profile or other actions
    // ...

    res.send("Vipps login successful"); // or redirect to a different page
  } catch (error) {
    console.error("Error during Vipps token exchange:", error);
    res.status(500).send("Error during Vipps login");
  }
}

router.get("/auth/vipps", redirectToVippsLogin);
router.get("/vipps/callback", handleVippsCallback);

module.exports = router;
