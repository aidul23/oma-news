import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Doughnut, Line, Pie } from 'react-chartjs-2';
import { fetchStatisticsData, fetchTrendsData } from "../../utils/api";
import { getMonthlyData, getWeeklyData } from "../../utils/dataUtils";
import { Header } from '../shared/Header/Header';
import { Navbar } from '../shared/Navbar/Navbar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const createChartData = (data) => ({
  labels: ["Positive", "Negative", "Neutral"],
  datasets: [
    {
      label: "Sentiment Analysis",
      data: [data.positive, data.negative, data.neutral],
      backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      hoverBackgroundColor: ["#45a049", "#da190b", "#e0a800"],
      borderColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      borderWidth: 1,
    },
  ],
});

const Statistics = () => {
  const [sentimentData, setSentimentData] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });
  const [checked, setChecked] = useState({
    positive: true,
    negative: true,
    neutral: true,
  });
  const [timeframe, setTimeframe] = useState("daily");
  const [filteredData, setFilteredData] = useState([]);
  const [initialLineData, setInitialLineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const lineData = {
    labels: filteredData.map((item) => item.date),
    datasets: [
      {
        label: "Positive",
        data: checked.positive ? filteredData.map((item) => item.positive) : [],
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
      },
      {
        label: "Negative",
        data: checked.negative ? filteredData.map((item) => item.negative) : [],
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
      },
      {
        label: "Neutral",
        data: checked.neutral ? filteredData.map((item) => item.neutral) : [],
        borderColor: "#FFCE56",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderWidth: 2,
      },
    ],
  };


  useEffect(() => {
    // Check for user in localStorage
    const user = localStorage.getItem("user");

    if (user) {
      setIsAuthenticated(true); // User is authenticated
    } else {
      setIsAuthenticated(false); // No user found
      setLoading(false); // Stop loading
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const stats = await fetchStatisticsData();
        const trends = await fetchTrendsData();
        setSentimentData(stats);
        setInitialLineData(trends);
        setFilteredData(trends); // Initially set filtered data to raw data
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Update filtered data based on timeframe
  useEffect(() => {
    if (!isAuthenticated) return;

    let data = [...initialLineData]; // Make a copy of the initial trend data

    if (timeframe === "weekly") {
      data = getWeeklyData(data);
    } else if (timeframe === "monthly") {
      data = getMonthlyData(data);
    }
    setFilteredData(data);
  }, [timeframe, initialLineData, isAuthenticated]);

  // UI handlers
  const handleCheckboxChange = (e) =>
    setChecked({ ...checked, [e.target.name]: e.target.checked });

  const handleTimeframeChange = (e) => setTimeframe(e.target.value);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-10">
      <Header></Header>
      <Navbar></Navbar>
        <h1 className="text-2xl font-bold text-red-500">You must log in to access your sentiment stastics.</h1>
        
      </div>
    );
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!sentimentData || !initialLineData)
    return <div className="text-center py-10">No data available</div>;

  const chartData = createChartData(sentimentData);

  return (
    <div>
      <Header />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-white-800">Sentiment Analysis Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Pie Chart</h2>
            <Pie data={chartData} />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Doughnut Chart</h2>
            <Doughnut data={chartData} />
          </div>
        </div>
        {/* Line Chart */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Sentiment Line Graph</h2>
          <div>
            <label>
              Timeframe:
              <select value={timeframe} onChange={handleTimeframeChange}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
          </div>
          <Line data={lineData} />
        </div>
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Insights</h2>
          <p className="text-gray-600">
            This dashboard provides an overview of sentiment analysis for trending news. 
            The charts above show the distribution of positive, negative, and neutral sentiments 
            in the analyzed content. Use this information to gauge public opinion and understand 
            the overall sentiment of the current news landscape.
          </p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Summary:</h3>
            <ul className="list-disc list-inside mt-2">
              <li>Positive Sentiment: {sentimentData.positive}</li>
              <li>Negative Sentiment: {sentimentData.negative}</li>
              <li>Neutral Sentiment: {sentimentData.neutral}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
