// ============================================================
//  EditBookDialog.jsx  –  Edit book dialog (reusable form modal)
//
//  USAGE:
//  <EditBookDialog
//    isOpen={isEditOpen}
//    onClose={() => setEditOpen(false)}
//    onSave={(updatedBook) => handleSave(updatedBook)}
//    book={selectedBook}   // pass null/undefined for "Add" mode
//  />
// ============================================================

import { useState, useEffect } from "react";

const CATEGORIES = [
  "Art & Design",
  "Philosophy",
  "Science",
  "History",
  "Literature",
  "Technology",
];
const STATUSES = ["Available", "Issued", "Maintenance"];

const EMPTY_FORM = {
  title: "",
  edition: "",
  author: "",
  category: CATEGORIES[0],
  isbn: "",
  status: "Available",
};

/**
 * FormField – labelled input wrapper
 */
function FormField({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 " +
  "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-gray-50 hover:bg-white";

/**
 * EditBookDialog
 *
 * @param {boolean}  isOpen   – controls visibility
 * @param {Function} onClose  – called on cancel / backdrop click
 * @param {Function} onSave   – called with updated book object
 * @param {object}   book     – book to edit; pass null for "Add New Book" mode
 */
export default function EditBookDialog({ isOpen, onClose, onSave, book }) {
  const isAddMode = !book;
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Populate form when book changes
  useEffect(() => {
    if (isOpen) {
      setForm(book ? { ...book } : { ...EMPTY_FORM });
      setErrors({});
    }
  }, [book, isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.author.trim()) errs.author = "Author is required";
    if (!form.isbn.trim()) errs.isbn = "ISBN is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave?.({ ...form, id: book?.id ?? Date.now() });
    onClose();
  };

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,17,30,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      {/* ── Panel ── */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
        style={{
          animation: "dialogIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top accent bar ── */}
        <div className="h-1.5 w-full bg-linear-to-r from-indigo-500 to-violet-500 shrink-0" />

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {isAddMode ? "Add New Book" : "Edit Book"}
              </h2>
              <p className="text-xs text-gray-400">
                {isAddMode
                  ? "Fill in the details below to add a new book."
                  : "Update the book's information below."}
              </p>
            </div>
          </div>
          {/* Close X */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ── Form Body (scrollable) ── */}
        <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4">
          {/* Title */}
          <FormField label="Book Title" required>
            <input
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. The Art of Curation"
              className={`${inputCls} ${errors.title ? "border-red-300 ring-1 ring-red-200" : ""}`}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </FormField>

          {/* Edition */}
          <FormField label="Edition / Publisher">
            <input
              value={form.edition}
              onChange={set("edition")}
              placeholder="e.g. 1st Edition, 2023"
              className={inputCls}
            />
          </FormField>

          {/* Author */}
          <FormField label="Author" required>
            <input
              value={form.author}
              onChange={set("author")}
              placeholder="e.g. Elena Montgomery"
              className={`${inputCls} ${errors.author ? "border-red-300 ring-1 ring-red-200" : ""}`}
            />
            {errors.author && (
              <p className="text-xs text-red-500">{errors.author}</p>
            )}
          </FormField>

          {/* Category + Status side-by-side */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category">
              <div className="relative">
                <select
                  value={form.category}
                  onChange={set("category")}
                  className={`${inputCls} appearance-none pr-8`}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  ▾
                </span>
              </div>
            </FormField>

            <FormField label="Status">
              <div className="relative">
                <select
                  value={form.status}
                  onChange={set("status")}
                  className={`${inputCls} appearance-none pr-8`}
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  ▾
                </span>
              </div>
            </FormField>
          </div>

          {/* ISBN */}
          <FormField label="ISBN" required>
            <input
              value={form.isbn}
              onChange={set("isbn")}
              placeholder="e.g. 978-3-16-148410-0"
              className={`${inputCls} font-mono ${errors.isbn ? "border-red-300 ring-1 ring-red-200" : ""}`}
            />
            {errors.isbn && (
              <p className="text-xs text-red-500">{errors.isbn}</p>
            )}
          </FormField>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0 bg-gray-50/50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
          >
            {isAddMode ? "Add Book" : "Save Changes"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.88) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
      `}</style>
    </div>
  );
}
