import { useState, useRef } from "react";
import ProfileModal from "./profileModel.jsx";

const BellIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function Navbar({ user, onUpdateUser }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropdownRef = useRef(null);

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 220, right: 0, height: 60,
        background: "#fff", borderBottom: "1px solid #f0f0f5",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", zIndex: 100,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#f5f5fa", borderRadius: 8, padding: "7px 14px",
          width: 260, border: "1px solid #ebebf5",
        }}>
          <span style={{ color: "#aaa" }}><SearchIcon /></span>
          <input
            placeholder="Search the catalog..."
            style={{
              border: "none", background: "transparent", outline: "none",
              fontSize: 12.5, color: "#374151", width: "100%",
            }}
          />
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* Bell */}
          <div style={{ position: "relative", cursor: "pointer" }}>
            <span style={{ color: "#9ca3af" }}><BellIcon /></span>
            <span style={{
              position: "absolute", top: -3, right: -3,
              width: 8, height: 8, borderRadius: "50%",
              background: "#ef4444", border: "1.5px solid #fff",
            }} />
          </div>

          {/* Profile */}
          <div
            ref={dropdownRef}
            style={{ position: "relative" }}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button
              onClick={() => setShowDropdown((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "none", border: "none", cursor: "pointer",
                padding: "4px 8px", borderRadius: 10,
                transition: "background .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5fa")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {/* Avatar */}
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb" }}
                />
              ) : (
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 12, fontWeight: 700,
                }}>
                  {initials}
                </div>
              )}
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>{user.name}</div>
                <div style={{ fontSize: 10.5, color: "#9ca3af" }}>{user.id}</div>
              </div>
              <span style={{ color: "#9ca3af", marginLeft: 2 }}><ChevronDown /></span>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div style={{
                position: "absolute", right: 0, top: "calc(100% + 6px)",
                background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)", minWidth: 175, zIndex: 200,
                overflow: "hidden",
              }}>
                <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{user.name}</div>
                  <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 2 }}>{user.role}</div>
                </div>
                {[
                  { label: "Edit Profile", icon: "✏️", action: () => { setShowDropdown(false); setShowProfileModal(true); } },
                  { label: "Settings", icon: "⚙️", action: () => {} },
                  { label: "Help & Support", icon: "❓", action: () => {} },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    style={{
                      width: "100%", padding: "9px 14px", background: "none", border: "none",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 9,
                      fontSize: 12.5, color: "#374151", textAlign: "left",
                      transition: "background .15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
                <div style={{ borderTop: "1px solid #f3f4f6" }}>
                  <button
                    style={{
                      width: "100%", padding: "9px 14px", background: "none", border: "none",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 9,
                      fontSize: 12.5, color: "#ef4444", textAlign: "left",
                      transition: "background .15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showProfileModal && (
        <ProfileModal
          user={user}
          onSave={(updated) => { onUpdateUser(updated); setShowProfileModal(false); }}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
}