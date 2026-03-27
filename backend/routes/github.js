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
    const languages = {};
    const descriptions = [];
    let oldestDate = new Date();

    repos.data.forEach(repo => {
      score += (repo.stargazers_count || 0) * 3;
      score += (repo.forks_count || 0) * 2;
      if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1;
      if (repo.description) descriptions.push(repo.description);
      const created = new Date(repo.created_at);
      if (created < oldestDate) oldestDate = created;
    });

    score += repos.data.length * 2;

    const topRepos = repos.data
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 3)
      .map(repo => ({
        name: repo.name,
        stars: repo.stargazers_count,
        url: repo.html_url
      }));

    // Estimate experience in years
    const experience = ((new Date() - oldestDate) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);

    res.json({
      score,
      totalRepos: repos.data.length,
      topRepos,
      languages,
      experience,
      descriptions: descriptions.slice(0, 5),
      message: "Deep evaluation complete",
    });
  } catch (err) {
    res.status(500).json({ error: "GitHub fetch failed" });
  }
});

module.exports = router;
