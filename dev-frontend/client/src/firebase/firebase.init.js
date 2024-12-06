// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  authDomain: "oma-news.firebaseapp.com",
  projectId: "oma-news",
  storageBucket: "oma-news.appspot.com",
  messagingSenderId: "158374393810",
  appId: "1:158374393810:web:3d2c004437bb71adb4fa0b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
