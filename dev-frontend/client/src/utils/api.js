import Statistics from "../pages/Statistics/Statistics";
import axios from 'axios';
import {getToken} from "../utils/authService";
const BASE_URL = "http://localhost:8080/api";

const API_ENDPOINTS = {
  Home: {
    ARTICLES_WITH_SENTIMENT: `${BASE_URL}/articles/articles-with-sentiment`,
    ARTICLES_BY_CATEGORY: (category) => `${BASE_URL}/articles/category/${category.toLowerCase()}`,
  },
  Users: {
    LOGIN: `${BASE_URL}/users/login`,
    REGISTER: `${BASE_URL}/users/register`,
  }, 
  Statistics: {
    STATS: `${BASE_URL}/users/stats`
  }, 
  Articles: {
    READ: `${BASE_URL}/articles/read`
  },
  Trends: {
    GENERAL: `${BASE_URL}/trends/general`
  }
};

const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

// Registration API call
export const registerUser = async (data) => {
  try {
    const response = await axios.post(API_ENDPOINTS.Users.REGISTER, data);
    return response;
  } catch (error) {
    throw error.response?.data?.message || "An error occurred during registration";
  }
};

//for login
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(API_ENDPOINTS.Users.LOGIN, credentials);
    if (response.status === 200) {
      const fullToken = response.headers["authorization"];
      const token = fullToken.replace("Bearer ", ""); // Extract the token
      return { token };
    } else {
      throw new Error(`Unexpected response code: ${response.status}`);
    }
  } catch (err) {
    const message =
      err.response?.data || "An error occurred while logging in.";
    throw new Error(message);
  }
};

//for home
export const fetchNewsData = async (category) => {
  try {
    const url =
      category === "All News"
        ? API_ENDPOINTS.Home.ARTICLES_WITH_SENTIMENT
        : API_ENDPOINTS.Home.ARTICLES_BY_CATEGORY(category);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching news data:", error);
    throw error;
  }
};

// for news page
export const markArticleAsRead = async (sentiment) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINTS.Articles.READ}?sentiment=${sentiment}`,
      {}, // Empty object as the request body
      {
        headers: getHeaders(),
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking article as read:", error);
    throw error.response?.data || "An error occurred while marking the article as read.";
  }
};

// for statistics
export const fetchStatisticsData = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.Statistics.STATS, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error fetching statistics data:", error);
    throw error;
  }
};

// for statistics
export const fetchTrendsData = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.Trends.GENERAL, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error fetching trends data:", error);
    throw error;
  }
};