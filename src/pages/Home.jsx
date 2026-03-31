import { useEffect, useState } from "react";
import { getNepalNews } from "../services/newsService";
import "./Home.css";

const NewsCard = ({ article }) => (
  <div className="news-card">
    {article.urlToImage && (
      <div className="news-image-container">
        <img src={article.urlToImage} alt="news" className="news-image" />
      </div>
    )}
    <div className="news-content">
      <span className="news-source">
        {article.source?.name || "Nepal News"}
      </span>
      <h3 className="news-title">{article.title}</h3>
      <p className="news-description">{article.description}</p>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="read-more-btn"
      >
        Read Full Story
      </a>
    </div>
  </div>
);

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const articles = await getNepalNews();
      // Filter out articles with missing titles or "Removed" content
      const validArticles = articles.filter(
        (a) => a.title && a.title !== "[Removed]",
      );
      setNews(validArticles.slice(0, 12));
      setLoading(false);
    };
    fetchNews();
  }, []);

  if (loading) return <div className="loading-text">Fetching Headlines...</div>;

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Nepal Headlines</h1>
        <div className="header-line"></div>
      </header>

      <div className="news-grid">
        {news.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

export default Home;
