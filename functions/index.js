const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors")({ origin: true });
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY || functions.config().openai.Key,
});

const openai = new OpenAIApi(configuration);

exports.summarizeArticle = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ error: "Missing URL" });
      }

      const prompt = `Summarize the main points of this article in bullet points: ${url}`;

      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert summarizer.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 600,
      });

      const summary = completion.data.choices[0].message.content;
      res.status(200).json({ summary });
    } catch (error) {
      console.error("OpenAI Error:", error);
      res.status(500).json({ error: "Something went wrong." });
    }
  });
});
