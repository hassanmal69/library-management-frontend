/**
 * StatCard — reusable metric card used on the dashboard.
 *
 * Props:
 *  label      string   — e.g. "TOTAL BOOKS"
 *  value      string   — e.g. "24,500"
 *  change     string   — e.g. "+12%" (optional)
 *  changeType "up"|"down"|"warn"  — colour hint
 *  icon       ReactNode
 *  iconBg     string   — CSS background for icon wrapper
 */
export default function StatCard({ label, value, change, changeType = "up", icon, iconBg }) {
  const changePalette = {
    up:   { color: "#22c55e", bg: "#f0fdf4" },
    down: { color: "#ef4444", bg: "#fff5f5" },
    warn: { color: "#f59e0b", bg: "#fffbeb" },
  };
  const cp = changePalette[changeType] ?? changePalette.up;

  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: "16px 18px",
      border: "1px solid #f0f0f5", flex: 1, minWidth: 0,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      transition: "box-shadow .2s, transform .2s",
      cursor: "default",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = "0 6px 20px rgba(79,70,229,0.10)";
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: iconBg || "rgba(79,70,229,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icon}
        </div>
        {change && (
          <span style={{
            fontSize: 10, fontWeight: 600, padding: "2px 7px",
            borderRadius: 20, background: cp.bg, color: cp.color,
          }}>
            {change}
          </span>
        )}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", lineHeight: 1.1, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.6px" }}>
        {label}
      </div>
    </div>
  );
}