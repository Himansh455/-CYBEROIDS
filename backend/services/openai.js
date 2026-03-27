const axios = require("axios");

const callAI = async (prompt, model = "meta-llama/Llama-3.1-8B-Instruct") => {
  try {
    const response = await axios.post(
      "https://api.featherless.ai/v1/completions",
      {
        model: model,
        prompt: prompt,
        max_tokens: 300
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FEATHERLESS_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(response.data); // debug once

    return response.data.choices?.[0]?.text || response.data.output || response.data.text || JSON.stringify(response.data);

  } catch (err) {
    console.error(err.response?.data || err.message);
    return "AI Error";
  }
};

module.exports = callAI;
