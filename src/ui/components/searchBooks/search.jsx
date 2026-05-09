// ============================================================
//  SearchCatalog.jsx  –  outlet only (no layout / sidebar)
//  Requires: useDebounce.js  |  catalogApi.js
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { useDebounce }                  from "../../hooks/debounce.jsx";
import { searchCatalog, fetchSuggestions } from "../../utils/catalogApi.jsx";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const SUBJECTS  = ["Philosophy", "Computer Science", "Art History", "Literature", "Science", "Mathematics"];
const FORMATS   = ["Paperback", "Hardcover", "E-Book"];
const LANGUAGES = ["All", "English", "French", "German", "Spanish", "Arabic"];
const SORT_OPTS = [
  { value: "relevance", label: "Relevance" },
  { value: "rating",    label: "Highest Rated" },
  { value: "year",      label: "Newest First" },
  { value: "title",     label: "Title A–Z" },
];
const MIN_YEAR = 1961;
const MAX_YEAR = new Date().getFullYear();
const PER_PAGE = 9;

// ─────────────────────────────────────────────────────────────
// 1. STAR RATING
// ─────────────────────────────────────────────────────────────
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-[10px] text-gray-400 font-medium ml-0.5">{rating.toFixed(1)}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. STATUS CHIP
// ─────────────────────────────────────────────────────────────
const statusStyle = {
  "In Stock":   { dot: "bg-emerald-500", text: "text-emerald-600" },
  "On Loan":    { dot: "bg-amber-400",   text: "text-amber-600"   },
  "Restricted": { dot: "bg-red-500",     text: "text-red-600"     },
};

