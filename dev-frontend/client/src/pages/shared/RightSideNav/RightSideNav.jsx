import React, { useEffect, useState } from "react";
import { FaFacebookF, FaGoogle, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../../../firebase/firebase.init";

const RightSideNav = ({ setUser }) => {
  const [user, setLoggedInUser] = useState(null);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setLoggedInUser(storedUser); // Set the logged-in user state
    }
  }, []);

  const handleGoogleSignIn = () => {
    console.log("google sign in");
    signInWithPopup(auth, provider)
      .then((result) => {
        const loggedInUser = result.user;
        const { displayName, email, photoURL } = loggedInUser;

        const userInfo = {
          name: displayName,
          email: email,
          profilePhoto: photoURL,
        };

        setUser(userInfo);
        setLoggedInUser(userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo));
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div>
      {!user && (
        <div className="p-4 space-y-3 mb-6">
          <h2 className="font-bold">Login With</h2>
          <button
            className="btn btn-outline w-full"
            onClick={handleGoogleSignIn}
          >
            <FaGoogle />
            Login with Google
          </button>
          <button className="btn btn-outline w-full">
            <FaFacebookF />
            Login with Facebook
          </button>
        </div>
      )}
      <div className="p-4 space-y-3 mb-6">
        <h2 className="font-bold">Find us On</h2>
        <Link
          className="btn btn-outline btn-error w-full"
          to="https://instagram.com"
          target="blank"
        >
          <FaInstagram />
          Instagram
        </Link>
        <Link
          className="btn btn-outline btn-info w-full"
          to="https://facebook.com"
          target="blank"
        >
          <FaFacebookF />
          Facebook
        </Link>
        <Link
          className="btn btn-outline btn-warning w-full"
          to="https://twitter.com"
          target="blank"
        >
          <FaTwitter />
          Twitter
        </Link>
      </div>
      <div></div>
    </div>
  );
};

export default RightSideNav;
