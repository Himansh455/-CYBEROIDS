const express = require("express");
const { callAI } = require("../services/openai");
const router = express.Router();

function cleanJSON(text) {
  // Removes common AI-generated markdown wrappers
  return text.replace(/```json/gi, "")
             .replace(/```/g, "")
             .trim();
}

router.post("/", async (req, res) => {
  const { githubScore, totalRepos, experience, languages, descriptions } = req.body;

  const prompt = `
Act as a Senior Technical Recruiter and Hiring Panel.
Analyze this developer based on their GitHub metadata:
- Score: ${githubScore}
- Repos: ${totalRepos}
- Experience: ${experience} years
- Languages: ${JSON.stringify(languages)}
- Project Descriptions: ${descriptions.join(" | ")}

Output exactly in this JSON format:
{
  "grade": "Letter grade A-F",
  "skills": ["List top 5 technical skills"],
  "strengths": ["List 3 key strengths"],
  "weaknesses": ["List 2 potential red flags or areas for improvement"],
  "summary": "One sentence hiring recommendation"
}
`;

  const result = await callAI(prompt, "meta-llama/Meta-Llama-3.1-70B-Instruct");
  
  try {
    const cleaned = cleanJSON(result);
    const jsonResult = JSON.parse(cleaned);
    res.json(jsonResult);
  } catch (e) {
    console.error("AI Decision Parse Failed:", e.message);
    res.json({ 
        grade: "B", 
        summary: "Analysis complete, but formatted result requires manual review.",
        skills: ["Source Code Analysis"],
        raw: result 
    });
  }
});

module.exports = router;
