const express = require("express");
const router = express.Router();
const {
  processFinancialQuery,
} = require("../controllers/financialQueryController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res
        .status(400)
        .json({ status: "fail", message: "Query is required" });
    }

    if (!req.user) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    const userId = req.user._id;
    const userName = `${req.user.firstName} ${req.user.lastName}`;

    console.log("Authenticated User ID:", userId);
    console.log("Authenticated User Name:", userName);

    const response = await processFinancialQuery(query, userId, userName);
    return res.status(200).json({ status: "success", message: response });
  } catch (error) {
    console.error("Error in financial query:", error);
    return res
      .status(500)
      .json({ status: "fail", message: "Internal server error" });
  }
});

module.exports = router;
