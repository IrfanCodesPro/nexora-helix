import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/nexora-helix";

// --- Mongoose Models ---

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String, required: true },
  college: String,
  yr: String,
  dept: String,
  company: String,
  designation: String,
  created_at: { type: String }
});

const requestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_email: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  what_to_do: { type: String, required: true },
  status: { type: String, default: "pending" },
  ppt_url: { type: String, default: "" },
  abstract_content: { type: String, default: "" },
  rating: { type: Number, default: 0 },
  feedback: { type: String, default: "" },
  created_at: { type: String }
});

const UserModel = mongoose.model("User", userSchema);
const RequestModel = mongoose.model("ProjectRequest", requestSchema);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Connect to MongoDB
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }

  // API Endpoints
  // 1. Auth Register
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password, role, college, yr, dept, phone, company, designation } = req.body;

    if (!name || !email || !password || !role || !phone) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    try {
      const existingUser = await UserModel.findOne({ email: new RegExp('^' + email + '$', 'i') });
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists." });
      }

      const newUser = await UserModel.create({
        id: "usr_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        name,
        email,
        password, // simple hashing/storing for prototype
        role, // 'student' | 'professional'
        phone,
        college: role === "student" ? college : undefined,
        yr: role === "student" ? yr : undefined,
        dept: role === "student" ? dept : undefined,
        company: role === "professional" ? company : undefined,
        designation: role === "professional" ? designation : undefined,
        created_at: new Date().toISOString()
      });

      const userObject = newUser.toObject();
      const { password: _, ...userWithoutPassword } = userObject as any;
      res.json({ success: true, user: userWithoutPassword });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error during registration." });
    }
  });

  // 2. Auth Login
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    try {
      const user = await UserModel.findOne({ email: new RegExp('^' + email + '$', 'i'), password });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      const userObject = user.toObject();
      const { password: _, ...userWithoutPassword } = userObject as any;
      res.json({ success: true, user: userWithoutPassword });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error during login." });
    }
  });

  // 3. Submit Project Request
  app.post("/api/projects/request", async (req, res) => {
    const { user_email, name, email, phone, what_to_do } = req.body;

    if (!email || !phone || !what_to_do) {
      return res.status(400).json({ error: "Please input all required request fields." });
    }

    try {
      const newRequest = await RequestModel.create({
        id: "req_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        user_email: user_email || email, // anchor user
        name: name || "Anonymous",
        email,
        phone,
        what_to_do,
        status: "pending", // 'pending' | 'in_progress' | 'done'
        ppt_url: "",
        abstract_content: "",
        rating: 0,
        feedback: "",
        created_at: new Date().toISOString()
      });

      res.json({ success: true, request: newRequest });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error during project request." });
    }
  });

  // 4. Get Project Requests for User
  app.get("/api/projects/user/:email", async (req, res) => {
    const { email } = req.params;
    try {
      const userRequests = await RequestModel.find({
        $or: [
          { user_email: new RegExp('^' + email + '$', 'i') },
          { email: new RegExp('^' + email + '$', 'i') }
        ]
      });
      res.json({ success: true, requests: userRequests });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error fetching user requests." });
    }
  });

  // 5. Submit Rating & Feedback for Finished Project
  app.post("/api/projects/rate/:requestId", async (req, res) => {
    const { requestId } = req.params;
    const { rating, feedback } = req.body;

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5 stars." });
    }

    try {
      const updatedRequest = await RequestModel.findOneAndUpdate(
        { id: requestId },
        { rating, feedback: feedback || "" },
        { new: true }
      );
      
      if (!updatedRequest) {
        return res.status(404).json({ error: "Project request not found." });
      }

      res.json({ success: true, request: updatedRequest });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error submitting rating." });
    }
  });

  // 6. Admin Panel Retrieve Data
  app.post("/api/admin/data", async (req, res) => {
    const { username, password } = req.body;

    if (username !== "NEXORA" || password !== "neXora_helix") {
      return res.status(401).json({ error: "Invalid admin credentials." });
    }

    try {
      const users = await UserModel.find({});
      const requests = await RequestModel.find({});
      res.json({ success: true, users, requests });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error fetching admin data." });
    }
  });

  // 7. Admin Update Project Request (Status + PPT Link + Abstract link)
  app.post("/api/admin/update-request", async (req, res) => {
    const { username, password, requestId, status, ppt_url, abstract_content } = req.body;

    if (username !== "NEXORA" || password !== "neXora_helix") {
      return res.status(401).json({ error: "Invalid admin credentials." });
    }

    if (!requestId) {
      return res.status(400).json({ error: "Request identity parameter is missing." });
    }

    try {
      const updateData: any = {};
      if (status) updateData.status = status;
      if (ppt_url !== undefined) updateData.ppt_url = ppt_url;
      if (abstract_content !== undefined) updateData.abstract_content = abstract_content;

      const updatedRequest = await RequestModel.findOneAndUpdate(
        { id: requestId },
        updateData,
        { new: true }
      );

      if (!updatedRequest) {
        return res.status(404).json({ error: "Request not found." });
      }

      res.json({ success: true, request: updatedRequest });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error updating request." });
    }
  });

  // Serve the uploaded logo file directly
  app.get("/nexoralogo.jpeg", (req, res) => {
    res.sendFile(path.join(process.cwd(), "nexoralogo.jpeg"));
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nexora Helix server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
