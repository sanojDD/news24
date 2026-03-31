import axios from "axios";

const API_KEY = "6e3d10e4a7cf4ceda4bf4bbe552fcdf7";
const BASE_URL = "https://newsapi.org/v2";

export const getNepalNews = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: "Nepal", // Search keyword
        sortBy: "publishedAt", // Get newest first
        language: "en", // English news
        apiKey: API_KEY,
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};
