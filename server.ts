import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
let useMongo = false;

// --- JSON File Fallback ---
const DB_FILE = path.join(process.cwd(), "database.json");
interface DBState { users: any[]; requests: any[]; }

function initDB(): DBState {
  if (!fs.existsSync(DB_FILE)) {
    const initialState: DBState = { users: [], requests: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialState, null, 2), "utf-8");
    return initialState;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch {
    const initialState: DBState = { users: [], requests: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialState, null, 2), "utf-8");
    return initialState;
  }
}
function writeDB(data: DBState) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

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

  // Connect to MongoDB if URI is provided, otherwise use JSON file fallback
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      useMongo = true;
      console.log("Connected to MongoDB successfully.");
    } catch (err) {
      console.error("MongoDB connection failed, falling back to JSON file:", err);
      useMongo = false;
    }
  } else {
    console.log("No MONGODB_URI set. Using local JSON file database.");
  }

  // API Endpoints
  // 1. Auth Register
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password, role, college, yr, dept, phone, company, designation } = req.body;

    if (!name || !email || !password || !role || !phone) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const userData = {
      id: "usr_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name, email, password, role, phone,
      college: role === "student" ? college : undefined,
      yr: role === "student" ? yr : undefined,
      dept: role === "student" ? dept : undefined,
      company: role === "professional" ? company : undefined,
      designation: role === "professional" ? designation : undefined,
      created_at: new Date().toISOString()
    };

    try {
      if (useMongo) {
        const existingUser = await UserModel.findOne({ email: new RegExp('^' + email + '$', 'i') });
        if (existingUser) return res.status(400).json({ error: "User with this email already exists." });
        const newUser = await UserModel.create(userData);
        const obj = newUser.toObject() as any;
        const { password: _, ...safe } = obj;
        return res.json({ success: true, user: safe });
      } else {
        const db = initDB();
        if (db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
          return res.status(400).json({ error: "User with this email already exists." });
        }
        db.users.push(userData);
        writeDB(db);
        const { password: _, ...safe } = userData;
        return res.json({ success: true, user: safe });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error during registration." });
    }
  });

  // 2. Auth Login
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required." });

    try {
      if (useMongo) {
        const user = await UserModel.findOne({ email: new RegExp('^' + email + '$', 'i'), password });
        if (!user) return res.status(401).json({ error: "Invalid email or password." });
        const obj = user.toObject() as any;
        const { password: _, ...safe } = obj;
        return res.json({ success: true, user: safe });
      } else {
        const db = initDB();
        const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (!user) return res.status(401).json({ error: "Invalid email or password." });
        const { password: _, ...safe } = user;
        return res.json({ success: true, user: safe });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error during login." });
    }
  });

  // 3. Submit Project Request
  app.post("/api/projects/request", async (req, res) => {
    const { user_email, name, email, phone, what_to_do } = req.body;
    if (!email || !phone || !what_to_do) return res.status(400).json({ error: "Please input all required request fields." });

    const requestData = {
      id: "req_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      user_email: user_email || email, name: name || "Anonymous", email, phone, what_to_do,
      status: "pending", ppt_url: "", abstract_content: "", rating: 0, feedback: "",
      created_at: new Date().toISOString()
    };

    try {
      if (useMongo) {
        const newRequest = await RequestModel.create(requestData);
        return res.json({ success: true, request: newRequest });
      } else {
        const db = initDB();
        db.requests.push(requestData);
        writeDB(db);
        return res.json({ success: true, request: requestData });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error during project request." });
    }
  });

  // 4. Get Project Requests for User
  app.get("/api/projects/user/:email", async (req, res) => {
    const { email } = req.params;
    try {
      if (useMongo) {
        const userRequests = await RequestModel.find({
          $or: [
            { user_email: new RegExp('^' + email + '$', 'i') },
            { email: new RegExp('^' + email + '$', 'i') }
          ]
        });
        return res.json({ success: true, requests: userRequests });
      } else {
        const db = initDB();
        const userRequests = db.requests.filter(
          (r: any) => r.user_email.toLowerCase() === email.toLowerCase() || r.email.toLowerCase() === email.toLowerCase()
        );
        return res.json({ success: true, requests: userRequests });
      }
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
      if (useMongo) {
        const updatedRequest = await RequestModel.findOneAndUpdate(
          { id: requestId }, { rating, feedback: feedback || "" }, { new: true }
        );
        if (!updatedRequest) return res.status(404).json({ error: "Project request not found." });
        return res.json({ success: true, request: updatedRequest });
      } else {
        const db = initDB();
        const reqIndex = db.requests.findIndex((r: any) => r.id === requestId);
        if (reqIndex === -1) return res.status(404).json({ error: "Project request not found." });
        db.requests[reqIndex].rating = rating;
        db.requests[reqIndex].feedback = feedback || "";
        writeDB(db);
        return res.json({ success: true, request: db.requests[reqIndex] });
      }
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
      if (useMongo) {
        const users = await UserModel.find({});
        const requests = await RequestModel.find({});
        return res.json({ success: true, users, requests });
      } else {
        const db = initDB();
        return res.json({ success: true, users: db.users, requests: db.requests });
      }
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
    if (!requestId) return res.status(400).json({ error: "Request identity parameter is missing." });

    try {
      if (useMongo) {
        const updateData: any = {};
        if (status) updateData.status = status;
        if (ppt_url !== undefined) updateData.ppt_url = ppt_url;
        if (abstract_content !== undefined) updateData.abstract_content = abstract_content;
        const updatedRequest = await RequestModel.findOneAndUpdate({ id: requestId }, updateData, { new: true });
        if (!updatedRequest) return res.status(404).json({ error: "Request not found." });
        return res.json({ success: true, request: updatedRequest });
      } else {
        const db = initDB();
        const reqIndex = db.requests.findIndex((r: any) => r.id === requestId);
        if (reqIndex === -1) return res.status(404).json({ error: "Request not found." });
        if (status) db.requests[reqIndex].status = status;
        if (ppt_url !== undefined) db.requests[reqIndex].ppt_url = ppt_url;
        if (abstract_content !== undefined) db.requests[reqIndex].abstract_content = abstract_content;
        writeDB(db);
        return res.json({ success: true, request: db.requests[reqIndex] });
      }
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
    app.get("*", (req, res) => {
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
