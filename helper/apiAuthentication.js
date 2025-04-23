// var jwt = require("jsonwebtoken");
// var logger = require("./logger");

// exports.generateAccessToken = (user) => {
//   if (!user || !user._id) {
//     throw new Error("User object is missing or does not have an ID");
//   }

//   return jwt.sign(
//     {
//       id: user._id.toString(), // Ensure user ID exists before using toString()
//       emailId: user.emailId,
//       firstName: user.firstName,
//       lastName: user.lastName,
//     },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: "1h" }
//   );
// };

// // Middleware to validate JWT token
// exports.validateToken = (req, res, next) => {
//   if (process.env.DISABLE_API_AUTH == "true") {
//     return next();
//   }

//   const authHeader = req.headers["authorization"];
//   if (!authHeader) {
//     logger.error(
//       `URL : ${req.originalUrl} | API Authentication Fail | Token not present`
//     );
//     return res.status(403).json({ message: "Token not present" });
//   }

//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) {
//       logger.error(
//         `URL : ${req.originalUrl} | API Authentication Fail | Invalid Token`
//       );
//       return res.status(403).json({ message: "Invalid Token" });
//     }

//     if (!decoded.id) {
//       logger.error(
//         `URL : ${req.originalUrl} | API Authentication Fail | Missing User ID in Token`
//       );
//       return res.status(403).json({ message: "Invalid token payload" });
//     }

//     req.user = decoded; // Store decoded token data
//     next();
//   });
// };

// // Function to validate if the token user matches the requested user
// exports.validateUser = (user, emailId) => {
//   if (process.env.DISABLE_API_AUTH !== "true" && user.emailId !== emailId) {
//     var err = new Error("Access Denied");
//     err.status = 403;
//     throw err;
//   }
//   return true;
// };

// // var jwt = require("jsonwebtoken");
// // var logger = require("./logger");

// // exports.generateAccessToken = (user) => {
// //   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
// // };

// // exports.validateToken = (req, res, next) => {
// //   //Bypass Authentication when DISABLE_API_AUTH is set in the env file for dev purpose only
// //   if (process.env.DISABLE_API_AUTH == "true") {
// //     next();
// //   } else {
// //     //Checking if authorization is present in the header if not present then access is forbidden
// //     if (req.headers["authorization"] == null) {
// //       logger.error(
// //         `URL : ${req.originalUrl} | API Authentication Fail | message: Token not present`
// //       );
// //       res.status(403).json({
// //         message: "Token not present",
// //       });
// //     } else {
// //       //getting token from request header
// //       const authHeader = req.headers["authorization"];
// //       //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
// //       const token = authHeader.split(" ")[1];

// //       //function to verify the token
// //       jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
// //         if (err) {
// //           logger.error(
// //             `URL : ${req.originalUrl} | API Authentication Fail | message: Invalid Token`
// //           );
// //           res.sendStatus(403).json({
// //             message: "Invalid Token",
// //           });
// //           res.end();
// //         } else {
// //           //Adding user data to the req
// //           req.user = user;
// //           //proceed to the next action in the calling function
// //           next();
// //         }
// //       });
// //     }
// //   }
// // };

// // //Validation function to check if the user is same as the token user
// // exports.validateUser = (user, emailId) => {
// //   if (process.env.DISABLE_API_AUTH != "true" && user != emailId) {
// //     var err = new Error("Access Denied");
// //     err.status = 403;
// //     throw err;
// //   } else return true;
// // };
