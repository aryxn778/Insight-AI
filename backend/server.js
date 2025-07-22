const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Correct way for openai@4.x
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/summarize', async (req, res) => {
  const { urlText } = req.body;

  try {
    const prompt = `Summarize the following article content:\n\n${urlText}`;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const summary = response.choices[0].message.content;
    res.status(200).json({ summary });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});