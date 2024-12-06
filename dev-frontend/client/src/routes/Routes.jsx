import { createBrowserRouter } from "react-router-dom";
import Root from "../layouts/Root";
import { Home } from "../pages/Home/Home";
import { Login } from "../pages/Login/Login";
import NewsPage from "../pages/NewsPage/NewsPage";
import Profile from "../pages/Profile/Profile";
import { Register } from "../pages/Register/Register";
import Statistics from "../pages/Statistics/Statistics";
import { About } from "../pages/About/About";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/statistics",
        element: <Statistics></Statistics>,
      },
      {
        path: "/news/:id", // Dynamic route for single news
        element: <NewsPage></NewsPage>,
      },
      {
        path: "/login", // Route for Login
        element: <Login></Login>, // Specify the Login component here
      },
      {
        path: "/register", // Route for Login
        element: <Register></Register>, // Specify the Login component here
      },
      {
        path: "/profile", // Route for Login
        element: <Profile></Profile>, // Specify the Login component here
      },
      {
        path: "/about", // Route for Login
        element: <About></About>, // Specify the Login component here
      },
    ],
  },
]);

export default routes;
