import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { GoogleGenerativeAI } from "@google/generative-ai";
import contactRoutes from "./routes/contact.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import Course from "./models/Course.model.js";



// Load env variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend.onrender.com"],
  credentials: true
}));
app.use("/api/contact", contactRoutes);
app.use("/api/submission", submissionRoutes);
// ----- MongoDB Connection -----
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Stop server if DB fails
  });

// ----- User Schema -----
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "staff", "admin"], default: "user" },
  name: { type: String },
  department: { type: String },
  createdAt: { type: Date, default: Date.now },

  completedCourses: [
    {
      courseId: String,
      title: String,
      date: { type: Date, default: Date.now }
    }
  ],
  assignments: [
    {
      subject: String,
      level: String,
      score: Number,
      date: { type: Date, default: Date.now }
    }
  ]
});




// Use 'users' collection
const User = mongoose.model('User', userSchema, 'users');

// ----- Gemini AI -----
let genAI, model;
let geminiAvailable = true;

if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log('✅ Gemini AI initialized');
  } catch (err) {
    console.error('❌ Gemini AI initialization error:', err.message);
    geminiAvailable = false;
  }
} else {
  console.log('⚠️ Gemini API key not found, using fallback mode');
  geminiAvailable = false;
}
// ✅ Get all users (e.g., for staff dashboard)
app.get("/api/users", async (req, res) => {
  try {
    const role = req.query.role; // e.g. ?role=student
    const users = await User.find(role ? { role } : {}).select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error fetching users" });
  }
});


// ----- Routes -----
app.use("/api/contact", contactRoutes); // ✅ contact routes handled separately

// ----- Auth: Signup -----
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Always set role as 'user'
    const userRole = "user";

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with role = 'user'
    const user = new User({
      username,
      password: hashedPassword,
      role: userRole,
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully!',
      role: userRole,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});


// ----- Get User Profile -----
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      email: user.username, // since you're storing email as username
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----- Get Staff Profile -----

app.get("/api/staff/profile", verifyToken, async (req, res) => {
  try {
    const staff = await User.findById(req.user.id).select("-password");
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    res.json({
      id: staff._id,
      name: staff.name,
      username: staff.username,
      email: staff.username,
      role: staff.role,
      department: staff.department,
      joinedDate: staff.createdAt || new Date().toISOString(),
    });
  } catch (err) {
    console.error("Staff profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/staff/track-progress", verifyToken, async (req, res) => {
  try {
    // Only allow staff to access this
    const staffUser = await User.findById(req.user.id);
    if (!staffUser || staffUser.role !== "staff") {
      return res.status(403).json({ message: "Access denied. Staff only." });
    }

    // Fetch all users except staff
    const students = await User.find({ role: { $ne: "staff" } }).select(
      "username completedCourses assignments"
    );

    res.json(students);
  } catch (err) {
    console.error("Error fetching student progress:", err);
    res.status(500).json({ message: "Server error fetching progress" });
  }
});



// ----- Auth: Login -----
app.post("/api/login", async (req, res) => {
  try {
    let { username, password, role } = req.body;

    // ✅ Normalize role to lowercase
    role = role.toLowerCase();

    // ✅ Try matching exact username + role
    let user = await User.findOne({ username, role });

    // ✅ Fallback if no role match (for backward compatibility)
    if (!user) {
      user = await User.findOne({ username });
    }

    if (!user) {
      return res.status(400).json({ message: `No ${role} account found for this email.` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role.toLowerCase() },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role.toLowerCase(),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// ----- Middleware: Token Verification -----
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get('/api/protected', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username role");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: `Hello ${user.username}, you are authorized as ${user.role}!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ----- Debug: List Models -----
app.get('/api/models', async (req, res) => {
  if (!geminiAvailable) {
    return res.status(501).json({ error: "Gemini AI not available" });
  }
  
  try {
    const models = await genAI.listModels();
    res.json(models);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ----- AI Chat Endpoint -----
app.post('/api/chat', async (req, res) => {
  if (!geminiAvailable) {
    return res.status(501).json({ error: "Gemini AI not available" });
  }
  
  const { messages } = req.body;
  try {
    const content = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const result = await model.generateContent({ contents: content });
    const response = await result.response.text();

    res.json({ message: { role: 'assistant', content: response } });
  } catch (err) {
    console.error("Gemini API error:", err.message || err);
    res.status(200).json({ 
      message: { 
        role: 'assistant', 
        content: "I'm currently unable to process your request. Please try again later." 
      } 
    });
  }
});

// ✅ Mark Course as Completed
app.post('/api/user/course-complete', verifyToken, async (req, res) => {
  try {
    const { courseId, title } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Avoid duplicates
    if (!user.completedCourses.some(c => c.courseId === courseId)) {
      user.completedCourses.push({ courseId, title });
      await user.save();
    }

    res.json({ message: 'Course marked as completed', completedCourses: user.completedCourses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Save Assignment Score
app.post('/api/user/save-assignment', verifyToken, async (req, res) => {
  try {
    const { subject, level, score } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.assignments.push({ subject, level, score });
    await user.save();

    res.json({ message: 'Assignment saved', assignments: user.assignments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get all courses
app.get("/api/courses", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

app.get("/api/courses/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
});


// ✅ Add course (Admin only)
app.post("/api/courses", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete course (Admin only)
app.delete("/api/courses/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ----- Start Server -----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
