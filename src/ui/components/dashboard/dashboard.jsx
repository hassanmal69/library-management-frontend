import { useState, useEffect } from "react";
import { getUserStats } from "../../services/users";
import { getBooks } from "../../services/book";

// ─── Stat Card Component ────────────────────────────────────────────────────
function StatCard({ label, value, change, changeType, iconBg, icon }) {
  return (
    <div className="bg-white rounded-xl px-5 py-4 shadow-sm flex-1 min-w-0 border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${iconBg}`}>{icon}</div>
      </div>
      <p className="text-2xl font-extrabold text-gray-900 leading-none mb-1.5">{value}</p>
      {change && (
        <p className={`text-[11px] font-semibold ${changeType === "up" ? "text-emerald-500" : "text-red-500"}`}>
          {change}
        </p>
      )}
    </div>
  );
}

function SectionCard({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: "18px 18px",
      border: "1px solid #f0f0f5", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Badge({ children, color = "#22c55e" }) {
  return (
    <span style={{
      fontSize: 9.5, fontWeight: 700, letterSpacing: "0.5px",
      padding: "2.5px 8px", borderRadius: 20,
      background: color + "1a", color,
      textTransform: "uppercase",
    }}>
      {children}
    </span>
  );
}

function ActivityItem({ icon, iconBg, title, sub, time, isOverdue }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "10px 0", borderBottom: "1px solid #f9fafb",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, fontSize: 14,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12.5, fontWeight: isOverdue ? 600 : 500,
          color: isOverdue ? "#dc2626" : "#111827",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {title}
        </div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ fontSize: 10.5, color: "#9ca3af", flexShrink: 0 }}>{time}</div>
    </div>
  );
}

function CatalogRow({ color, label, pct }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        border: `3.5px solid ${color}`,
        background: "transparent", flexShrink: 0,
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{label}</div>
        <div style={{
          marginTop: 4, height: 4, borderRadius: 99, background: "#f3f4f6", overflow: "hidden",
        }}>
          <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99 }} />
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", flexShrink: 0 }}>{pct}%</div>
    </div>
  );
}

