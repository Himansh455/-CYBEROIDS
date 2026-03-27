const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  const { username } = req.body;

  try {
    const repos = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    let score = 0;

    repos.data.forEach(repo => {
      score += repo.stargazers_count * 3;
      score += repo.forks_count * 2;
    });

    score += repos.data.length * 2;

    res.json({
      score,
      repos: repos.data.length,
      message: "Improved GitHub evaluation complete",
    });
  } catch (err) {
    res.status(500).json({ error: "GitHub fetch failed" });
  }
});

module.exports = router;
