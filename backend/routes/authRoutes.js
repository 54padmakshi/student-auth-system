const express = require("express");
const bcrypt = require("bcrypt"); // Ensure bcrypt is imported
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ✅ Get User from Token
router.get("/user", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: { name: decoded.name, email: decoded.email } });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("📌 Registering User:", { name, email, password });

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Hashed Password:", hashedPassword);

    // Save user to DB
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📩 Login Attempt:", { email, password }); // ✅ Log request

    // Check if user exists
    const user = await User.findOne({ email });
    console.log("🔍 Found User:", user); // ✅ Log user from DB

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Password Match:", isMatch); // ✅ Log password match result

    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("✅ Token Generated:", token); // ✅ Log generated token

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
