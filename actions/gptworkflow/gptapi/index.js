import fetch from "node-fetch";
import * as core from "@actions/core";
global.require = fetch;

const prompt = core.getInput("prompt");
const API_KEY = core.getInput("api_key");
const API_URL = "https://api.openai.com/v1/chat/completions";

const generate = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY,
      },
      body: JSON.stringify({
        messages: [{ role: "system", content: prompt }],
        max_tokens: 1000,
        model: "gpt-3.5-turbo"
      })

    });
    const responseData = await response.json();
    if (Array.isArray(responseData.choices) && responseData.choices.length > 0) {
      const assistantReply = responseData.choices[0].message.content;
      console.log(assistantReply);
      core.setOutput("body", assistantReply);
    } else {
      console.log("No valid response from the assistant.");
    }

    const generatedResponse = responseData;
  } catch (error) {
    console.error('Error:', error);
  }
};

generate();