import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5001;

const SMMRY_API_KEY = 'sk-smmry-e17e553e0c7abb91b51d5b63eea05768a2d00b44b2107c504c915a4f7ca07627';

app.post('/summarize', async (req, res) => {
  const { url } = req.body;

  // ✅ Corrected: use ? not &, and use backticks for string interpolation
  const smmryUrl = `https://api.smmry.com?SM_API_KEY=${SMMRY_API_KEY}&SM_URL=${encodeURIComponent(url)}&SM_LENGTH=5&SM_WITH_BREAK`;

  try {
    const response = await fetch(smmryUrl);
    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      return res.status(502).json({ error: 'Invalid response from SMMRY' });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('SMMRY proxy error:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

app.listen(PORT, () => {
  console.log(`SMMRY proxy server running at http://localhost:${PORT}`);
});