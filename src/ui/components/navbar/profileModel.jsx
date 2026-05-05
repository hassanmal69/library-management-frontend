import { useState, useRef } from "react";

const XIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CameraIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);

export default function ProfileModal({ user, onSave, onClose }) {
  const [form, setForm] = useState({ name: user.name, role: user.role, avatarUrl: user.avatarUrl || "" });
  const [preview, setPreview] = useState(user.avatarUrl || null);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  const initials = form.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, avatar: "Please select a valid image file." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setForm((f) => ({ ...f, avatarUrl: ev.target.result }));
      setErrors((p) => ({ ...p, avatar: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    else if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";
    if (!form.role.trim()) errs.role = "Role is required.";
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({ ...user, name: form.name.trim(), role: form.role.trim(), avatarUrl: form.avatarUrl });
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, backdropFilter: "blur(4px)",
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 16, width: 420, maxWidth: "92vw",
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 22px 16px",
          borderBottom: "1px solid #f3f4f6",
          background: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Edit Profile</div>
            <div style={{ fontSize: 11.5, color: "#7c3aed", marginTop: 2 }}>Update your name and photo</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
              cursor: "pointer", color: "#6b7280", display: "flex", padding: 6,
              transition: "all .15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.color = "#111827"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280"; }}
          >
            <XIcon />
          </button>
        </div>

        <div style={{ padding: "22px 22px 20px" }}>
          {/* Avatar Upload */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 22 }}>
            <div style={{ position: "relative" }}>
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #e5e7eb" }}
                />
              ) : (
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 26, fontWeight: 700,
                  border: "3px solid #e5e7eb",
                }}>
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 26, height: 26, borderRadius: "50%",
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                  border: "2px solid #fff", display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", color: "#fff",
                }}
              >
                <CameraIcon />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                marginTop: 10, fontSize: 12, color: "#6366f1", background: "none",
                border: "none", cursor: "pointer", fontWeight: 500,
              }}
            >
              Upload new photo
            </button>
            {errors.avatar && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{errors.avatar}</p>}
            {preview && (
              <button
                onClick={() => { setPreview(null); setForm((f) => ({ ...f, avatarUrl: "" })); }}
                style={{ marginTop: 4, fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
              >
                Remove photo
              </button>
            )}
          </div>

          {/* Name */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors((p) => ({ ...p, name: undefined })); }}
              style={{
                width: "100%", padding: "9px 12px",
                border: `1.5px solid ${errors.name ? "#ef4444" : "#e5e7eb"}`,
                borderRadius: 8, fontSize: 13, color: "#374151", outline: "none",
                boxSizing: "border-box", background: errors.name ? "#fff8f8" : "#fff",
                transition: "border-color .2s",
              }}
              onFocus={(e) => { if (!errors.name) e.target.style.borderColor = "#6366f1"; }}
              onBlur={(e) => { if (!errors.name) e.target.style.borderColor = "#e5e7eb"; }}
            />
            {errors.name && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{errors.name}</p>}
          </div>

          {/* Role */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
              Role / Title
            </label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => { setForm((f) => ({ ...f, role: e.target.value })); setErrors((p) => ({ ...p, role: undefined })); }}
              style={{
                width: "100%", padding: "9px 12px",
                border: `1.5px solid ${errors.role ? "#ef4444" : "#e5e7eb"}`,
                borderRadius: 8, fontSize: 13, color: "#374151", outline: "none",
                boxSizing: "border-box", background: errors.role ? "#fff8f8" : "#fff",
              }}
              onFocus={(e) => { if (!errors.role) e.target.style.borderColor = "#6366f1"; }}
              onBlur={(e) => { if (!errors.role) e.target.style.borderColor = "#e5e7eb"; }}
            />
            {errors.role && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{errors.role}</p>}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: "10px", border: "1.5px solid #e5e7eb", borderRadius: 9,
                background: "#fff", fontSize: 13, fontWeight: 600, color: "#6b7280",
                cursor: "pointer", transition: "all .15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.background = "#f9fafb"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fff"; }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                flex: 2, padding: "10px",
                background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600,
                color: "#fff", cursor: "pointer",
                boxShadow: "0 4px 14px rgba(99,102,241,.32)",
                transition: "opacity .2s, transform .1s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = ".9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}