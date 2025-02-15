require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// User Schema & Model
const UserSchema = new mongoose.Schema({ 
  name: String, 
  email: String, 
  password: String 
});
const User = mongoose.model("User", UserSchema);

// Register Route
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login Route
app.post("/api/auth/login", async (req, res) => {

  console.log("Received Login Request:", req.body); // ✅ Log request body

  const { email, password } = req.body;

    // 🔴 Check if email & password are missing
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }


  try {
    const user = await User.findOne({ email });

     // ✅ If user doesn't exist
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

     // ✅ Generate JWT Token

    const token = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ message: "Error logging in" });
  }
});

// Protected Route (Get User)
app.get("/api/auth/user", (req, res) => {
 
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: { name: decoded.name, email: decoded.email } });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
  res.send("Backend is running successfully!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
