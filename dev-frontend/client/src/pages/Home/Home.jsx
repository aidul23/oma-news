import { Header } from "../shared/Header/Header";
import LeftSideNav from "../shared/LeftSideNav/LeftSideNav";
import { Navbar } from "../shared/Navbar/Navbar";
import RightSideNav from "../shared/RightSideNav/RightSideNav";
import BreakingNews from "./BreakingNews";
import { formatPublishedDate } from "../../utils/dateFormatter";
import { fetchNewsData } from "../../utils/api";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All News");

  const navigate = useNavigate();

  async function getNewsData(category) {
    setLoading(true);
    try {
      const data = await fetchNewsData(category);
      setNewsData(data);
    } catch (error) {
      console.error("Failed to load news data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getNewsData(selectedCategory);
  }, [selectedCategory]);

  const handleNews = (news) => {
    navigate(`/news/${news.title}`, { state: { news } });
  };

  return (
    <div>
      <Header></Header>
      <BreakingNews></BreakingNews>
      <Navbar></Navbar>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="h-auto md:sticky md:top-0 md:h-screen overflow-y-auto">
          <LeftSideNav
            onSelectCategory={(category) => setSelectedCategory(category.name)}
          ></LeftSideNav>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="p-4 space-y-3">
            <h2 className="font-bold">News Home</h2>
          </div>
          {loading ? (
            <div className="flex justify-center items-center min-h-screen">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            newsData.map((news, index) => (
              <div
                className="card bg-base-100 w-90 shadow-xl ml-4 mr-4 mb-4 rounded-md"
                key={index}
                onClick={() => handleNews(news)}
              >
                <div className="p-2 flex bg-slate-200 rounded-t">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar mr-4 bg-gray-300"
                  >
                    <div className="w-10 h-10 rounded-full">
                      <img
                        alt="Tailwind CSS Navbar component"
                        src={news.urlToImage}
                      />
                    </div>
                  </div>
                  <div>
                    {news.author ? (
                      <h2 className="font-semibold text-black">
                        {news.author}
                      </h2>
                    ) : (
                      <h2 className="font-semibold text-black">unknown</h2>
                    )}
                    <p className="text-sm">
                      {formatPublishedDate(news.publishedAt)}
                    </p>
                  </div>
                </div>

                <div className="cursor-pointer">
                  {news.urlToImage && (
                    <figure className="object-cover h-48 w-86">
                      <img
                        className="object-fit: fill"
                        src={news.urlToImage}
                        alt="Shoes"
                      />
                    </figure>
                  )}
                </div>

                <div className="card-body p-4 cursor-pointer">
                  <h2 className="card-title">{news.title}</h2>
                  <p>{news.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Right Sidebar */}
        <div className="h-auto md:sticky md:top-0 md:h-screen overflow-y-auto">
          <RightSideNav setUser={setUser}></RightSideNav>
        </div>
      </div>
    </div>
  );
};
