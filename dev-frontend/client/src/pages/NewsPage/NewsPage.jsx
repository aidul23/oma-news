import { React, useState } from "react";
import LeftSideNav from "../shared/LeftSideNav/LeftSideNav";
import { Navbar } from "../shared/Navbar/Navbar";
import RightSideNav from "../shared/RightSideNav/RightSideNav";
import { Header } from "../shared/Header/Header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { markArticleAsRead } from "../../utils/api";

const NewsPage = () => {
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const newsArticle = location.state?.news;

  const handleNews = async (newsArticle) => {
    if (!newsArticle || !newsArticle.sentiment) return;
    setLoading(true);

    try {
      const data = await markArticleAsRead(newsArticle.sentiment);
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error in handleNews:", error);
      alert("Failed to mark article as read.");
    } finally {
      setLoading(false);
    }
  };

  const badgeClass =
    newsArticle.sentiment === "positive"
      ? "bg-green-500 text-white"
      : newsArticle.sentiment === "negative"
      ? "bg-red-500 text-white"
      : "bg-gray-500 text-white";

  return (
    <div>
      <Header></Header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center min-h-screen">
              <span data-testid="loading-spinner" className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div data-testid="news-article" className="card bg-base-100 w-90 shadow-xl ml-4 mr-4 mb-4 mt-6 rounded-md">
              <div>
                {newsArticle.urlToImage && (
                  <figure className="object-cover h-full w-full">
                    <img
                      data-testid="news-image"
                      className="object-fit: fill"
                      src={newsArticle.urlToImage}
                      alt="Shoes"
                    />
                  </figure>
                )}
              </div>

              <div className="card-body p-4">
                <h2 data-testid="news-title" className="card-title text-3xl">{newsArticle.title}</h2>
                <p data-testid="news-description" className="text-xl">{newsArticle.description}</p>
                <p data-testid="news-content" className="mt-4">{newsArticle.content}</p>
                <div className="flex items-center justify-between">
                  <a
                    data-testid="read-more-link"
                    target="blank"
                    href={newsArticle.url}
                    className="underline text-sky-400"
                    onClick={() => handleNews(newsArticle)}
                  >
                    Read full news
                  </a>
                  <div data-testid="sentiment-badge" className={`badge ${badgeClass} p-3`}>
                    {newsArticle.sentiment}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="">
          <RightSideNav></RightSideNav>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
