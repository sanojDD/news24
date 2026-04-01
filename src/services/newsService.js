import axios from "axios";

// This pulls the Render URL you set in Vercel settings
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getNepalNews = async () => {
  try {
    // 1. Call YOUR backend instead of NewsAPI
    const response = await axios.get(`${API_BASE_URL}/api/news`);

    // 2. Return the articles array from your backend's response
    return response.data.articles || [];
  } catch (error) {
    console.error("Error fetching news from backend:", error);
    return [];
  }
};
