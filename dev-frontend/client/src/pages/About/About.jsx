import React from "react";
import { Header } from "../shared/Header/Header";
import BreakingNews from "../Home/BreakingNews";
import { Navbar } from "../shared/Navbar/Navbar";

import aidul from '../../assets/aidul.jpg';
import sadidur from '../../assets/sadidur.jpg';
import anis from '../../assets/anis.jpg';
import ivan from '../../assets/ivan.jpg';

export const About = () => {
  return (
    <>
      <Header></Header>
      <BreakingNews></BreakingNews>
      <Navbar></Navbar>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl text-center mb-6">About OmaNews</h1>
        <p className="text-lg text-gray-600 text-center mb-10 leading-relaxed">
          OmaNews is a cutting-edge news platform that delivers the latest
          updates with integrated sentiment analysis to help readers understand
          the tone of each story. Our mission is to provide insights beyond the
          headlines, helping users stay informed with data-driven perspectives.
        </p>

        <h2 className="text-2xl text-center mb-8">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
              src={aidul}
              alt="aidul"
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-2xl font-bold text-blue-600 mb-2">
              Md Aidul Islam
            </h3>
            <p className="text-sm font-medium text-gray-500 mb-4">
              Frontend Engineer
            </p>
            <p className="text-gray-600 leading-relaxed">
              Md Aidul specializes in crafting interactive user interfaces and
              seamless user experiences for OmaNews. With a focus on modern
              frontend frameworks, he ensures the website is fast, responsive,
              and accessible.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
              src={sadidur} // Replace with actual image URL for Ivan Perov
              alt="sadidur"
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-2xl font-bold text-blue-600 mb-2">
              Sadidur Rahman Shaikat
            </h3>
            <p className="text-sm font-medium text-gray-500 mb-4">
              Frontend Engineer
            </p>
            <p className="text-gray-600 leading-relaxed">
              Sadidur contributes to the frontend development of OmaNews,
              focusing on performance optimization and design consistency. His
              attention to detail ensures that every user interaction feels
              intuitive and engaging.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
              src={anis} // Replace with actual image URL for Ivan Perov
              alt="anis"
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-2xl font-bold text-blue-600 mb-2">
              Anis Mahmud
            </h3>
            <p className="text-sm font-medium text-gray-500 mb-4">
              Backend Engineer
            </p>
            <p className="text-gray-600 leading-relaxed">
              Anis is a backend engineer responsible for developing the APIs
              that power OmaNews’s real-time data and sentiment analysis
              features. His work guarantees secure and efficient data handling.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
              src={ivan}
              alt="Ivan Perov"
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-2xl font-bold text-blue-600 mb-2">
              Ivan Perov
            </h3>
            <p className="text-sm font-medium text-gray-500 mb-4">
              Backend Engineer
            </p>
            <p className="text-gray-600 leading-relaxed">
              Ivan manages the server infrastructure and implements the
              algorithms behind sentiment analysis. His expertise in data
              science and backend development ensures robust data processing and
              analysis.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
