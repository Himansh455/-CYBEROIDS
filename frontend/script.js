const API_BASE = "http://127.0.0.1:5000/api";

async function analyze() {
  const username = document.getElementById("username").value;
  if (!username) return alert("Please enter a GitHub username");

  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loader-text");
  loader.style.display = "flex";

  try {
    // 1. GitHub Analysis
    loaderText.innerText = `Analyzing @${username}'s repositories...`;
    const githubRes = await fetch(`${API_BASE}/github`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username })
    });
    const githubData = await githubRes.json();

    if (githubData.error) throw new Error(githubData.error);

    // 2. AI Hiring Panel Decision
    loaderText.innerText = "Simulating AI hiring panel discussion...";
    const decisionRes = await fetch(`${API_BASE}/decision`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ 
        githubScore: githubData.score, 
        interviewPerformance: "Candidate has strong open source contributions." 
      })
    });
    const decisionData = await decisionRes.json();

    // 3. Store and Redirect
    sessionStorage.setItem('analysis_results', JSON.stringify({
      username,
      score: githubData.score,
      repos: githubData.repos,
      decision: decisionData.decision
    }));

    window.location.href = 'results.html';

  } catch (err) {
    alert("Analysis failed: " + err.message);
    loader.style.display = "none";
  }
}

// Logic for results initialization is also in results.html for faster loading,
// but we keep script.js as the core logic provider.