// ─── SVG Borrowing Trend Sparkline ───────────────────────────────────────────
function TrendChart() {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"];
  const points = [30, 55, 45, 80, 60, 90];
  const W = 380, H = 100;
  const pad = { l: 10, r: 10, t: 10, b: 16 };
  const xStep = (W - pad.l - pad.r) / (points.length - 1);
  const yRange = [20, 100];

  const toX = (i) => pad.l + i * xStep;
  const toY = (v) => H - pad.b - ((v - yRange[0]) / (yRange[1] - yRange[0])) * (H - pad.t - pad.b);

  const path = points.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");
  const area = path + ` L ${toX(points.length - 1)} ${H - pad.b} L ${toX(0)} ${H - pad.b} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 100, display: "block" }}>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#grad)" />
      <path d={path} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r="3.5" fill="#6366f1" stroke="#fff" strokeWidth="2" />
      ))}
      {months.map((m, i) => (
        <text key={i} x={toX(i)} y={H - 1} textAnchor="middle" fontSize="9" fill="#9ca3af">{m}</text>
      ))}
    </svg>
  );
}

// ─── Dashboard Page with API Integration ─────────────────────────────────────
export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeToday: 0,
    pendingApprovals: 0,
    blockedUsers: 0,
  });
  const [booksCount, setBooksCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch user stats
        const userStats = await getUserStats();
        if (userStats && !userStats.error) {
          setStats({
            totalMembers: userStats.totalMembers || 0,
            activeToday: userStats.activeToday || 0,
            pendingApprovals: userStats.pendingApprovals || 0,
            blockedUsers: userStats.blockedUsers || 0,
          });
        }

        // Fetch books count
        const books = await getBooks();
        if (books && Array.isArray(books)) {
          setBooksCount(books.length);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "28px 28px 32px", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 4, height: 38, background: "linear-gradient(180deg,#4f46e5,#7c3aed)", borderRadius: 99 }} />
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.1 }}>
                System Overview
              </h1>
              <p style={{ fontSize: 12.5, color: "#9ca3af", margin: "4px 0 0" }}>
                Curating the collective intelligence of the Atelier.
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button style={{
            padding: "8px 16px", border: "1.5px solid #e5e7eb", borderRadius: 9,
            background: "#fff", fontSize: 12.5, fontWeight: 600, color: "#374151", cursor: "pointer",
          }}>
            Export Report
          </button>
          <button style={{
            padding: "8px 18px", border: "none", borderRadius: 9,
            background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
            fontSize: 12.5, fontWeight: 600, color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7,
            boxShadow: "0 4px 14px rgba(99,102,241,.30)",
          }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            New Acquisition
          </button>
        </div>
      </div>

      {/* Stat Cards - Dynamic from API */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <StatCard
          label="Total Books"
          value={booksCount.toLocaleString()}
          change="+8.2%"
          changeType="up"
          iconBg="rgba(99,102,241,0.10)"
          icon={<svg width="16" height="16" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>}
        />
        <StatCard
          label="Active Users"
          value={stats.activeToday.toLocaleString()}
          change="+16.5%"
          changeType="up"
          iconBg="rgba(124,58,237,0.10)"
          icon={<svg width="16" height="16" fill="none" stroke="#7c3aed" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>}
        />
        <StatCard
          label="Pending Approvals"
          value={stats.pendingApprovals.toLocaleString()}
          change={stats.pendingApprovals > 0 ? "Action Required" : "All Clear"}
          changeType={stats.pendingApprovals > 0 ? "down" : "up"}
          iconBg="rgba(249,115,22,0.10)"
          icon={<svg width="16" height="16" fill="none" stroke="#f97316" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>}
        />
        <StatCard
          label="Total Members"
          value={stats.totalMembers.toLocaleString()}
          change="Active"
          changeType="up"
          iconBg="rgba(239,68,68,0.10)"
          icon={<svg width="16" height="16" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>}
        />
      </div>

      {/* Mid row: Trends + Catalog Mix */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        {/* Borrowing Trends */}
        <SectionCard style={{ flex: "1 1 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Borrowing Trends</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Circulation activity over the last 6 months</div>
            </div>
            <button style={{
              padding: "5px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8,
              background: "#fff", fontSize: 11.5, fontWeight: 500, color: "#374151", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              Monthly View
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>
          <TrendChart />
        </SectionCard>

        {/* Catalog Mix */}
        <SectionCard style={{ width: 230, flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 2 }}>Catalog Mix</div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 14 }}>Category distribution</div>
          <CatalogRow color="#6366f1" label="Academic & Research" pct={46} />
          <CatalogRow color="#a78bfa" label="Fiction & Lit" pct={30} />
          <CatalogRow color="#f97316" label="Digital Media" pct={25} />
          <button style={{
            width: "100%", marginTop: 6, padding: "8px 0", border: "1.5px solid #e5e7eb",
            borderRadius: 8, background: "#fff", fontSize: 12, fontWeight: 600,
            color: "#6366f1", cursor: "pointer",
          }}>
            View Deep Catalog
          </button>
        </SectionCard>
      </div>

      {/* Bottom row: Activity + Librarian Insight */}
      <div style={{ display: "flex", gap: 14 }}>
        {/* System Activity */}
        <SectionCard style={{ flex: "1 1 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>System Activity</div>
            <Badge color="#22c55e">Live Updates</Badge>
          </div>
          <ActivityItem
            icon="👤" iconBg="#f0fdf4"
            title="New user registered"
            sub={`${stats.pendingApprovals} pending approvals waiting`}
            time="Recently"
          />
          <ActivityItem
            icon="📚" iconBg="#f0f0ff"
            title={`${booksCount} total books in catalog`}
            sub="Manage collection"
            time="Updated"
          />
          <ActivityItem
            icon="⚡" iconBg="#fff5f5"
            title={`${stats.activeToday} active users today`}
            sub="Normal traffic flow"
            time="Live"
            isOverdue={false}
          />
        </SectionCard>

        {/* Librarian Insight */}
        <div style={{
          width: 230, flexShrink: 0, borderRadius: 12, padding: "18px 18px 16px",
          background: "linear-gradient(145deg,#4f46e5 0%,#7c3aed 100%)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -28, right: -28, width: 100, height: 100,
            borderRadius: "50%", background: "rgba(255,255,255,0.08)",
          }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Librarian Insight</div>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#fff", fontSize: 14, cursor: "pointer",
            }}>+</div>
          </div>
          <p style={{ fontSize: 12, color: "rgba(221,214,254,0.90)", lineHeight: 1.65, margin: "0 0 18px" }}>
            The library has <strong style={{ color: "#fff" }}>{stats.totalMembers} total members</strong> with{" "}
            <strong style={{ color: "#fff" }}>{stats.pendingApprovals} pending approvals</strong>.{" "}
            Consider reviewing pending registrations.
          </p>
          <button style={{
            width: "100%", padding: "9px 0", border: "1.5px solid rgba(255,255,255,0.3)",
            borderRadius: 9, background: "rgba(255,255,255,0.12)",
            fontSize: 12.5, fontWeight: 600, color: "#fff", cursor: "pointer",
            transition: "background .15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}