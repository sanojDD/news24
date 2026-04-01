import axios from "axios";

export const getNepalNews = async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    const url = `https://newsapi.org/v2/everything?q=Nepal&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

    const response = await axios.get(url);

    // Return the articles to the frontend
    res.status(200).json(response.data);
  } catch (error) {
    console.error("News API Error:", error.message);
    res.status(500).json({ message: "Error fetching news from provider" });
  }
};
