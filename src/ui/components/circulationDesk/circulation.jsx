import { useState } from "react";

// ─── Reusable Primitives ────────────────────────────────────────────────────

function Badge({ children, color = "blue" }) {
    const colors = {
        blue: "bg-blue-100 text-blue-700",
        green: "bg-emerald-100 text-emerald-700",
        red: "bg-red-100 text-red-700",
        yellow: "bg-amber-100 text-amber-700",
        purple: "bg-violet-100 text-violet-700",
    };
    return (
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors[color]}`}>
            {children}
        </span>
    );
}

function SectionCard({ title, icon, children, className = "" }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 ${className}`}>
            <div className="flex items-center gap-2">
                <span className="text-blue-500">{icon}</span>
                <h2 className="text-sm font-bold text-slate-700 tracking-wide">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function InputField({ label, placeholder, icon, value, onChange }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</label>}
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400 transition-all">
                {icon && <span className="text-slate-400 text-sm">{icon}</span>}
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="bg-transparent flex-1 text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
            </div>
        </div>
    );
}

function PrimaryButton({ children, onClick, disabled = false, className = "" }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-sm shadow-blue-200 ${className}`}
        >
            {children}
        </button>
    );
}

function SecondaryButton({ children, onClick, variant = "default" }) {
    const variants = {
        default: "border border-slate-200 text-slate-600 hover:bg-slate-50",
        danger: "border border-red-200 text-red-500 hover:bg-red-50",
        success: "border border-emerald-200 text-emerald-600 hover:bg-emerald-50",
    };
    return (
        <button
            onClick={onClick}
            className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all ${variants[variant]}`}
        >
            {children}
        </button>
    );
}

// ─── Member Card ─────────────────────────────────────────────────────────────

