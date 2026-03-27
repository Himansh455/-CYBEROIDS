const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const githubRoutes = require("./routes/github");
const interviewRoutes = require("./routes/interview");
const decisionRoutes = require("./routes/decision");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/github", githubRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/decision", decisionRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
