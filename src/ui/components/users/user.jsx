// ============================================================
//  UsersManagement.jsx  –  outlet only (no layout / sidebar)
//  Requires: ConfirmDeleteDialog.jsx  &  EditDialog.jsx
// ============================================================

import { useState, useMemo } from "react";
import ConfirmDeleteDialog from "../dialogue/deleteDialogue.jsx";
import EditDialog      from "../dialogue/editDialogue.jsx";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function exportCSV(users) {
  const headers = ["Name", "Email", "User ID", "Role", "Status"];
  const rows    = users.map((u) => [u.name, u.email, u.userId, u.role, u.status]);
  const csv     = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob    = new Blob([csv], { type: "text/csv" });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement("a");
  a.href        = url;
  a.download    = "users_export.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────
// 1. STAT CARD
// ─────────────────────────────────────────────────────────────
/**
 * @param {string} label
 * @param {string} value
 * @param {string} sub       – small subtitle line
 * @param {string} subColor  – tailwind text color class
 * @param {React.ReactNode} icon
 * @param {string} iconBg    – tailwind bg class
 */
function StatCard({ label, value, sub, subColor = "text-emerald-500", icon, iconBg = "bg-indigo-50" }) {
  return (
    <div className="bg-white rounded-xl px-5 py-4 shadow-sm flex-1 min-w-0 border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${iconBg}`}>{icon}</div>
      </div>
      <p className="text-2xl font-extrabold text-gray-900 leading-none mb-1.5">{value}</p>
      {sub && <p className={`text-[11px] font-semibold ${subColor}`}>{sub}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. ROLE BADGE
// ─────────────────────────────────────────────────────────────
const roleStyle = {
  Student:   "bg-indigo-100 text-indigo-700",
  Admin:     "bg-gray-800   text-white",
  Librarian: "bg-violet-100 text-violet-700",
  Faculty:   "bg-amber-100  text-amber-700",
  Guest:     "bg-gray-100   text-gray-500",
};

function RoleBadge({ role }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${roleStyle[role] || "bg-gray-100 text-gray-500"}`}>
      {role}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. STATUS BADGE
// ─────────────────────────────────────────────────────────────
const statusStyle = {
  Active:  { dot: "bg-emerald-500", text: "text-emerald-600" },
  Blocked: { dot: "bg-red-500",     text: "text-red-600"     },
  Pending: { dot: "bg-amber-400",   text: "text-amber-600"   },
};

function StatusBadge({ status }) {
  const s = statusStyle[status] || { dot: "bg-gray-400", text: "text-gray-500" };
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      <span className={`text-xs font-semibold ${s.text}`}>{status}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. USER AVATAR
// ─────────────────────────────────────────────────────────────
const avatarColors = [
  "from-indigo-400 to-violet-500",
  "from-emerald-400 to-teal-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-sky-400 to-cyan-500",
  "from-purple-400 to-fuchsia-500",
];

function UserAvatar({ name, colorIndex = 0, size = "w-9 h-9" }) {
  const initials = name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "??";
  const gradient = avatarColors[colorIndex % avatarColors.length];
  return (
    <div className={`${size} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {initials}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. ROW ACTIONS  (View / Edit / Delete + Block toggle)
// ─────────────────────────────────────────────────────────────
function RowActions({ user, onView, onEdit, onDelete, onToggleBlock }) {
  const isBlocked = user.status === "Blocked";
  return (
    <div className="flex items-center gap-1">
      {/* View */}
      <button onClick={onView} title="View"
        className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </button>
      {/* Edit */}
      <button onClick={onEdit} title="Edit"
        className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 transition-all">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
        </svg>
      </button>
      {/* Block / Unblock */}
      <button onClick={onToggleBlock} title={isBlocked ? "Unblock" : "Block"}
        className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
          isBlocked
            ? "border-emerald-200 bg-emerald-50 text-emerald-500 hover:bg-emerald-100"
            : "border-gray-200 bg-white text-gray-400 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-500"
        }`}>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          {isBlocked
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          }
        </svg>
      </button>
      {/* Delete */}
      <button onClick={onDelete} title="Delete"
        className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-all">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. USER TABLE ROW
// ─────────────────────────────────────────────────────────────
function UserTableRow({ user, index, selected, onSelect, onView, onEdit, onDelete, onToggleBlock }) {
  return (
    <tr className={`border-b border-gray-50 transition-colors ${selected ? "bg-indigo-50/40" : "hover:bg-gray-50/70"}`}>
      {/* Checkbox */}
      <td className="pl-4 pr-2 py-3.5 w-8">
        <input type="checkbox" checked={selected} onChange={onSelect}
          className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 accent-indigo-600 cursor-pointer" />
      </td>
      {/* Member details */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} colorIndex={index} />
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
            <p className="text-[11px] text-gray-400">{user.email}</p>
          </div>
        </div>
      </td>
      {/* User ID */}
      <td className="px-4 py-3.5 font-mono text-[11px] text-gray-400">{user.userId}</td>
      {/* Role */}
      <td className="px-4 py-3.5"><RoleBadge role={user.role} /></td>
      {/* Status */}
      <td className="px-4 py-3.5"><StatusBadge status={user.status} /></td>
      {/* Actions */}
      <td className="px-4 py-3.5">
        <RowActions
          user={user}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleBlock={onToggleBlock}
        />
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. FILTER DROPDOWN
// ─────────────────────────────────────────────────────────────
function FilterDropdown({ label, options, value, onChange, icon }) {
  return (
    <div className="relative flex items-center">
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className="appearance-none border border-gray-200 bg-white rounded-lg pl-8 pr-7 py-1.5 text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300 hover:border-gray-300 transition">
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{icon}</span>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. PAGINATION
// ─────────────────────────────────────────────────────────────
function Pagination({ current, totalPages, totalEntries, perPage, onPageChange }) {
  const from  = (current - 1) * perPage + 1;
  const to    = Math.min(current * perPage, totalEntries);
  const pages = totalPages <= 5
    ? Array.from({ length: totalPages }, (_, i) => i + 1)
    : [1, 2, 3, "…", totalPages];

  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-t border-gray-100 text-xs text-gray-400">
      <span>Showing {from} to {to} of {totalEntries.toLocaleString()} members</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(Math.max(1, current - 1))}
          className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition">‹</button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={i} className="w-7 h-7 flex items-center justify-center text-gray-300">…</span>
          ) : (
            <button key={i} onClick={() => onPageChange(p)}
              className={`w-7 h-7 rounded-md border flex items-center justify-center font-semibold transition ${
                current === p ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}>{p}</button>
          )
        )}
        <button onClick={() => onPageChange(Math.min(totalPages, current + 1))}
          className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition">›</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 9. USER VIEW DRAWER
// ─────────────────────────────────────────────────────────────
function UserViewDrawer({ user, index, onClose, onEdit }) {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(15,17,30,0.35)", backdropFilter: "blur(3px)" }}
      onClick={onClose}>
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col"
        style={{ animation: "slideIn 0.22s cubic-bezier(0.25,0.46,0.45,0.94) both" }}
        onClick={(e) => e.stopPropagation()}>

        <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500" />

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Member Profile</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Avatar + name */}
          <div className="flex flex-col items-center text-center mb-6 pt-2">
            <UserAvatar name={user.name} colorIndex={index} size="w-16 h-16" />
            <h3 className="text-base font-bold text-gray-900 mt-3">{user.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <RoleBadge role={user.role} />
              <StatusBadge status={user.status} />
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-0 divide-y divide-gray-100">
            {[
              { label: "User ID",   value: <span className="font-mono text-xs">{user.userId}</span> },
              { label: "Role",      value: user.role   },
              { label: "Status",    value: user.status },
              { label: "Email",     value: user.email  },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
                <span className="text-sm text-gray-800 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors">
            Close
          </button>
          <button onClick={() => { onClose(); onEdit(user); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all">
            Edit User
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideIn { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 10. RECENT ACTIVITY ITEM
// ─────────────────────────────────────────────────────────────
function ActivityItem({ icon, iconBg, title, sub, time }) {
  return (
    <div className="flex items-start gap-2.5 py-2.5 border-b border-gray-50 last:border-0">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 ${iconBg}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-800 leading-tight">{title}</p>
        {sub && <p className="text-[11px] text-gray-400 truncate">{sub}</p>}
      </div>
      <span className="text-[10px] text-gray-300 font-medium shrink-0 pt-0.5">{time}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: 1, name: "Eleanor Davies",  email: "e.davies@atelier.edu",   userId: "USR-2624-881", role: "Student",   status: "Active"  },
  { id: 2, name: "Marcus Thorne",   email: "m.thorne@atelier.edu",   userId: "USR-2924-112", role: "Admin",     status: "Active"  },
  { id: 3, name: "Sarah Lindgren",  email: "s.lindgren@atelier.edu", userId: "USR-2024-384", role: "Librarian", status: "Blocked" },
  { id: 4, name: "Julian Weber",    email: "j.weber@system.edu",     userId: "USR-2024-712", role: "Student",   status: "Active"  },
  { id: 5, name: "Priya Menon",     email: "p.menon@atelier.edu",    userId: "USR-2024-503", role: "Faculty",   status: "Active"  },
  { id: 6, name: "Daniel Osei",     email: "d.osei@atelier.edu",     userId: "USR-2024-617", role: "Guest",     status: "Pending" },
  { id: 7, name: "Amara Nwosu",     email: "a.nwosu@atelier.edu",    userId: "USR-2024-291", role: "Student",   status: "Active"  },
  { id: 8, name: "Leo Hartmann",    email: "l.hartmann@atelier.edu", userId: "USR-2024-830", role: "Librarian", status: "Active"  },
];

const INITIAL_ACTIVITY = [
  { id: 1, icon: "👤", iconBg: "bg-indigo-50",  title: "New User Registered",    sub: "Eleanor Davies",  time: "2 min ago"  },
  { id: 2, icon: "✏️", iconBg: "bg-violet-50",  title: "Profile Updated",        sub: "Marcus Thorne",   time: "18 min ago" },
  { id: 3, icon: "🔒", iconBg: "bg-amber-50",   title: "Role Updated: Student",  sub: "Julian Weber",    time: "45 min ago" },
];

const PER_PAGE          = 8;
const ROLE_OPTIONS      = ["All Roles", "Student", "Admin", "Librarian", "Faculty", "Guest"];
const STATUS_OPTIONS    = ["Active Status", "Active", "Blocked", "Pending"];

// ─────────────────────────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────────────────────────
export default function UsersManagement() {
  const [users,      setUsers]      = useState(INITIAL_USERS);
  const [activity,   setActivity]   = useState(INITIAL_ACTIVITY);
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statFilter, setStatFilter] = useState("Active Status");
  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);
  const [selected,   setSelected]   = useState(new Set());

  // Dialogs
  const [viewUser,     setViewUser]     = useState(null);
  const [viewIndex,    setViewIndex]    = useState(0);
  const [editUser,     setEditUser]     = useState(null);
  const [editOpen,     setEditOpen]     = useState(false);
  const [deleteUser,   setDeleteUser]   = useState(null);
  const [deleteOpen,   setDeleteOpen]   = useState(false);
  const [bulkDelOpen,  setBulkDelOpen]  = useState(false);

  // ── Activity log helper ──
  const logActivity = (icon, iconBg, title, sub) => {
    setActivity((prev) => [
      { id: Date.now(), icon, iconBg, title, sub, time: now() },
      ...prev.slice(0, 9),
    ]);
  };

  // ── Filtering ──
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const roleOk   = roleFilter === "All Roles"     || u.role   === roleFilter;
      const statOk   = statFilter === "Active Status" || u.status === statFilter;
      const searchOk = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      return roleOk && statOk && searchOk;
    });
  }, [users, roleFilter, statFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const activeCount  = users.filter((u) => u.status === "Active").length;
  const pendingCount = users.filter((u) => u.status === "Pending").length;
  const blockedCount = users.filter((u) => u.status === "Blocked").length;

  // ── Selection helpers ──
  const allSelected  = paginated.length > 0 && paginated.every((u) => selected.has(u.id));
  const someSelected = paginated.some((u) => selected.has(u.id));

  const toggleSelect = (id) =>
    setSelected((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) => { const s = new Set(prev); paginated.forEach((u) => s.delete(u.id)); return s; });
    } else {
      setSelected((prev) => { const s = new Set(prev); paginated.forEach((u) => s.add(u.id)); return s; });
    }
  };

  const clearSelection = () => setSelected(new Set());

  // ── CRUD handlers ──
  const handleSave = (updated) => {
    const isNew = !users.some((u) => u.id === updated.id);
    setUsers((prev) =>
      isNew ? [updated, ...prev] : prev.map((u) => (u.id === updated.id ? updated : u))
    );
    logActivity(
      isNew ? "👤" : "✏️",
      isNew ? "bg-indigo-50" : "bg-violet-50",
      isNew ? "New User Added" : "Profile Updated",
      updated.name
    );
  };

  const handleDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== deleteUser?.id));
    logActivity("🗑️", "bg-red-50", "User Deleted", deleteUser?.name);
    setSelected((prev) => { const s = new Set(prev); s.delete(deleteUser?.id); return s; });
  };

  const handleBulkDelete = () => {
    setUsers((prev) => prev.filter((u) => !selected.has(u.id)));
    logActivity("🗑️", "bg-red-50", `${selected.size} Users Deleted`, "Bulk action");
    clearSelection();
  };

  const handleToggleBlock = (user) => {
    const next = user.status === "Blocked" ? "Active" : "Blocked";
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: next } : u)));
    logActivity(
      next === "Blocked" ? "🔒" : "🔓",
      next === "Blocked" ? "bg-amber-50" : "bg-emerald-50",
      next === "Blocked" ? "User Blocked" : "User Unblocked",
      user.name
    );
  };

  const handleBulkBlock = () => {
    setUsers((prev) => prev.map((u) => selected.has(u.id) ? { ...u, status: "Blocked" } : u));
    logActivity("🔒", "bg-amber-50", `${selected.size} Users Blocked`, "Bulk action");
    clearSelection();
  };

  const openEdit = (user) => { setEditUser(user); setEditOpen(true); };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Users Management</h1>
          <p className="text-sm text-gray-500 mt-0.5 max-w-md">
            Oversee the intellectual community. Monitor access levels, manage member profiles, and ensure institutional security.
          </p>
        </div>
        <button onClick={() => { setEditUser(null); setEditOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New User
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="flex gap-4 mb-6">
        <StatCard label="Total Members"     value={users.length.toLocaleString()} sub="↑ 12% from last month"     subColor="text-emerald-500" icon="👥" iconBg="bg-indigo-50"  />
        <StatCard label="Active Today"      value={activeCount}                   sub="Normal traffic flow"        subColor="text-blue-500"    icon="⚡" iconBg="bg-blue-50"    />
        <StatCard label="Pending Approvals" value={pendingCount}                  sub={pendingCount ? "Action required" : "All clear"} subColor={pendingCount ? "text-amber-500" : "text-emerald-500"} icon="⏳" iconBg="bg-amber-50" />
        <StatCard label="System Health"     value="Secure"                        sub={`${blockedCount} blocked`}  subColor="text-emerald-500" icon="🛡️" iconBg="bg-emerald-50" />
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <FilterDropdown label="Role"   icon="👤" options={ROLE_OPTIONS}   value={roleFilter} onChange={(v) => { setRoleFilter(v); setPage(1); }} />
          <FilterDropdown label="Status" icon="●"  options={STATUS_OPTIONS} value={statFilter} onChange={(v) => { setStatFilter(v); setPage(1); }} />
          {/* Search */}
          <div className="relative">
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email…"
              className="border border-gray-200 bg-white rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-52 transition" />
            <svg className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {someSelected && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">{selected.size} selected</span>
              <button onClick={handleBulkBlock}
                className="flex items-center gap-1.5 border border-amber-200 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-100 transition">
                🔒 Bulk Block
              </button>
              <button onClick={() => setBulkDelOpen(true)}
                className="flex items-center gap-1.5 border border-red-200 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-100 transition">
                🗑️ Delete Selected
              </button>
              <button onClick={clearSelection} className="text-xs text-gray-400 hover:text-gray-600 transition">✕ Clear</button>
            </div>
          )}
          {/* Export CSV */}
          <button onClick={() => exportCSV(filtered)}
            className="flex items-center gap-1.5 border border-gray-200 bg-white text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pl-4 pr-2 py-3 w-8">
                <input type="checkbox" checked={allSelected} ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                  onChange={toggleAll} className="w-3.5 h-3.5 rounded border-gray-300 accent-indigo-600 cursor-pointer" />
              </th>
              {["Member Details", "User ID", "Access Level", "Current Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <p className="text-sm text-gray-400">No members match the current filters.</p>
                  <button onClick={() => { setRoleFilter("All Roles"); setStatFilter("Active Status"); setSearch(""); }}
                    className="mt-2 text-xs text-indigo-500 hover:underline">Clear filters</button>
                </td>
              </tr>
            ) : (
              paginated.map((user, i) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  index={users.indexOf(user)}
                  selected={selected.has(user.id)}
                  onSelect={() => toggleSelect(user.id)}
                  onView={() => { setViewUser(user); setViewIndex(users.indexOf(user)); }}
                  onEdit={() => openEdit(user)}
                  onDelete={() => { setDeleteUser(user); setDeleteOpen(true); }}
                  onToggleBlock={() => handleToggleBlock(user)}
                />
              ))
            )}
          </tbody>
        </table>

        <Pagination
          current={page}
          totalPages={totalPages}
          totalEntries={filtered.length}
          perPage={PER_PAGE}
          onPageChange={setPage}
        />
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4 mt-5">

        {/* Bulk Access Info */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute right-4 bottom-3 text-6xl opacity-5 select-none">⚙️</div>
          <h3 className="text-sm font-bold text-gray-900 mb-1.5">Need help managing bulk access?</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-4 max-w-sm">
            The new security protocols allow for automated role assignment based on institutional ID validation.
            Visit the Security Documentation to learn more.
          </p>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition inline-flex items-center gap-1">
            Learn more about automation →
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Live</span>
          </div>
          <div className="space-y-0">
            {activity.slice(0, 5).map((a) => (
              <ActivityItem key={a.id} icon={a.icon} iconBg={a.iconBg} title={a.title} sub={a.sub} time={a.time} />
            ))}
            {activity.length === 0 && (
              <p className="text-xs text-gray-400 py-3">No recent activity.</p>
            )}
          </div>
        </div>

      </div>

      {/* ── Dialogs ── */}

      {/* View Drawer */}
      <UserViewDrawer
        user={viewUser}
        index={viewIndex}
        onClose={() => setViewUser(null)}
        onEdit={(u) => openEdit(u)}
      />

      {/* Add / Edit */}
      <EditDialog
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        user={editUser}
      />

      {/* Delete single (reusable ConfirmDeleteDialog) */}
      <ConfirmDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        description="This will permanently remove the member from the system. All associated data will be lost."
        confirmLabel="Delete User"
        itemMeta={deleteUser ? { label: "Member", value: deleteUser.name } : undefined}
      />

      {/* Bulk delete (reusing the same ConfirmDeleteDialog) */}
      <ConfirmDeleteDialog
        isOpen={bulkDelOpen}
        onClose={() => setBulkDelOpen(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Users"
        description={`You are about to permanently delete ${selected.size} member${selected.size > 1 ? "s" : ""}. This cannot be undone.`}
        confirmLabel={`Delete ${selected.size} Users`}
      />

    </div>
  );
}