import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/layout.jsx";
import Dashboard from "./components/dashboard/dashboard.jsx";
import Login from "./components/login/login.jsx";
import BookManagement from "./components/books/books.jsx";
import UsersManagement from "./components/users/user.jsx";
import SearchCatalog from "./components/searchBooks/search.jsx";
import CirculationDesk from "./components/circulationDesk/circulation.jsx";
import PlatformSettings from "./components/settings/setting.jsx";
import Notworking from "./components/notworking/notworking.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "users", element: <UsersManagement /> },
      { path: "books", element: <BookManagement /> },
      { path: "catalog", element: <SearchCatalog /> },
      { path: "issue", element: <CirculationDesk /> },
      { path: "settings", element: <PlatformSettings /> },
      { path: "notifications", element: <Notworking /> },
      { path: "reports", element: <Notworking /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  }
]);

export default router;