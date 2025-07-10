const jwt              = require("jsonwebtoken");
const BlacklistedToken = require("../modules/BlacklistedToken");

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  const blacklisted = await BlacklistedToken.findOne({ token });
  if (blacklisted) {
    return res.status(403).json({ message: "Token sudah tidak berlaku (blacklisted)" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = payload;
    next();
  });
}


module.exports = authenticateToken;
