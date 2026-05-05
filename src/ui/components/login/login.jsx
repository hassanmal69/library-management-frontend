import { useState } from "react";

const EyeIcon = ({ open }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const avatarColors = ["#e879f9", "#818cf8", "#34d399"];
const avatarInitials = ["A", "B", "C"];

export default function IntellectualAtelierLogin() {
  const [form, setForm] = useState({ role: "Student", email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      errs.password = "Password is required.";
    } else if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <div
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f3f8", padding: "24px" }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "900px",
          minHeight: "540px",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(60,40,120,0.22), 0 2px 8px rgba(0,0,0,0.10)",
        }}
      >
        {/* ── LEFT PANEL ── */}
        <div
          style={{
            flex: "0 0 52%",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "32px 36px 28px",
          }}
        >
          {/* Architectural background */}
          <div
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, #1a0a4a 0%, #3b1fa3 40%, #5b30d6 70%, #7c3aed 100%)",
            }}
          />
          {/* Building grid overlay */}
          <div
            style={{
              position: "absolute", inset: 0, opacity: 0.18,
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 38px, rgba(255,255,255,0.35) 38px, rgba(255,255,255,0.35) 39px), repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(255,255,255,0.35) 38px, rgba(255,255,255,0.35) 39px)`,
            }}
          />
          {/* Noise grain */}
          <div
            style={{
              position: "absolute", inset: 0, opacity: 0.06,
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "200px 200px",
            }}
          />
          {/* Decorative blob */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: 60, left: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)" }} />

          {/* Logo */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: 34, height: 34, borderRadius: "8px",
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(8px)",
            }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "13px", letterSpacing: "0.5px" }}>IA</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px", fontWeight: 500, letterSpacing: "0.3px", fontFamily: "Georgia, serif" }}>
              Intellectual Atelier
            </span>
          </div>

          {/* Headline */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{
              color: "#ffffff", fontSize: "26px", fontWeight: 700, lineHeight: 1.25,
              margin: "0 0 14px", letterSpacing: "-0.3px", fontFamily: "Georgia, serif",
            }}>
              Curating Knowledge,<br />Fostering Focus.
            </h1>
            <p style={{
              color: "rgba(199,185,255,0.85)", fontSize: "12.5px", lineHeight: 1.65,
              margin: 0, maxWidth: "280px", fontFamily: "'Georgia', serif",
            }}>
              Welcome to The Digital Curator. A sophisticated space for the modern academic to organize, discover, and expand their horizons.
            </p>
          </div>

          {/* Bottom avatars */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex" }}>
              {avatarColors.map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: c, border: "2px solid rgba(255,255,255,0.7)",
                    marginLeft: i === 0 ? 0 : -8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: 700, color: "#fff",
                  }}
                >
                  {avatarInitials[i]}
                </div>
              ))}
            </div>
            <span style={{ color: "rgba(210,200,255,0.85)", fontSize: "11.5px" }}>
              Joined by <strong style={{ color: "#fff" }}>2,000+</strong> Researchers
            </span>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "36px 40px 24px",
          }}
        >
          {submitted ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5} style={{ width: 28, height: 28 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1e1b4b", marginBottom: 8 }}>Access Granted!</h2>
              <p style={{ fontSize: "13px", color: "#6b7280" }}>Redirecting to your workspace…</p>
              <button onClick={() => setSubmitted(false)} style={{ marginTop: 22, fontSize: "12px", color: "#6366f1", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Back to sign in
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {/* Header */}
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 6px", fontFamily: "Georgia, serif" }}>
                  Sign in to your account
                </h2>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, lineHeight: 1.5 }}>
                  Manage your collection and academic<br />resources.
                </p>
              </div>

              {/* Access Role */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  Access Role
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    style={{
                      width: "100%", padding: "9px 34px 9px 12px",
                      border: "1.5px solid #e5e7eb", borderRadius: "8px",
                      fontSize: "13px", color: "#374151", background: "#fff",
                      appearance: "none", WebkitAppearance: "none", cursor: "pointer",
                      outline: "none", boxSizing: "border-box",
                    }}
                  >
                    <option>Student</option>
                    <option>Faculty</option>
                    <option>Researcher</option>
                    <option>Administrator</option>
                    <option>Librarian</option>
                  </select>
                  <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }}>
                    <ChevronIcon />
                  </span>
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  Email Address
                </label>
                <input
                  name="email"
                  type="text"
                  placeholder="name@institution.edu"
                  value={form.email}
                  onChange={handleChange}
                  style={{
                    width: "100%", padding: "9px 12px",
                    border: `1.5px solid ${errors.email ? "#ef4444" : "#e5e7eb"}`,
                    borderRadius: "8px", fontSize: "13px", color: "#374151",
                    outline: "none", boxSizing: "border-box",
                    background: errors.email ? "#fff5f5" : "#fff",
                    transition: "border-color 0.2s",
                  }}
                />
                {errors.email && (
                  <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#ef4444" }}>{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>Password</label>
                  <button
                    type="button"
                    style={{ fontSize: "11px", color: "#6366f1", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    style={{
                      width: "100%", padding: "9px 38px 9px 12px",
                      border: `1.5px solid ${errors.password ? "#ef4444" : "#e5e7eb"}`,
                      borderRadius: "8px", fontSize: "13px", color: "#374151",
                      outline: "none", boxSizing: "border-box",
                      background: errors.password ? "#fff5f5" : "#fff",
                      transition: "border-color 0.2s",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    style={{
                      position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0,
                    }}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password && (
                  <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#ef4444" }}>{errors.password}</p>
                )}
              </div>

              {/* Remember me */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "14px 0 20px" }}>
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={handleChange}
                  style={{ width: 14, height: 14, accentColor: "#6366f1", cursor: "pointer" }}
                />
                <label htmlFor="remember" style={{ fontSize: "12px", color: "#6b7280", cursor: "pointer" }}>
                  Keep me signed in for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                style={{
                  width: "100%", padding: "11px 20px",
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  color: "#fff", border: "none", borderRadius: "9px",
                  fontSize: "13.5px", fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  letterSpacing: "0.2px",
                  boxShadow: "0 4px 18px rgba(99,102,241,0.38)",
                  transition: "opacity 0.2s, transform 0.1s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.92"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0px)"; }}
              >
                Access Workspace <ArrowRightIcon />
              </button>

              {/* Register link */}
              <p style={{ textAlign: "center", fontSize: "11.5px", color: "#9ca3af", marginTop: "16px" }}>
                Don't have an institutional account?{" "}
                <button style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 600, cursor: "pointer", fontSize: "11.5px", padding: 0 }}>
                  Contact Registrar
                </button>
              </p>
            </div>
          )}

          {/* Footer nav */}
          <div style={{
            borderTop: "1px solid #f3f4f6", paddingTop: "14px", marginTop: "8px",
            display: "flex", justifyContent: "center", gap: "22px",
          }}>
            {["ARCHIVE", "COLLECTIONS", "POLICIES", "SUPPORT"].map((item) => (
              <button
                key={item}
                style={{
                  fontSize: "9.5px", fontWeight: 600, color: "#d1d5db",
                  background: "none", border: "none", cursor: "pointer",
                  letterSpacing: "1px", padding: 0,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}