// ============================================================
//  ConfirmDeleteDialog.jsx  –  FULLY REUSABLE delete dialog
//  Works for ANY entity: books, users, reports, etc.
//
//  USAGE:
//  <ConfirmDeleteDialog
//    isOpen={isDeleteOpen}
//    onClose={() => setDeleteOpen(false)}
//    onConfirm={() => handleDelete(selectedItem.id)}
//    title="Delete Book"
//    description={`Are you sure you want to delete "${selectedItem?.title}"? This action cannot be undone.`}
//    confirmLabel="Delete Book"   // optional – defaults to "Delete"
//    itemMeta={{ label: "Book", value: selectedItem?.title }} // optional info row
//  />
// ============================================================

import { useEffect, useRef } from "react";

/**
 * ConfirmDeleteDialog
 *
 * @param {boolean}  isOpen       – controls visibility
 * @param {Function} onClose      – called when user cancels / clicks backdrop
 * @param {Function} onConfirm    – called when user confirms deletion
 * @param {string}   title        – dialog heading            (default: "Confirm Delete")
 * @param {string}   description  – body text / warning       (default: generic message)
 * @param {string}   confirmLabel – confirm button label       (default: "Delete")
 * @param {{ label: string, value: string }} itemMeta  – optional info chip shown in body
 */
export default function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title        = "Confirm Delete",
  description  = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmLabel = "Delete",
  itemMeta,
}) {
  const confirmBtnRef = useRef(null);
  // Focus confirm button when opened (accessibility)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => confirmBtnRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,17,30,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      {/* ── Panel ── */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{
          animation: "dialogIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top accent bar ── */}
        <div className="h-1.5 w-full bg-linear-to-r from-red-500 to-rose-400" />

        {/* ── Body ── */}
        <div className="px-6 pt-6 pb-5">
          {/* Icon + Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
            <div className="pt-0.5">
              <h2 className="text-base font-bold text-gray-900 leading-tight">{title}</h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
            </div>
          </div>

          {/* Optional item meta chip */}
          {itemMeta && (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{itemMeta.label}:</span>
              <span className="text-sm font-semibold text-gray-800 truncate">{itemMeta.value}</span>
            </div>
          )}

          {/* Warning note */}
          <div className="flex items-center gap-2 bg-red-50 rounded-xl px-4 py-2.5 mb-6">
            <svg className="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/>
            </svg>
            <p className="text-xs text-red-600 font-medium">This action is permanent and cannot be reversed.</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              ref={confirmBtnRef}
              onClick={() => {
                  console.log("DELETE BUTTON CLICKED");

                onConfirm(); onClose(); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all shadow-sm shadow-red-200"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>

      {/* ── Keyframe animation (injected once) ── */}
      <style>{`
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.88) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
      `}</style>
    </div>
  );
}