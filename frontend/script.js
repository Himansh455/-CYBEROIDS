const API_BASE = "http://127.0.0.1:5000/api";

async function analyze() {
  const username = document.getElementById("username").value;
  if (!username) return alert("Please enter a GitHub username");

  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loader-text");
  loader.style.display = "flex";

  try {
    // 1. GitHub Analysis
    loaderText.innerText = `Connecting to GitHub API for @${username}...`;
    const githubRes = await fetch(`${API_BASE}/github`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username })
    });
    const githubData = await githubRes.json();
    if (githubData.error) throw new Error(githubData.error);

    // 2. AI Recruiter Panel Decision
    loaderText.innerText = "Recruiter AI analyzing technical footprint...";
    const decisionRes = await fetch(`${API_BASE}/decision`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ 
        githubScore: githubData.score,
        totalRepos: githubData.totalRepos,
        experience: githubData.experience,
        languages: githubData.languages,
        descriptions: githubData.descriptions
      })
    });
    const decisionData = await decisionRes.json();

    // 3. Complete Data Packaging
    sessionStorage.setItem('analysis_results', JSON.stringify({
      username,
      score: githubData.score,
      totalRepos: githubData.totalRepos,
      topRepos: githubData.topRepos,
      languages: githubData.languages,
      experience: githubData.experience,
      decisionData: decisionData
    }));

    loaderText.innerText = "Finalizing dashboard...";
    setTimeout(() => {
        window.location.href = 'results.html';
    }, 500);

  } catch (err) {
    console.error(err);
    alert("Analysis failed: " + err.message);
    loader.style.display = "none";
  }
}
