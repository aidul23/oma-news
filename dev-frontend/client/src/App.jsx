import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);

  var url =
    "https://newsapi.org/v2/everything?q=bitcoin&apiKey=12666b122098435090e63b0fb7c46a67";

  async function getNewsData() {
    setLoading(true);

    const res = await axios.get(url);
    setNewsData(res.data.articles);

    setLoading(false);
  }

  useEffect(() => {
  }, []);

  return (
    <>
      
    </>
  );
}

export default App;
