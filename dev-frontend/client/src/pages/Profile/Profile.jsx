import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../shared/Header/Header";
import { Navbar } from "../shared/Navbar/Navbar";
import { getAuth, signOut } from "firebase/auth";

const Profile = () => {
  const location = useLocation();
  const auth = getAuth();
  const navigate = useNavigate();

  const { user } = location.state || {};
  console.log(user);

  const logout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout Error: ", error.message);
      });
  };

  return (
    <>
      <Header></Header>
      <Navbar></Navbar>
      <div className="min-h-screen flex flex-col items-center">
        <main className="flex-grow max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img
                className="w-full h-full object-cover"
                src={
                  user?.profilePhoto ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                alt={user?.name || "Profile"}
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {user?.name || "User Name"}
            </h2>
            <p className="text-gray-600 mb-2">
              {user?.email || ""}
            </p>
            <div className="flex space-x-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                Edit Profile
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Optional: Additional Information Section */}
          <section className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Additional Information
            </h3>
            <p className="text-gray-600">
              Here you can add any additional information about the user or
              actions related to their account.
            </p>
          </section>
        </main>
      </div>
    </>
  );
};

export default Profile;
