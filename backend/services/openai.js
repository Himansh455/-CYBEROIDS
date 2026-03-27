const axios = require("axios");

const callAI = async (prompt, model = "meta-llama/Meta-Llama-3.1-8B-Instruct") => {
  try {
    const response = await axios.post(
      "https://api.featherless.ai/v1/chat/completions",
      {
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FEATHERLESS_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(`AI Response (${model}): Success`);
    return response.data.choices?.[0]?.message?.content || JSON.stringify(response.data);

  } catch (err) {
    const errorMsg = err.response?.data?.error?.message || err.response?.data || err.message;
    console.error(`AI Service Error (${model}):`, errorMsg);
    return "AI Error (" + errorMsg + ")";
  }
};

const verifyAIConfig = async () => {
    if (!process.env.FEATHERLESS_API_KEY) {
        console.error("AI Warning: FEATHERLESS_API_KEY is missing from .env");
        return;
    }
    // Simple test call
    try {
        await axios.post(
            "https://api.featherless.ai/v1/chat/completions",
            {
              model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
              messages: [{ role: "user", content: "hi" }],
              max_tokens: 5
            },
            {
              headers: { Authorization: `Bearer ${process.env.FEATHERLESS_API_KEY}` }
            }
        );
        console.log("✅ AI Authentication: Verified (Featherless AI)");
    } catch (err) {
        console.error("❌ AI Authentication Failed:", err.response?.data?.error?.message || err.message);
    }
};

module.exports = { callAI, verifyAIConfig };
