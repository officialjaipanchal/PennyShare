const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const User = require("../models/userModel");
const logger = require("../helper/logger");

// 🔹 Generate Access Token
exports.generateAccessToken = (user) => {
  if (!user || !user._id) {
    throw new Error("User object is missing or does not have an ID");
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      emailId: user.emailId,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
};

// 🔹 Authentication Middleware (Validates JWT & Attaches User)
exports.authMiddleware = async (req, res, next) => {
  if (process.env.DISABLE_API_AUTH === "true") {
    return next();
  }

  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) {
    logger.error(
      `URL: ${req.originalUrl} | API Auth Failed | Token not present`
    );
    return res.status(403).json({ message: "Token not present" });
  }

  const token = authHeader.split(" ")[1]; // Extract token
  if (!token) {
    logger.error(
      `URL: ${req.originalUrl} | API Auth Failed | Token missing in header`
    );
    return res.status(403).json({ message: "Token missing in header" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token Payload:", decoded);

    if (!decoded.id) {
      logger.error(
        `URL: ${req.originalUrl} | API Auth Failed | Missing User ID in Token`
      );
      return res.status(403).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(ObjectId(decoded.id));
    if (!user) {
      logger.error(
        `URL: ${req.originalUrl} | API Auth Failed | User not found`
      );
      return res.status(403).json({ message: "User not found" });
    }

    req.user = user; // Attach user to request
    next(); // Proceed to route
  } catch (error) {
    logger.error(`URL: ${req.originalUrl} | API Auth Failed | Invalid Token`);
    return res.status(403).json({ message: "Invalid Token" });
  }
};

// 🔹 Validate Token Middleware (For Token-Based Routes)
exports.validateToken = (req, res, next) => {
  if (process.env.DISABLE_API_AUTH === "true") {
    return next();
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    logger.error(
      `URL: ${req.originalUrl} | API Authentication Fail | Token not present`
    );
    return res.status(403).json({ message: "Token not present" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded.id) {
      logger.error(
        `URL: ${req.originalUrl} | API Authentication Fail | Missing User ID in Token`
      );
      return res.status(403).json({ message: "Invalid token payload" });
    }

    req.user = decoded; // Store decoded token data
    next();
  } catch (error) {
    logger.error(
      `URL: ${req.originalUrl} | API Authentication Fail | Invalid Token`
    );
    return res.status(403).json({ message: "Invalid Token" });
  }
};

// 🔹 Validate User Permission
exports.validateUser = (user, emailId) => {
  if (process.env.DISABLE_API_AUTH !== "true" && user.emailId !== emailId) {
    var err = new Error("Access Denied");
    err.status = 403;
    throw err;
  }
  return true;
};