function StatusChip({ status }) {
  const s = statusStyle[status] || { dot: "bg-gray-400", text: "text-gray-500" };
  return (
    <div className="flex items-center gap-1">
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      <span className={`text-[10px] font-semibold ${s.text}`}>{status}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. BOOK CARD
// ─────────────────────────────────────────────────────────────
/**
 * BookCard
 * @param {object}   book
 * @param {Function} onDetails
 */
function BookCard({ book, onDetails }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Cover */}
      <div
        className="relative h-44 flex items-center justify-center text-5xl"
        style={{ background: book.coverColor || "#1a1a2e" }}
      >
        <span className="select-none drop-shadow-lg">{book.coverEmoji || "📚"}</span>
        {/* Stock badge */}
        <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
          book.status === "In Stock"   ? "bg-emerald-500 text-white" :
          book.status === "Restricted" ? "bg-red-500 text-white"     :
                                         "bg-amber-400 text-white"
        }`}>
          {book.status === "In Stock" ? "In Stock" : book.status === "Restricted" ? "Restricted" : "On Loan"}
        </span>
      </div>

      {/* Info */}
      <div className="px-3.5 pt-3 pb-3 flex flex-col flex-1 gap-1.5">
        <StarRating rating={book.rating} />
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{book.title}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{book.author}</p>
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-50">
          <StatusChip status={book.status} />
          <button
            onClick={() => onDetails(book)}
            className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 hover:underline transition-colors"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. SKELETON CARD (loading state)
// ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="px-3.5 pt-3 pb-3 space-y-2">
        <div className="h-2.5 bg-gray-200 rounded w-2/3" />
        <div className="h-3.5 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-2 bg-gray-100 rounded w-1/3 mt-3" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. BOOK DETAIL DRAWER
// ─────────────────────────────────────────────────────────────
function BookDetailDrawer({ book, onClose }) {
  if (!book) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(15,17,30,0.4)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "slideIn 0.22s cubic-bezier(0.25,0.46,0.45,0.94) both" }}
        onClick={(e) => e.stopPropagation()}>

        <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500" />

        {/* Cover hero */}
        <div className="h-48 flex items-center justify-center text-6xl relative"
          style={{ background: book.coverColor || "#1a1a2e" }}>
          <span className="drop-shadow-2xl">{book.coverEmoji}</span>
          <button onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-xs hover:bg-white/40 transition">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <div>
            <h2 className="text-base font-extrabold text-gray-900 leading-tight">{book.title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={book.rating} />
              <StatusChip status={book.status} />
            </div>
          </div>

          <div className="space-y-0 divide-y divide-gray-100">
            {[
              { label: "Subject",  value: book.subject  },
              { label: "Format",   value: book.format   },
              { label: "Year",     value: book.year     },
              { label: "Language", value: book.language },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
                <span className="text-sm font-semibold text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors">
            Close
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
// 6. YEAR RANGE SLIDER
// ─────────────────────────────────────────────────────────────
/**
 * YearRangeSlider — dual-thumb range using two overlapping inputs
 */
function YearRangeSlider({ min, max, from, to, onChange }) {
  const pctFrom = ((from - min) / (max - min)) * 100;
  const pctTo   = ((to   - min) / (max - min)) * 100;

  const setFrom = (v) => onChange(Math.min(Number(v), to - 1),   to);
  const setTo   = (v) => onChange(from, Math.max(Number(v), from + 1));

  return (
    <div className="px-1">
      <div className="relative h-5 flex items-center">
        {/* Track */}
        <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full" />
        {/* Active track */}
        <div className="absolute h-1 bg-indigo-500 rounded-full"
          style={{ left: `${pctFrom}%`, right: `${100 - pctTo}%` }} />
        {/* Thumb from */}
        <input type="range" min={min} max={max} value={from} onChange={(e) => setFrom(e.target.value)}
          className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer range-thumb z-10"
          style={{ zIndex: from > max - 5 ? 5 : 3 }} />
        {/* Thumb to */}
        <input type="range" min={min} max={max} value={to} onChange={(e) => setTo(e.target.value)}
          className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer range-thumb z-10" />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-gray-500 font-semibold">{from}</span>
        <span className="text-[10px] text-gray-500 font-semibold">{to}</span>
      </div>
      <style>{`
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #4f46e5;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,.2);
          cursor: pointer;
        }
        .range-thumb::-moz-range-thumb {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #4f46e5;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,.2);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. FILTER PANEL (left sidebar content)
// ─────────────────────────────────────────────────────────────
function FilterLabel({ children }) {
  return <p className="text-[9px] font-black uppercase tracking-[0.12em] text-gray-400 mb-2">{children}</p>;
}

function FilterPanel({ subjects, formats, yearFrom, yearTo, language, onChange, onReset }) {
  const toggle = (arr, val) => arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
  const hasFilters = subjects.length || formats.length || yearFrom > MIN_YEAR || yearTo < MAX_YEAR || language !== "All";

  return (
    <aside className="w-52 shrink-0 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-gray-900">Catalog Filters</h2>
        {hasFilters && (
          <button onClick={onReset} className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 transition">
            Reset
          </button>
        )}
      </div>

      {/* Subject */}
      <div>
        <FilterLabel>Subject</FilterLabel>
        <div className="space-y-1.5">
          {SUBJECTS.map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={subjects.includes(s)}
                onChange={() => onChange("subjects", toggle(subjects, s))}
                className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 accent-indigo-600" />
              <span className={`text-xs font-medium transition-colors ${subjects.includes(s) ? "text-indigo-700" : "text-gray-600 group-hover:text-gray-900"}`}>{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Format */}
      <div>
        <FilterLabel>Format</FilterLabel>
        <div className="flex flex-wrap gap-1.5">
          {FORMATS.map((f) => (
            <button key={f} onClick={() => onChange("formats", toggle(formats, f))}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all ${
                formats.includes(f)
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Year of Publication */}
      <div>
        <FilterLabel>Year of Publication</FilterLabel>
        <YearRangeSlider
          min={MIN_YEAR} max={MAX_YEAR}
          from={yearFrom} to={yearTo}
          onChange={(from, to) => { onChange("yearFrom", from); onChange("yearTo", to); }}
        />
      </div>

      {/* Language */}
      <div>
        <FilterLabel>Language</FilterLabel>
        <div className="relative">
          <select value={language} onChange={(e) => onChange("language", e.target.value)}
            className="w-full appearance-none border border-gray-200 bg-white rounded-lg px-3 pr-7 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition">
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. SEARCH BAR with autocomplete
// ─────────────────────────────────────────────────────────────
function SearchBar({ value, onChange, onSearch, loading }) {
  const [suggestions,  setSuggestions]  = useState([]);
  const [showSugg,     setShowSugg]     = useState(false);
  const [listening,    setListening]    = useState(false);
  const debouncedQ     = useDebounce(value, 300);
  const suggController = useRef(null);
  const inputRef       = useRef(null);

  // Fetch suggestions as user types
  useEffect(() => {
    if (!debouncedQ.trim() || debouncedQ.length < 2) { setSuggestions([]); return; }
    suggController.current?.abort();
    suggController.current = new AbortController();
    fetchSuggestions(debouncedQ, suggController.current)
      .then(setSuggestions)
      .catch(() => {});
  }, [debouncedQ]);

  const pick = (s) => { onChange(s); setSuggestions([]); setShowSugg(false); onSearch(s); };

  // Voice search
  const handleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice search not supported in this browser.");
    const rec = new SR();
    rec.lang        = "en-US";
    rec.onstart     = () => setListening(true);
    rec.onend       = () => setListening(false);
    rec.onresult    = (e) => { const t = e.results[0][0].transcript; onChange(t); onSearch(t); };
    rec.start();
  };

  return (
    <div className="relative">
      <div className={`flex items-center gap-2 bg-white border rounded-xl px-3.5 py-2.5 shadow-sm transition-all ${
        showSugg && suggestions.length ? "rounded-b-none border-b-transparent" : ""
      } focus-within:ring-2 focus-within:ring-indigo-300 border-gray-200`}>
        {/* Search icon */}
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => { onChange(e.target.value); setShowSugg(true); }}
          onFocus={() => setShowSugg(true)}
          onBlur={() => setTimeout(() => setShowSugg(false), 150)}
          onKeyDown={(e) => { if (e.key === "Enter") { onSearch(value); setShowSugg(false); } }}
          placeholder="Search by title, author, or subject…"
          className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
        />
        {/* Mic */}
        <button onClick={handleMic} title="Voice search"
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${listening ? "bg-red-100 text-red-500" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"}`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4Zm-1 16.93V21h-2a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-3.07A8.001 8.001 0 0 0 20 11a1 1 0 1 0-2 0 6 6 0 0 1-12 0 1 1 0 1 0-2 0 8.001 8.001 0 0 0 7 7.93Z"/>
          </svg>
        </button>
        {/* Search button */}
        <button
          onClick={() => { onSearch(value); setShowSugg(false); }}
          disabled={loading}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold px-4 py-1.5 rounded-lg transition-all active:scale-95 shrink-0"
        >
          {loading
            ? <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Searching</>
            : "Search"
          }
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSugg && suggestions.length > 0 && (
        <ul className="absolute z-30 top-full left-0 right-0 bg-white border border-t-0 border-gray-200 rounded-b-xl shadow-lg overflow-hidden">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button onMouseDown={() => pick(s)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 transition-colors">
                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 9. PAGINATION
// ─────────────────────────────────────────────────────────────
function Pagination({ current, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = totalPages <= 5
    ? Array.from({ length: totalPages }, (_, i) => i + 1)
    : [1, 2, 3, "…", totalPages];

  return (
    <div className="flex items-center justify-center gap-1.5 py-6">
      <button onClick={() => onPageChange(Math.max(1, current - 1))}
        className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition text-sm">‹</button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={i} className="w-8 h-8 flex items-center justify-center text-gray-300 text-sm">…</span>
        ) : (
          <button key={i} onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-semibold transition ${
              current === p ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}>{p}</button>
        )
      )}
      <button onClick={() => onPageChange(Math.min(totalPages, current + 1))}
        className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition text-sm">›</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────────────────────────
export default function SearchCatalog() {
  // ── State ──
  const [query,    setQuery]    = useState("");
  const [subjects, setSubjects] = useState([]);
  const [formats,  setFormats]  = useState([]);
  const [yearFrom, setYearFrom] = useState(MIN_YEAR);
  const [yearTo,   setYearTo]   = useState(MAX_YEAR);
  const [language, setLanguage] = useState("All");
  const [sort,     setSort]     = useState("relevance");
  const [page,     setPage]     = useState(1);
  const [showAdv,  setShowAdv]  = useState(false);

  const [results,  setResults]  = useState([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const [detailBook, setDetailBook] = useState(null);

  const searchController = useRef(null);

  // ── Debounced query — triggers automatic search ──
  const debouncedQuery = useDebounce(query, 450);

  // ── Core search function ──
  const runSearch = useCallback(async (params) => {
    searchController.current?.abort();
    searchController.current = new AbortController();
    setLoading(true);
    setError(null);
    try {
      const data = await searchCatalog(params, searchController.current);
      setResults(data.results);
      setTotal(data.total);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Something went wrong. Please try again.");
        setResults([]);
        setTotal(0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Auto-search whenever debounced query or any filter changes ──
  useEffect(() => {
    runSearch({ q: debouncedQuery, subjects, formats, yearFrom, yearTo, language, sort, page, perPage: PER_PAGE });
  }, [debouncedQuery, subjects, formats, yearFrom, yearTo, language, sort, page, runSearch]);

  // ── Reset page when filters/sort change ──
  useEffect(() => { setPage(1); }, [subjects, formats, yearFrom, yearTo, language, sort, debouncedQuery]);

  // ── Filter change handler ──
  const handleFilter = (key, value) => {
    if (key === "subjects")  setSubjects(value);
    if (key === "formats")   setFormats(value);
    if (key === "yearFrom")  setYearFrom(value);
    if (key === "yearTo")    setYearTo(value);
    if (key === "language")  setLanguage(value);
  };

  const resetFilters = () => { setSubjects([]); setFormats([]); setYearFrom(MIN_YEAR); setYearTo(MAX_YEAR); setLanguage("All"); };

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const from       = total === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const to         = Math.min(page * PER_PAGE, total);

  // ── Render ──
  return (
    <div className="p-6 bg-gray-50 min-h-screen flex gap-6">

      {/* ── Left: Filter Panel ── */}
      <FilterPanel
        subjects={subjects} formats={formats}
        yearFrom={yearFrom} yearTo={yearTo}
        language={language}
        onChange={handleFilter}
        onReset={resetFilters}
      />

      {/* ── Right: Main content ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">

        {/* Search bar */}
        <SearchBar
          value={query}
          onChange={setQuery}
          onSearch={(q) => { setQuery(q); setPage(1); }}
          loading={loading}
        />

        {/* Results meta + sort */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAdv((v) => !v)}
              className={`text-xs font-semibold flex items-center gap-1 transition-colors ${showAdv ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              Advanced Options
            </button>
            {!loading && (
              <span className="text-xs text-gray-400">
                {total > 0 ? `Found ${total.toLocaleString()} result${total !== 1 ? "s" : ""}` : "No results found"}
                {total > 0 && ` · Showing ${from}–${to}`}
              </span>
            )}
            {loading && <span className="text-xs text-gray-400 animate-pulse">Searching…</span>}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Sort by</span>
            <div className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="appearance-none border border-gray-200 bg-white rounded-lg pl-3 pr-7 py-1.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer">
                {SORT_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
            </div>
          </div>
        </div>

        {/* Advanced Options Panel */}
        {showAdv && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Results per page</p>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                {[9, 18, 27].map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Availability</p>
              <div className="flex flex-wrap gap-1.5">
                {["In Stock", "On Loan", "Restricted"].map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-gray-100 text-gray-500 cursor-pointer hover:bg-indigo-100 hover:text-indigo-600 transition">{s}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">📭</span>
            <p className="text-base font-bold text-gray-700">No books found</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">Try adjusting your filters or searching with different keywords.</p>
            <button onClick={resetFilters} className="text-sm font-semibold text-indigo-600 hover:underline">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((book) => (
              <BookCard key={book.id} book={book} onDetails={setDetailBook} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination current={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* ── Book Detail Drawer ── */}
      <BookDetailDrawer book={detailBook} onClose={() => setDetailBook(null)} />

      {/* ── FAB: Add new entry ── */}
      <button
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-2xl shadow-xl flex items-center justify-center transition-all z-40"
        title="Add new catalog entry"
      >
        +
      </button>

    </div>
  );
}