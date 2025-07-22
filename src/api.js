import axios from 'axios';

// Change this URL to your Render backend URL after deployment
const API_URL = 'http://localhost:5000/summarize';

export const fetchSummary = async (inputUrl) => {
  try {
    const response = await axios.post(API_URL, {
      urlText: inputUrl,
    });

    return response.data.summary;
  } catch (error) {
    console.error('Error fetching summary:', error.response?.data || error.message);
    return 'Failed to generate summary.';
  }
};