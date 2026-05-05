import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../navbar/navbar.jsx";
import Sidebar from "../sidebar/sidebar.jsx";
import { useState } from "react";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname.replace("/", "") || "dashboard";

  const [user, setUser] = useState({
    name: "Julian Thomas",
    id: "LBN#A4512",
    role: "Head Librarian",
    avatarUrl: "",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5fa" }}>
      <Sidebar activePage={activePage} onNavigate={(id) => navigate(id === "dashboard" ? "/" : `/${id}`)} />
      <Navbar user={user} onUpdateUser={setUser} />
      <main style={{ marginLeft: 220, paddingTop: 60 }}>
        <Outlet /> 
      </main>
    </div>
  );
}