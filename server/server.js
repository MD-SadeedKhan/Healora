const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const healthRecordRoutes = require("./routes/healthRecords");
const aiService = require("./services/MultiAIApiService");
const authMiddleware = require("./middleware/auth");

// Load environment variables
dotenv.config({ path: __dirname + "/.env" });

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",                // Local dev
    "https://healora-tan.vercel.app"        // 🔗 Deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message, err.stack);
    process.exit(1);
  });

// Routes
app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/health-records", healthRecordRoutes);

// AI Response Endpoint
app.post("/api/ai-response", authMiddleware, async (req, res) => {
  const { prompt } = req.body;
  console.log("🧠 AI Request received with prompt:", prompt);

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "Please provide a valid prompt" });
  }

  try {
    const { response, provider } = await Promise.race([
      aiService.getResponse(prompt, req.user.id),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 10000)
      ),
    ]);

    console.log(`✅ AI response received from ${provider}`);
    res.json({ response, provider });
  } catch (error) {
    console.error("❌ AI response error:", error.message || error);
    res.status(500).json({ error: "Could not fetch AI response. Please try again." });
  }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