function MemberCard({ member, onClear }) {
    if (!member) return null;
    return (
        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {member.name.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-700">{member.name}</p>
                    <p className="text-[11px] text-slate-400">{member.id} · {member.books} books active</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Badge color="green">Active</Badge>
                <button onClick={onClear} className="text-slate-300 hover:text-slate-500 transition-colors text-xs">✕</button>
            </div>
        </div>
    );
}

// ─── Book Card ───────────────────────────────────────────────────────────────

function BookCard({ book, onClear }) {
    if (!book) return null;
    return (
        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-10 rounded bg-gradient-to-b from-indigo-400 to-blue-600 flex items-center justify-center text-white text-[9px] font-bold text-center leading-tight px-0.5">
                    {book.title.slice(0, 4)}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-700">{book.title}</p>
                    <p className="text-[11px] text-slate-400">{book.author} · {book.pages} pages</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Badge color="blue">{book.status}</Badge>
                <button onClick={onClear} className="text-slate-300 hover:text-slate-500 transition-colors text-xs">✕</button>
            </div>
        </div>
    );
}

// ─── Toast Notification ───────────────────────────────────────────────────────

function Toast({ message, type = "success", onClose }) {
    const styles = {
        success: "bg-emerald-50 border-emerald-200 text-emerald-700",
        error: "bg-red-50 border-red-200 text-red-700",
        info: "bg-blue-50 border-blue-200 text-blue-700",
    };
    const icons = { success: "✓", error: "✕", info: "ℹ" };
    return (
        <div className={`flex items-start gap-3 border rounded-xl px-4 py-3 text-sm ${styles[type]}`}>
            <span className="font-bold mt-0.5">{icons[type]}</span>
            <p className="flex-1 font-medium">{message}</p>
            <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity font-bold">✕</button>
        </div>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, color = "blue" }) {
    const colors = {
        blue: "from-blue-500 to-blue-600",
        violet: "from-violet-500 to-purple-600",
        amber: "from-amber-400 to-orange-500",
    };
    return (
        <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-4 text-white flex flex-col justify-between min-h-[90px]`}>
            <div className="flex items-center justify-between">
                <span className="text-2xl font-black tracking-tight">{value}</span>
                <span className="text-xl opacity-70">{icon}</span>
            </div>
            <div>
                <p className="text-xs font-semibold opacity-90">{label}</p>
                <p className="text-[10px] opacity-60 mt-0.5">{sub}</p>
            </div>
        </div>
    );
}

// ─── Return Asset Card ────────────────────────────────────────────────────────

function ReturnBookCard({ book }) {
    if (!book) return null;
    return (
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3">
            <div className="w-10 h-14 rounded bg-gradient-to-b from-slate-600 to-slate-800 flex items-center justify-center text-white text-[9px] font-bold text-center leading-tight px-0.5 flex-shrink-0">
                {book.title.slice(0, 4)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{book.title}</p>
                <p className="text-[11px] text-slate-500">Issued to {book.issuedTo}</p>
                <div className="flex items-center gap-3 mt-1">
                    <div>
                        <p className="text-[10px] text-slate-400">Due Date</p>
                        <p className="text-[11px] font-semibold text-slate-600">{book.dueDate}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400">Loan Duration</p>
                        <p className="text-[11px] font-semibold text-slate-600">{book.loanDuration}</p>
                    </div>
                </div>
            </div>
            {book.overdueDays > 0 && (
                <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-red-400 font-semibold">OVERDUE</p>
                    <p className="text-lg font-black text-red-500">{book.overdueDays}d</p>
                </div>
            )}
        </div>
    );
}

function PenaltyCard({ amount, perDay }) {
    if (!amount) return null;
    return (
        <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2.5">
                <span className="text-lg">⚠️</span>
                <div>
                    <p className="text-xs font-bold text-red-600">Penalty Fine Accrued</p>
                    <p className="text-[10px] text-red-400">${perDay}/day · {Math.round(amount / perDay)} days</p>
                </div>
            </div>
            <span className="text-2xl font-black text-red-500">${amount.toFixed(2)}</span>
        </div>
    );
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────

const MEMBERS = {
    "RINA001": { name: "Rina Rodriguez", id: "ID#LIB-2024-0042", books: 3 },
    "MARC002": { name: "Marcus Chan", id: "ID#LIB-2024-0091", books: 1 },
    "AYLA003": { name: "Ayla Torres", id: "ID#LIB-2024-0057", books: 2 },
    "AYLA001": { name: "Ayla pathan", id: "ID#LIB-2024-0057", books: 9 },
};

const BOOKS = {
    "978-0-061-96436-9": { title: "Principles of Modern Physics", author: "R. Leighton", pages: "592", status: "Available" },
    "978-0-385-54734-7": { title: "The Silent Patient", author: "A. Michaelides", pages: "336", status: "Available" },
    "978-0-525-55360-5": { title: "Atomic Habits", author: "James Clear", pages: "320", status: "Available" },
};

const RETURN_BOOKS = {
    "RET-001": {
        title: "The Silent Patient",
        issuedTo: "Marcus Chan",
        dueDate: "Oct 06, 2025",
        loanDuration: "16 Days Total",
        overdueDays: 4,
        penalty: 8.00,
        penaltyPerDay: 2.00,
    },
    "RET-002": {
        title: "Atomic Habits",
        issuedTo: "Rina Rodriguez",
        dueDate: "Nov 12, 2025",
        loanDuration: "14 Days Total",
        overdueDays: 0,
        penalty: 0,
        penaltyPerDay: 2.00,
    },
};

// ─── ISSUE NEW BOOK PANEL ──────────────────────────────────────────────────────

function IssueNewBook() {
    const [memberQuery, setMemberQuery] = useState("");
    const [bookQuery, setBookQuery] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [dueDate, setDueDate] = useState("14 Days (Oct 24, 2025)");
    const [toast, setToast] = useState(null);

    const handleMemberSearch = (e) => {
        const q = e.target.value;
        setMemberQuery(q);
        const found = Object.values(MEMBERS).find(
            (m) => m.name.toLowerCase().includes(q.toLowerCase()) || m.id.toLowerCase().includes(q.toLowerCase())
        );
        if (found && q.length > 2) setSelectedMember(found);
    };

    const handleBookSearch = (e) => {
        const q = e.target.value;
        setBookQuery(q);
        const found = Object.values(BOOKS).find(
            (b) => b.title.toLowerCase().includes(q.toLowerCase()) || q.startsWith("978")
        );
        if (found && q.length > 2) setSelectedBook(found);
    };

    const handleIssue = () => {
        if (!selectedMember || !selectedBook) {
            setToast({ type: "error", message: "Please select a member and a book before issuing." });
            return;
        }
        setToast({ type: "success", message: `"${selectedBook.title}" issued to ${selectedMember.name} successfully!` });
        setSelectedMember(null);
        setSelectedBook(null);
        setMemberQuery("");
        setBookQuery("");
    };

    return (
        <SectionCard
            title="Issue New Book"
            icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            }
        >
            <div className="flex flex-col gap-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Member Identification</p>

                <InputField
                    placeholder="Scan Student ID or enter name..."
                    icon="👤"
                    value={memberQuery}
                    onChange={handleMemberSearch}
                />

                {selectedMember && (
                    <MemberCard member={selectedMember} onClear={() => { setSelectedMember(null); setMemberQuery(""); }} />
                )}

                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Asset Details</p>

                <InputField
                    placeholder="ISBN, Title, or Accession Number..."
                    icon="📖"
                    value={bookQuery}
                    onChange={handleBookSearch}
                />

                {selectedBook && (
                    <BookCard book={selectedBook} onClear={() => { setSelectedBook(null); setBookQuery(""); }} />
                )}

                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Return Details</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50">
                        <span className="text-slate-400 text-sm">📅</span>
                        <input
                            type="text"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="bg-transparent flex-1 text-sm text-slate-700 outline-none"
                        />
                    </div>
                </div>

                {toast && (
                    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
                )}

                <PrimaryButton onClick={handleIssue}>
                    Issue Book Asset
                </PrimaryButton>
            </div>
        </SectionCard>
    );
}

// ─── RETURN ASSET PANEL ────────────────────────────────────────────────────────

function ReturnAsset() {
    const [barcode, setBarcode] = useState("");
    const [scannedBook, setScannedBook] = useState(null);
    const [toast, setToast] = useState(null);
    const [paid, setPaid] = useState(false);

    const handleScan = (e) => {
        const q = e.target.value;
        setBarcode(q);
        setPaid(false);
        const found = RETURN_BOOKS[q.trim()];
        if (found) setScannedBook(found);
        else if (q.length === 0) setScannedBook(null);
    };

    const handlePayNow = () => {
        setPaid(true);
        setToast({ type: "success", message: `Penalty of $${scannedBook.penalty.toFixed(2)} paid. Asset RET-001 has been updated in the catalog.` });
    };

    const handleWaiveFine = () => {
        setPaid(true);
        setToast({ type: "info", message: `Fine waived for "${scannedBook.title}". Return processed.` });
    };

    const handleReturn = () => {
        if (!scannedBook) {
            setToast({ type: "error", message: "Please scan a valid barcode to return an asset." });
            return;
        }
        if (scannedBook.overdueDays > 0 && !paid) {
            setToast({ type: "error", message: "Please resolve the penalty fine before processing the return." });
            return;
        }
        setToast({ type: "success", message: `"${scannedBook.title}" returned successfully!` });
        setScannedBook(null);
        setBarcode("");
        setPaid(false);
    };

    return (
        <SectionCard
            title="Return Asset"
            icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
            }
        >
            <div className="flex flex-col gap-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Scan or Identification</p>

                <InputField
                    placeholder="Scan Book Barcode... (try: RET-001 or RET-002)"
                    icon="⊞"
                    value={barcode}
                    onChange={handleScan}
                />

                {scannedBook && (
                    <>
                        <ReturnBookCard book={scannedBook} />

                        {scannedBook.overdueDays > 0 && !paid && (
                            <>
                                <PenaltyCard amount={scannedBook.penalty} perDay={scannedBook.penaltyPerDay} />
                                <div className="flex gap-2">
                                    <SecondaryButton onClick={handlePayNow} variant="danger">Pay Now</SecondaryButton>
                                    <SecondaryButton onClick={handleWaiveFine} variant="default">Waive Fine</SecondaryButton>
                                </div>
                            </>
                        )}
                    </>
                )}

                {toast && (
                    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
                )}

                {scannedBook && (
                    <PrimaryButton onClick={handleReturn} className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200">
                        Process Return
                    </PrimaryButton>
                )}
            </div>
        </SectionCard>
    );
}

// ─── STATS ROW ────────────────────────────────────────────────────────────────

function StatsRow() {
    return (
        <div className="grid grid-cols-3 gap-4">
            <StatCard
                label="Active Loans Today"
                value="42"
                sub="12% increase from yesterday"
                icon="📚"
                color="blue"
            />
            <StatCard
                label="Pending Returns"
                value="18"
                sub="3 overdue · 15 on time"
                icon="🔁"
                color="amber"
            />
            <StatCard
                label="Digital Curator Score"
                value="98%"
                sub="Catalog health is excellent"
                icon="⭐"
                color="violet"
            />
        </div>
    );
}

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────

function PageHeader() {
    return (
        <div className="mb-1">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Circulation Desk</h1>
            <p className="text-sm text-slate-400 mt-0.5">
                Efficiently manage the flow of institutional knowledge. Handle issue requests and returns with high-precision tracking.
            </p>
        </div>
    );
}

// ─── MAIN OUTLET ──────────────────────────────────────────────────────────────

export default function CirculationDesk() {
    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans">
            <div className="max-w-5xl mx-auto flex flex-col gap-5">
                <PageHeader />

                {/* Main two-column panel */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <IssueNewBook />
                    <ReturnAsset />
                </div>

                {/* Stats row */}
                <StatsRow />
            </div>
        </div>
    );
}