// ============================================================
//  catalogApi.js  –  API service for the Search/Catalog page
//
//  Set VITE_API_BASE_URL (or REACT_APP_API_BASE_URL) in your
//  .env file to point at your Node.js backend, e.g.:
//    VITE_API_BASE_URL=http://localhost:5000
//
//  The module falls back to MOCK_DATA automatically in dev
//  if the env variable is not set or the request fails.
// ============================================================

// ── Base URL ─────────────────────────────────────────────────
const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL ||
  "";   // empty string = same origin

// ── Endpoints ────────────────────────────────────────────────
export const ENDPOINTS = {
  search: `${API_BASE}/api/catalog/search`,
  detail: (id) => `${API_BASE}/api/catalog/${id}`,
  suggestions: `${API_BASE}/api/catalog/suggestions`,
};

// ── Request helper ───────────────────────────────────────────
/**
 * apiFetch – thin wrapper around fetch with JSON handling
 * and AbortController support.
 *
 * @param {string}          url
 * @param {RequestInit}     options
 * @param {AbortController} [controller]
 */
async function apiFetch(url, options = {}, controller) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    signal: controller?.signal,
    ...options,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${errText}`);
  }

  return res.json();
}

// ── searchCatalog ─────────────────────────────────────────────
/**
 * Search the catalog.
 *
 * Node.js endpoint expected:  GET /api/catalog/search
 * Query params:
 *   q          – search query string
 *   subjects   – comma-separated subject list  (e.g. "Philosophy,Science")
 *   formats    – comma-separated format list   (e.g. "Paperback,E-Book")
 *   yearFrom   – number
 *   yearTo     – number
 *   language   – string
 *   sort       – "relevance" | "title" | "year" | "rating"
 *   page       – number (1-indexed)
 *   perPage    – number
 *
 * Expected response shape:
 * {
 *   total:   number,
 *   page:    number,
 *   results: Book[]
 * }
 *
 * Book shape:
 * {
 *   id:         string | number,
 *   title:      string,
 *   author:     string,
 *   subject:    string,
 *   format:     "Paperback" | "Hardcover" | "E-Book",
 *   year:       number,
 *   language:   string,
 *   rating:     number,           // 0–5
 *   status:     "In Stock" | "On Loan" | "Restricted",
 *   coverColor: string,           // hex or tailwind class hint
 *   coverEmoji: string,           // optional decorative emoji
 * }
 *
 * @param {object}          params
 * @param {AbortController} [controller]   – pass to cancel in-flight requests
 * @returns {Promise<{ total: number, page: number, results: Book[] }>}
 */
export async function searchCatalog(params = {}, controller) {
  const {
    q        = "",
    subjects = [],
    formats  = [],
    yearFrom = 1900,
    yearTo   = new Date().getFullYear(),
    language = "All",
    sort     = "relevance",
    page     = 1,
    perPage  = 9,
  } = params;

  // Build query string
  const qp = new URLSearchParams();
  if (q)                    qp.set("q",        q);
  if (subjects.length)      qp.set("subjects", subjects.join(","));
  if (formats.length)       qp.set("formats",  formats.join(","));
  qp.set("yearFrom", yearFrom);
  qp.set("yearTo",   yearTo);
  if (language !== "All")   qp.set("language", language);
  qp.set("sort",    sort);
  qp.set("page",    page);
  qp.set("perPage", perPage);

  // If no backend is configured, fall through to mock
  if (!API_BASE) {
    return mockSearchCatalog(params);
  }

  try {
    return await apiFetch(`${ENDPOINTS.search}?${qp}`, {}, controller);
  } catch (err) {
    if (err.name === "AbortError") throw err;             // bubble cancellations
    console.warn("[catalogApi] falling back to mock data:", err.message);
    return mockSearchCatalog(params);
  }
}

// ── fetchSuggestions ──────────────────────────────────────────
/**
 * Fetch autocomplete suggestions.
 * Node.js endpoint: GET /api/catalog/suggestions?q=...
 *
 * @param {string}          q
 * @param {AbortController} [controller]
 * @returns {Promise<string[]>}
 */
export async function fetchSuggestions(q, controller) {
  if (!q.trim() || !API_BASE) return mockSuggestions(q);

  try {
    const data = await apiFetch(
      `${ENDPOINTS.suggestions}?q=${encodeURIComponent(q)}`,
      {},
      controller
    );
    return Array.isArray(data) ? data : data.suggestions ?? [];
  } catch (err) {
    if (err.name === "AbortError") throw err;
    return mockSuggestions(q);
  }
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA  (used when API_BASE is empty or backend is down)
// ──────────────────────────────────────────────────────────────
const MOCK_BOOKS = [
  { id: 1,  title: "Architectures of Intelligence",   author: "Dr. Julian Warring",   subject: "Computer Science", format: "Paperback", year: 2022, language: "English", rating: 4.0, status: "In Stock",   coverColor: "#1a1a2e", coverEmoji: "🤖" },
  { id: 2,  title: "The Moral Algorithm",             author: "Sarah J. Halloway",     subject: "Philosophy",       format: "Hardcover", year: 2021, language: "English", rating: 4.7, status: "Restricted", coverColor: "#1c2e1c", coverEmoji: "⚖️" },
  { id: 3,  title: "Human-Centric Data",              author: "Prof. Michael Chan",    subject: "Computer Science", format: "E-Book",    year: 2023, language: "English", rating: 3.5, status: "In Stock",   coverColor: "#2e1c1c", coverEmoji: "📊" },
  { id: 4,  title: "The History of Logic",            author: "Robert F. Harrison",    subject: "Philosophy",       format: "Paperback", year: 1998, language: "English", rating: 4.0, status: "On Loan",   coverColor: "#1c1c2e", coverEmoji: "🧮" },
  { id: 5,  title: "Cognitive Systems Design",        author: "Anika Patel",           subject: "Computer Science", format: "Hardcover", year: 2020, language: "English", rating: 4.3, status: "In Stock",   coverColor: "#2e2414", coverEmoji: "🧠" },
  { id: 6,  title: "Ethics in the Digital Age",      author: "Clara Voss",            subject: "Philosophy",       format: "E-Book",    year: 2022, language: "English", rating: 3.8, status: "In Stock",   coverColor: "#14242e", coverEmoji: "💡" },
  { id: 7,  title: "Machine Perception",             author: "Dr. Leon Marsh",        subject: "Computer Science", format: "Paperback", year: 2019, language: "English", rating: 4.5, status: "In Stock",   coverColor: "#1e1e1e", coverEmoji: "👁️" },
  { id: 8,  title: "Post-Modern Art Theory",         author: "Lucia Fontaine",        subject: "Art History",      format: "Hardcover", year: 2017, language: "French",  rating: 4.1, status: "In Stock",   coverColor: "#2a1a2e", coverEmoji: "🎨" },
  { id: 9,  title: "Neural Language Models",         author: "Wei Zhang",             subject: "Computer Science", format: "E-Book",    year: 2023, language: "English", rating: 4.6, status: "Restricted", coverColor: "#0d1b2a", coverEmoji: "🔮" },
  { id: 10, title: "Plato Revisited",                author: "Dr. Helena Cross",      subject: "Philosophy",       format: "Paperback", year: 2010, language: "English", rating: 3.9, status: "On Loan",   coverColor: "#1a2e1a", coverEmoji: "🏛️" },
  { id: 11, title: "The Bauhaus Legacy",             author: "Franz Mueller",         subject: "Art History",      format: "Hardcover", year: 2015, language: "German",  rating: 4.4, status: "In Stock",   coverColor: "#2e1a00", coverEmoji: "🏗️" },
  { id: 12, title: "Reinforcement Learning at Scale",author: "Priya Nair",            subject: "Computer Science", format: "E-Book",    year: 2024, language: "English", rating: 4.8, status: "In Stock",   coverColor: "#001a2e", coverEmoji: "🚀" },
];

const SUGGESTION_BANK = [
  "Artificial Intelligence and Ethics",
  "Architecture of Neural Networks",
  "Art History Renaissance",
  "Algorithms and Complexity",
  "Applied Machine Learning",
  "Ancient Philosophy",
  "Bauhaus Design Movement",
  "Cognitive Science Fundamentals",
  "Computer Vision Deep Learning",
  "Data Ethics and Society",
  "Digital Humanities",
  "Epistemology Modern",
];

function mockSuggestions(q) {
  const lower = q.toLowerCase();
  return SUGGESTION_BANK.filter((s) => s.toLowerCase().includes(lower)).slice(0, 6);
}

function mockSearchCatalog({ q = "", subjects = [], formats = [], yearFrom = 1900, yearTo = 2030, language = "All", sort = "relevance", page = 1, perPage = 9 } = {}) {
  let results = [...MOCK_BOOKS];

  if (q.trim()) {
    const lower = q.toLowerCase();
    results = results.filter(
      (b) =>
        b.title.toLowerCase().includes(lower) ||
        b.author.toLowerCase().includes(lower) ||
        b.subject.toLowerCase().includes(lower)
    );
  }
  if (subjects.length)  results = results.filter((b) => subjects.includes(b.subject));
  if (formats.length)   results = results.filter((b) => formats.includes(b.format));
  results = results.filter((b) => b.year >= yearFrom && b.year <= yearTo);
  if (language !== "All") results = results.filter((b) => b.language === language);

  if (sort === "title")   results.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "year")    results.sort((a, b) => b.year - a.year);
  if (sort === "rating")  results.sort((a, b) => b.rating - a.rating);

  const total    = results.length;
  const paginated = results.slice((page - 1) * perPage, page * perPage);

  // Simulate network delay (150 ms)
  return new Promise((res) => setTimeout(() => res({ total, page, results: paginated }), 150));
}