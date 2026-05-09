// ============================================================
//  BookManagement.jsx  –  outlet only (no layout / sidebar)
//  Requires: ConfirmDeleteDialog.jsx  &  EditDialog.jsx
// ============================================================

import { useState } from "react";
import ConfirmDeleteDialog from "../dialogue/deleteDialogue";
import EditDialog      from "../dialogue/editDialogue";

// ─────────────────────────────────────────────
// 1. STAT CARD
// ─────────────────────────────────────────────
function StatCard({ label, value, icon, iconBg = "bg-indigo-100" }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 shadow-sm flex-1 min-w-0">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900 leading-none">{value}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. CATEGORY BADGE
// ─────────────────────────────────────────────
const categoryStyles = {
  "Art & Design": "bg-pink-100 text-pink-700",
  Philosophy:     "bg-blue-100 text-blue-700",
  Science:        "bg-emerald-100 text-emerald-700",
  History:        "bg-amber-100 text-amber-700",
};

function CategoryBadge({ category }) {
  const style = categoryStyles[category] || "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${style}`}>
      {category}
    </span>
  );
}

// ─────────────────────────────────────────────
// 3. STATUS BADGE
// ─────────────────────────────────────────────
const statusStyles = {
  Available:   { dot: "bg-emerald-500", text: "text-emerald-600" },
  Issued:      { dot: "bg-blue-500",    text: "text-blue-600"    },
  Maintenance: { dot: "bg-red-500",     text: "text-red-600"     },
};

