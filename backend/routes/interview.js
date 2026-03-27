const express = require("express");
const callAI = require("../services/openai");
const router = express.Router();

router.post("/", async (req, res) => {
  const { answer } = req.body;

  const prompt = `
You are an AI interviewer.
User answer: "${answer}"

If strong → ask harder question.
If weak → simplify.

Return next question only.
`;

  const result = await callAI(prompt, "meta-llama/Llama-3.1-8B-Instruct");

  res.json({ nextQuestion: result });
});

module.exports = router;
