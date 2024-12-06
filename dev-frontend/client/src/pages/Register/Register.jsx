import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../shared/Header/Header";
import { Navbar } from "../shared/Navbar/Navbar";
import axios from "axios";
import { registerUser } from "../../utils/api";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const navigate = useNavigate();

  // Validation state
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  // Validate name
  const validateName = (value) => {
    if (value.length > 2) {
      setNameError("");
    } else {
      setNameError("Name must be at least 3 characters");
    }
    setName(value);
  };

  // Validate email
  const validateEmail = (value) => {
    const emailPattern = /\S+@\S+\.\S+/;
    if (emailPattern.test(value)) {
      setEmailError("");
    } else {
      setEmailError("Please enter a valid email address");
    }
    setEmail(value);
  };

  // Validate password
  const validatePassword = (value) => {
    if (value.length >= 6) {
      setPasswordError("");
    } else {
      setPasswordError("Password must be at least 6 characters");
    }
    setPassword(value);
  };

  const validateConfirmPassword = (value) => {
    setConfirmPassword(value);
    if (value !== password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    // Final validation check before submission
    let hasError = false;
    
    if (!name) {
      setNameError("Name is required");
      hasError = true;
    }
    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      hasError = true;
    }
    if (!isTermsAccepted) {
      setTermsError("You must accept the Terms & Conditions");
      hasError = true;
    }

    if (hasError) {
      setError("Please correct the errors before proceeding");
      return;
    }

    try {
      const response = await registerUser({
        username: name,
        email,
        password,
        confirmPassword,
      });
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };
  return (
    <div>
      <Header />
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-lg bg-white p-12 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Register your account
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => validateName(e.target.value)}
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-[#f3f3f3] ${
                  isNameFocused ? "text-black" : "text-gray-500"
                }`}
                placeholder="Enter your name"
                required
              />
              {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-[#f3f3f3] ${
                  isEmailFocused ? "text-black" : "text-gray-500"
                }`}
                placeholder="Enter your email address"
                required
              />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => validatePassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-[#f3f3f3] ${
                  isPasswordFocused ? "text-black" : "text-gray-500"
                }`}
                placeholder="Enter your password"
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => validateConfirmPassword(e.target.value)}
                onFocus={() => setIsConfirmPasswordFocused(true)}
                onBlur={() => setIsConfirmPasswordFocused(false)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-[#f3f3f3] ${
                  isConfirmPasswordFocused ? "text-black" : "text-gray-500"
                }`}
                placeholder="Confirm your password"
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isTermsAccepted}
                  onChange={(e) => setIsTermsAccepted(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-gray-700">
                  Accept Terms & Conditions
                </span>
              </label>
              {termsError && (
                <p className="text-red-500 text-sm">{termsError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#403F3F] text-white py-2 px-4 rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >
              Register
            </button>

            <p className="text-center mt-4 text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#403F3F] hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
