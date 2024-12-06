import React from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import { useEffect, useState } from "react";

import { formatPublishedDate } from "../../../utils/dateFormatter";

const LeftSideNav = ({ onSelectCategory }) => {
  const allCategories = [
    { id: "0", name: "All News" },
    { id: "1", name: "Business" },
    { id: "2", name: "Entertainment" },
    { id: "3", name: "General" },
    { id: "4", name: "Health" },
    { id: "5", name: "Science" },
    { id: "6", name: "Sports" },
    { id: "7", name: "Technology" },
  ];

  const [sportsNewsData, setsportsNewsData] = useState([]);
  const [loading, setLoading] = useState(false);

  var url =
    "https://newsapi.org/v2/everything?q=sports&pageSize=3&apiKey=12666b122098435090e63b0fb7c46a67";

  async function getNewsData() {
    setLoading(true);

    const res = await axios.get(url);
    setsportsNewsData(res.data.articles);

    setLoading(false);
  }

  useEffect(() => {
    getNewsData();
  }, []);

  return (
    <div>
      <div className="p-4 space-y-3 mb-6">
        <h2 className="font-bold">All Category</h2>
        {allCategories.map((category) => (
          <Link className="block ml-4" key={category.id} onClick={() => onSelectCategory(category)}>
            {category.name}
          </Link>
        ))}
      </div>

      <div>
        {sportsNewsData.map((sportNews, index) => (
          <div key={index} className="card bg-base-100 w-90 shadow-xl p-2 rounded mb-4">
            {sportNews.urlToImage && (
              <figure className="object-cover h-48 w-86">
                <img
                  className="object-fit: fill"
                  src={sportNews.urlToImage}
                  alt="Shoes"
                />
              </figure>
            )}
            <div className="card-body p-4">
              <h3 className="card-title text-base">{sportNews.title}</h3>
              <div className="card-actions justify-between mt-4">
                <div className="badge badge-primary">Sports</div>
                <div className="text-sm">
                  {formatPublishedDate(sportNews.publishedAt)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSideNav;
