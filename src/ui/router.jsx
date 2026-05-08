import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/layout.jsx";
import Dashboard from "./components/dashboard/dashboard.jsx";
// import Users from "../pages/Users";
// import Books from "../pages/Books";
// import Reports from "../pages/Reports";
// import Settings from "../pages/Settings";
import Login from "./components/login/login.jsx";
import BookManagement from "./components/books/books.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,        
    children: [
      { index: true,            element: <Dashboard /> },
    //   { path: "users",          element: <Users /> },
      { path: "books",          element: <BookManagement /> },
    //   { path: "reports",        element: <Reports /> },
    //   { path: "settings",       element: <Settings /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  }
]);

export default router;