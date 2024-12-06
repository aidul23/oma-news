import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../shared/Header/Header";
import { Navbar } from "../shared/Navbar/Navbar";
import { loginUser } from "../../utils/api";
import { setToken } from "../../utils/authService";

export const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState({
    username: false,
    password: false,
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFocusChange = (field, focused) => {
    setIsFocused((prev) => ({
      ...prev,
      [field]: focused,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { token } = await loginUser(credentials);
      setToken(token);
      localStorage.setItem("user", JSON.stringify({ name: credentials.username }));
      navigate("/"); // Redirect to home or dashboard
    } catch (err) {
      setError(err.message || "An error occurred during login.");
    }
  };

  return (
    <div>
      <Header />
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-lg bg-white p-12 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Login to your account
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin} role="form" data-testid="login-form">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="username">
                Username
              </label>
              <input
                data-testid="username-input"
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                onFocus={() => handleFocusChange("username", true)}
                onBlur={() => handleFocusChange("username", false)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-[#f3f3f3] ${
                  isFocused.username ? "text-black" : "text-gray-500"
                }`}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                data-testid="password-input"
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                onFocus={() => handleFocusChange("password", true)}
                onBlur={() => handleFocusChange("password", false)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-[#f3f3f3] ${
                  isFocused.password ? "text-black" : "text-gray-500"
                }`}
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              data-testid="login-button"
              type="submit"
              className="w-full bg-[#403f3f] text-white py-2 rounded-lg hover:bg-gray-800"
            >
              Login
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Don't Have An Account?{" "}
            <Link to="/register" className="text-red-500">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
