const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const githubRoutes = require("./routes/github");
const interviewRoutes = require("./routes/interview");
const decisionRoutes = require("./routes/decision");

const { verifyAIConfig } = require("./services/openai");

const app = express();
app.use(cors());
app.use(express.json());

// Verifying environment on startup
console.log("------------------------------------------");
console.log("🔍 Checking Environment Credentials...");
if (process.env.GITHUB_TOKEN) console.log("✅ GITHUB_TOKEN: Detected");
else console.warn("⚠️ GITHUB_TOKEN: Missing");
if (process.env.FEATHERLESS_API_KEY) console.log("✅ FEATHERLESS_API_KEY: Detected");
else console.warn("⚠️ FEATHERLESS_API_KEY: Missing");
verifyAIConfig();
console.log("------------------------------------------");

app.use("/api/github", githubRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/decision", decisionRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
