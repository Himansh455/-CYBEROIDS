const express = require("express");
const callAI = require("../services/openai");
const router = express.Router();

router.post("/", async (req, res) => {
  const { githubScore, interviewPerformance } = req.body;

  const prompt = `
Simulate a hiring panel discussion:

Recruiter: focus on communication
Tech Lead: focus on technical depth
Risk Analyst: focus on red flags

Candidate:
- GitHub Score: ${githubScore}
- Interview: ${interviewPerformance}

Show:
1. Each role opinion
2. Disagreements
3. Final decision
`;

  const result = await callAI(prompt, "meta-llama/Llama-3.1-70B-Instruct");

  res.json({ decision: result });
});

module.exports = router;
