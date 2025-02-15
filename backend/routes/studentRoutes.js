const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Student = require("../models/Student");

const router = express.Router();

// Get Student Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select("-password");
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
