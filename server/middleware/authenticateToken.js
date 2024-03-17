const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.cookies['temporary_auth_token']; 
  if (!token) {
    return res.sendStatus(401); // No token, unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      return res.sendStatus(403); // Token invalid, forbidden
    }
    req.user = { uid: decodedPayload.sub };
    console.log('authenticateTokenfile says user is: ', req.user.uid);
    next(); // Token valid, proceed
  });
}

module.exports = authenticateToken;

