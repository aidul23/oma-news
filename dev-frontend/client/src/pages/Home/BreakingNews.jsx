import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { fetchNewsData } from "../../utils/api";

const BreakingNews = () => {
  const [breakingNews, setBreakingNews] = useState("");

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        const newsData = await fetchNewsData("All News"); // Fetch all news
        if (newsData.length > 0) {
          setBreakingNews(newsData[0].title); // Set the title of the first news
        }
      } catch (error) {
        console.error("Error fetching breaking news:", error);
      }
    };

    fetchBreakingNews();
  }, []);

  return (
    <div className="bg-blue-900 text-white py-3 px-6 shadow-lg rounded-md">
      <div className="flex items-center gap-4">
        <button className="bg-white text-blue-900 font-semibold py-1 px-4 rounded-lg shadow-md hover:bg-gray-100 transition-all">
          Latest
        </button>
        <Marquee 
          pauseOnHover={true} 
          speed={80} 
          gradient={true} 
          gradientWidth={0}
          className="font-medium text-base"
        >
          {breakingNews ? breakingNews : "Fetching the latest breaking news..."}
        </Marquee>
      </div>
    </div>
  );
};

export default BreakingNews;
