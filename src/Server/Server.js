/* eslint-disable no-undef */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Profile from "../models/Profile.js";

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// ===== CORS =====
// In Render production, frontend URL must be correct
const corsOptions = {
  origin: "https://eveningcollectionfront.onrender.com",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// ===== JWT =====
const JWT_TOKEN = process.env.JWT_SECRET || "supersecret";

// ===== MongoDB =====
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected ✅");
} catch (err) {
  console.error("MongoDB Connection Error ❌:", err.message);
  process.exit(1);
}
app.set("trust proxy", 1);
// ===== Rate limiter =====
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, try again later.",
});

// ===== Auth middleware =====
const middleware = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  try {
    const decoded = jwt.verify(token, JWT_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ err, message: "Invalid or expired token" });
  }
};

// ===== Routes =====
app.get("/", (req, res) => res.send("Backend live ✅"));

// ===== Auth =====
app.post("/api/signup", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCount = await User.countDocuments();
    if (userCount >= 2)
      return res.status(403).json({ error: "Max 2 users allowed" });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, passwordHash });

    res
      .status(201)
      .json({ message: "User created", user: { email: newUser.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_TOKEN, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ✅ required for Render HTTPS
      sameSite: "none", // ✅ required for cross-origin cookies
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      user: { email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/me", middleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
  res.json({ message: "Logged out" });
});

// ===== CRUD for Profile =====
app.get("/api/data", middleware, authLimiter, async (req, res) => {
  try {
    const data = await Profile.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/data", middleware, authLimiter, async (req, res) => {
  try {
    const data = new Profile(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/dcEntries", middleware, async (req, res) => {
  try {
    const profiles = await Profile.find();
    const allEntries = profiles.flatMap((p) =>
      (p.dcEntries || []).map((e) => ({
        ...e.toObject(),
        dcNo: p.dcNo,
        name: p.name,
        profileId: p._id,
      }))
    );
    res.json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/dc/:dcNo", middleware, async (req, res) => {
  try {
    const { dcNo } = req.params;
    const { amount, date } = req.body;

    if (!amount || !date)
      return res.status(400).json({ error: "Amount and date are required" });

    const profile = await Profile.findOne({ dcNo });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    profile.dcEntries = profile.dcEntries || [];
    profile.dcEntries.push({ amount, date });

    await profile.save();
    res
      .status(201)
      .json({ message: "Entry added", dcEntries: profile.dcEntries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/data/:id", middleware, authLimiter, async (req, res) => {
  try {
    const updated = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/data/:id", middleware, authLimiter, async (req, res) => {
  try {
    await Profile.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));