function StatusBadge({ status }) {
  const s = statusStyles[status] || { dot: "bg-gray-400", text: "text-gray-500" };
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
      <span className={`text-xs font-semibold ${s.text}`}>{status}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// 4. BOOK THUMBNAIL
// ─────────────────────────────────────────────
function BookThumb({ emoji, bg = "bg-pink-100" }) {
  return (
    <div className={`w-9 h-12 rounded flex items-center justify-center text-base shrink-0 ${bg}`}>
      {emoji}
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. ROW ACTIONS — View / Edit / Delete
// ─────────────────────────────────────────────
/**
 * RowActions
 * @param {Function} onView
 * @param {Function} onEdit
 * @param {Function} onDelete
 */
function RowActions({ onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-1">
      {/* View */}
      <button
        onClick={onView}
        title="View"
        className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </button>

      {/* Edit */}
      <button
        onClick={onEdit}
        title="Edit"
        className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 transition-all"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>

      {/* Delete */}
      <button
        onClick={onDelete}
        title="Delete"
        className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-all"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// 6. BOOK TABLE ROW
// ─────────────────────────────────────────────
function BookTableRow({ book, onView, onEdit, onDelete }) {
  const { title, edition, author, category, isbn, status, thumbEmoji, thumbBg } = book;
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <BookThumb emoji={thumbEmoji} bg={thumbBg} />
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">{title}</p>
            <p className="text-[11px] text-gray-400">{edition}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 text-sm text-gray-600">{author}</td>
      <td className="px-4 py-3.5"><CategoryBadge category={category} /></td>
      <td className="px-4 py-3.5 font-mono text-[11px] text-gray-400">{isbn}</td>
      <td className="px-4 py-3.5"><StatusBadge status={status} /></td>
      <td className="px-4 py-3.5">
        <RowActions onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────
// 7. FILTER SELECT
// ─────────────────────────────────────────────
function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none border border-gray-200 bg-white rounded-lg pl-3 pr-7 py-1.5 text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 8. PAGINATION
// ─────────────────────────────────────────────
function Pagination({ current, total, totalEntries, perPage, onPageChange }) {
  const from  = (current - 1) * perPage + 1;
  const to    = Math.min(current * perPage, totalEntries);
  const pages = [1, 2, 3, "…", total];

  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-t border-gray-100 text-xs text-gray-400">
      <span>Showing {from} to {to} of {totalEntries.toLocaleString()} entries</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(Math.max(1, current - 1))}
          className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">‹</button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={i} className="w-7 h-7 flex items-center justify-center text-gray-300">…</span>
          ) : (
            <button key={i} onClick={() => typeof p === "number" && onPageChange(p)}
              className={`w-7 h-7 rounded-md border flex items-center justify-center transition font-semibold ${
                current === p ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}>{p}</button>
          )
        )}
        <button onClick={() => onPageChange(Math.min(total, current + 1))}
          className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">›</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 9. BOOK VIEW DRAWER
// ─────────────────────────────────────────────
function BookViewDrawer({ book, onClose }) {
  if (!book) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(15,17,30,0.35)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "slideIn 0.22s cubic-bezier(0.25,0.46,0.45,0.94) both" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 bg-linear-to-r from-indigo-500 to-violet-500" />
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Book Details</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-20 rounded-lg flex items-center justify-center text-3xl shrink-0 ${book.thumbBg}`}>
              {book.thumbEmoji}
            </div>
            <div>
              <p className="text-base font-bold text-gray-900 leading-tight">{book.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{book.edition}</p>
              <div className="mt-2"><StatusBadge status={book.status} /></div>
            </div>
          </div>
          {[
            { label: "Author",   value: book.author },
            { label: "Category", value: <CategoryBadge category={book.category} /> },
            { label: "ISBN",     value: <span className="font-mono text-xs text-gray-600">{book.isbn}</span> },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1 border-b border-gray-100 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
              <div className="text-sm text-gray-800">{value}</div>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors">
            Close
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// 10. BOOK TABLE (state + dialogs)
// ─────────────────────────────────────────────
const CATEGORY_OPTIONS     = ["All Categories", "Art & Design", "Philosophy", "Science", "History"];
const AVAILABILITY_OPTIONS = ["All Status", "Available", "Issued", "Maintenance"];

function BookTable({ books: initialBooks = [], totalEntries = 0 }) {
  const [books,        setBooks]      = useState(initialBooks);
  const [category,     setCategory]   = useState("All Categories");
  const [availability, setAvail]      = useState("All Status");
  const [view,         setView]       = useState("list");
  const [page,         setPage]       = useState(1);

  // Dialog state
  const [viewBook,   setViewBook]   = useState(null);
  const [editBook,   setEditBook]   = useState(null);
  const [editOpen,   setEditOpen]   = useState(false);
  const [deleteBook, setDeleteBook] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const PER_PAGE = 4;

  const filtered = books.filter((b) => {
    const catMatch  = category     === "All Categories" || b.category === category;
    const statMatch = availability === "All Status"     || b.status   === availability;
    return catMatch && statMatch;
  });

  const handleSave = (updated) => {
    setBooks((prev) =>
      prev.some((b) => b.id === updated.id)
        ? prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b))
        : [...prev, updated]
    );
  };

  const handleConfirmDelete = () => {
    setBooks((prev) => prev.filter((b) => b.id !== deleteBook?.id));
  };

  return (
    <>
      {/* Filter bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4 flex-wrap">
          <FilterSelect label="Category"     options={CATEGORY_OPTIONS}     value={category}     onChange={setCategory} />
          <FilterSelect label="Availability" options={AVAILABILITY_OPTIONS} value={availability} onChange={setAvail}    />
        </div>
        <div className="flex gap-1">
          {[["list", "☰"], ["grid", "⊞"]].map(([v, icon]) => (
            <button key={v} onClick={() => setView(v)}
              className={`w-8 h-8 rounded-md border flex items-center justify-center text-sm transition ${
                view === v ? "bg-gray-100 border-gray-300 text-indigo-600" : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50"
              }`}>{icon}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              {["Book Title", "Author", "Category", "ISBN", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">No books match the current filters.</td>
              </tr>
            ) : (
              filtered.map((book) => (
                <BookTableRow
                  key={book.id}
                  book={book}
                  onView={()   => setViewBook(book)}
                  onEdit={()   => { setEditBook(book); setEditOpen(true); }}
                  onDelete={() => { setDeleteBook(book); setDeleteOpen(true); }}
                />
              ))
            )}
          </tbody>
        </table>
        <Pagination current={page} total={312} totalEntries={totalEntries} perPage={PER_PAGE} onPageChange={setPage} />
      </div>

      {/* ── View Drawer ── */}
      <BookViewDrawer book={viewBook} onClose={() => setViewBook(null)} />

      {/* ── Edit Dialog ── */}
      <EditDialog
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        book={editBook}
      />

      {/* ── Delete Dialog (reusable — imported from ConfirmDeleteDialog.jsx) ── */}
      <ConfirmDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Book"
        description="This will permanently remove the book from the library system. All associated records will be lost."
        confirmLabel="Delete Book"
        itemMeta={deleteBook ? { label: "Book", value: deleteBook.title } : undefined}
      />
    </>
  );
}

// ─────────────────────────────────────────────
// 11. LIBRARIAN INSIGHT
// ─────────────────────────────────────────────
function LibrarianInsight({ insight, linkLabel = "View Trend Report", linkHref = "#" }) {
  return (
    <div className="rounded-xl p-5 text-white" style={{ background: "linear-gradient(135deg,#4338ca,#7c3aed)" }}>
      <p className="text-sm font-bold mb-2.5">🔍 Librarian Insight</p>
      <p className="text-xs leading-relaxed text-indigo-100 mb-4">{insight}</p>
      <a href={linkHref} className="text-xs font-bold text-white hover:text-indigo-200 transition-colors inline-flex items-center gap-1">
        {linkLabel} →
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────
// 12. ACTION QUEUE
// ─────────────────────────────────────────────
function ActionQueueItem({ icon, iconBg = "bg-emerald-100", text, onStart }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${iconBg}`}>{icon}</div>
      <p className="text-sm text-gray-700 flex-1 leading-snug">{text}</p>
      <button onClick={onStart}
        className="shrink-0 text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
        Start Task
      </button>
    </div>
  );
}

function ActionQueue({ tasks = [] }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900">Action Queue</h3>
        <span className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
          {tasks.length} Tasks Pending
        </span>
      </div>
      {tasks.map((t) => (
        <ActionQueueItem key={t.id} icon={t.icon} iconBg={t.iconBg} text={t.text} onStart={() => alert(`Starting: ${t.text}`)} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const INITIAL_BOOKS = [
  { id: 1, title: "The Art of Curation",       edition: "1st Edition, 2023",     author: "Elena Montgomery", category: "Art & Design", isbn: "978-3-16-148410-0", status: "Available",   thumbEmoji: "🎨", thumbBg: "bg-pink-100"    },
  { id: 2, title: "Foundations of Logic",       edition: "Oxford Press, 2018",    author: "Dr. Silas Vance",  category: "Philosophy",   isbn: "978-0-19-853453-2", status: "Issued",      thumbEmoji: "📖", thumbBg: "bg-blue-100"    },
  { id: 3, title: "Quantum Narratives",         edition: "Revised Edition, 2021", author: "Liora Stein",      category: "Science",      isbn: "978-1-56-019803-6", status: "Maintenance", thumbEmoji: "🔬", thumbBg: "bg-emerald-100" },
  { id: 4, title: "History of the Silent City", edition: "Archival Series, 2019", author: "Marcus Thorne",    category: "History",      isbn: "978-3-16-148410-0", status: "Available",   thumbEmoji: "🏛️", thumbBg: "bg-amber-100"   },
];

const ACTION_TASKS = [
  { id: 1, icon: "✅", iconBg: "bg-emerald-100", text: "Approve 'Quantum Narratives' return inspection" },
  { id: 2, icon: "🔄", iconBg: "bg-amber-100",   text: "Restock 12 copies of 'The Art of Curation'"    },
  { id: 3, icon: "📦", iconBg: "bg-blue-100",    text: "Process new acquisitions from Oxford Press"    },
];

// ─────────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────────
export default function BookManagement() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Book Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and organize the Intellectual Atelier's literary collection.</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          + Add New Book
        </button>
      </div>

      {/* Stat Cards */}
      <div className="flex gap-4 mb-6">
        <StatCard label="Total Volumes"    value="12,482" icon="📚" iconBg="bg-indigo-100"  />
        <StatCard label="Currently Issued" value="843"    icon="📤" iconBg="bg-purple-100" />
        <StatCard label="Maintenance"      value="24"     icon="🔧" iconBg="bg-red-100"    />
      </div>

      {/* Book Table */}
      <BookTable books={INITIAL_BOOKS} totalEntries={12482} />

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr] gap-4 mt-5">
        <LibrarianInsight
          insight={`"History" is the most trending category this month with a 24% increase in issuance. Consider expanding the 'Modern-European' sub-collection.`}
        />
        <ActionQueue tasks={ACTION_TASKS} />
      </div>

      {/* Add New Book dialog (header button) */}
      <EditDialog
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(newBook) => console.log("New book:", newBook)}
        book={null}
      />

    </div>
  );
}