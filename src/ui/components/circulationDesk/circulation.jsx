import { useState, useEffect } from "react";
import { issueBook, returnBook, getActiveLoans, getLoansByUser, getOverdueLoans, getLoanStats } from "../../services/loan";

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
                    {member.name?.charAt(0) || "?"}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-700">{member.name}</p>
                    <p className="text-[11px] text-slate-400">{member.memberId || member.id} · {member.activeLoans || 0} books active</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Badge color="green">{member.status || "Active"}</Badge>
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
                    {book.title?.slice(0, 4) || "Book"}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-700">{book.title}</p>
                    <p className="text-[11px] text-slate-400">{book.author} · {book.publishedYear || "N/A"}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Badge color="green">{book.available > 0 ? "Available" : "Issued"}</Badge>
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

// ─── Return Book Card ────────────────────────────────────────────────────────

function ReturnBookCard({ loan }) {
    if (!loan) return null;
    const dueDate = new Date(loan.dueDate).toLocaleDateString();
    const isOverdue = new Date() > new Date(loan.dueDate);
    const daysOverdue = Math.ceil((new Date() - new Date(loan.dueDate)) / (1000 * 60 * 60 * 24));
    
    return (
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3">
            <div className="w-10 h-14 rounded bg-gradient-to-b from-slate-600 to-slate-800 flex items-center justify-center text-white text-[9px] font-bold text-center leading-tight px-0.5 flex-shrink-0">
                {loan.book?.title?.slice(0, 4) || "Book"}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{loan.book?.title || `Book #${loan.bookId}`}</p>
                <p className="text-[11px] text-slate-500">Issued to {loan.user?.name || `User #${loan.userId}`}</p>
                <div className="flex items-center gap-3 mt-1">
                    <div>
                        <p className="text-[10px] text-slate-400">Due Date</p>
                        <p className="text-[11px] font-semibold text-slate-600">{dueDate}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400">Status</p>
                        <Badge color={isOverdue ? "red" : "green"}>{loan.status}</Badge>
                    </div>
                </div>
            </div>
            {isOverdue && (
                <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-red-400 font-semibold">OVERDUE</p>
                    <p className="text-lg font-black text-red-500">{daysOverdue}d</p>
                </div>
            )}
        </div>
    );
}

// ─── Penalty Card ─────────────────────────────────────────────────────────────

function PenaltyCard({ amount, perDay }) {
    if (!amount) return null;
    return (
        <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2.5">
                <span className="text-lg">⚠️</span>
                <div>
                    <p className="text-xs font-bold text-red-600">Penalty Fine Accrued</p>
                    <p className="text-[10px] text-red-400">Rs. {perDay}/day · {Math.round(amount / perDay)} days</p>
                </div>
            </div>
            <span className="text-2xl font-black text-red-500">Rs. {amount.toFixed(2)}</span>
        </div>
    );
}

// ─── ISSUE NEW BOOK PANEL ──────────────────────────────────────────────────────

function IssueNewBook({ onIssueSuccess, activeLoans }) {
    const [userId, setUserId] = useState("");
    const [bookId, setBookId] = useState("");
    const [days, setDays] = useState("14");
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);

    // Fetch users and books for search
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, bookRes] = await Promise.all([
                    fetch("http://localhost:4000/api/v1/users").then(r => r.json()),
                    fetch("http://localhost:4000/api/v1/books").then(r => r.json())
                ]);
                if (userRes.success) setUsers(userRes.data || []);
                if (bookRes.success) setBooks(bookRes.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleMemberSearch = (e) => {
        const q = e.target.value;
        setUserId(q);
        const found = users.find(
            (u) => u.name?.toLowerCase().includes(q.toLowerCase()) || 
                   u.email?.toLowerCase().includes(q.toLowerCase()) ||
                   u.memberId?.toLowerCase().includes(q.toLowerCase())
        );
        if (found && q.length > 2) setSelectedMember(found);
        else if (q.length === 0) setSelectedMember(null);
    };

    const handleBookSearch = (e) => {
        const q = e.target.value;
        setBookId(q);
        const found = books.find(
            (b) => b.title?.toLowerCase().includes(q.toLowerCase()) || 
                   b.isbn?.includes(q) ||
                   b.author?.toLowerCase().includes(q.toLowerCase())
        );
        if (found && q.length > 2) setSelectedBook(found);
        else if (q.length === 0) setSelectedBook(null);
    };

    const handleIssue = async () => {
        if (!selectedMember || !selectedBook) {
            setToast({ type: "error", message: "Please select a member and a book before issuing." });
            return;
        }
        setLoading(true);
        const res = await issueBook(selectedMember.id, selectedBook.id, parseInt(days) || 14);
        setLoading(false);
        if (res.success) {
            setToast({ type: "success", message: `"${selectedBook.title}" issued to ${selectedMember.name} successfully!` });
            onIssueSuccess();
            setSelectedMember(null);
            setSelectedBook(null);
            setUserId("");
            setBookId("");
        } else {
            setToast({ type: "error", message: res.message || res.error || "Failed to issue book" });
        }
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
                    placeholder="Search by name, email, or Member ID..."
                    icon="👤"
                    value={userId}
                    onChange={handleMemberSearch}
                />

                {selectedMember && (
                    <MemberCard member={selectedMember} onClear={() => { setSelectedMember(null); setUserId(""); }} />
                )}

                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Asset Details</p>

                <InputField
                    placeholder="Search by title, author, or ISBN..."
                    icon="📖"
                    value={bookId}
                    onChange={handleBookSearch}
                />

                {selectedBook && (
                    <BookCard book={selectedBook} onClear={() => { setSelectedBook(null); setBookId(""); }} />
                )}

                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Return Details</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50">
                        <span className="text-slate-400 text-sm">📅</span>
                        <input
                            type="number"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            className="bg-transparent flex-1 text-sm text-slate-700 outline-none"
                            placeholder="Days (default 14)"
                        />
                    </div>
                </div>

                {toast && (
                    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
                )}

                <PrimaryButton onClick={handleIssue} disabled={loading}>
                    {loading ? "Processing..." : "Issue Book Asset"}
                </PrimaryButton>
            </div>
        </SectionCard>
    );
}

// ─── RETURN ASSET PANEL ────────────────────────────────────────────────────────

function ReturnAsset({ onReturnSuccess }) {
    const [loanId, setLoanId] = useState("");
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [toast, setToast] = useState(null);
    const [paid, setPaid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allLoans, setAllLoans] = useState([]);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/v1/loans");
                const data = await res.json();
                if (data.success) setAllLoans(data.data || []);
            } catch (error) {
                console.error("Error fetching loans:", error);
            }
        };
        fetchLoans();
    }, []);

    const handleScan = (e) => {
        const q = e.target.value;
        setLoanId(q);
        setPaid(false);
        const found = allLoans.find(l => l.id === parseInt(q) || l.id === q);
        if (found && q.length > 0) setSelectedLoan(found);
        else if (q.length === 0) setSelectedLoan(null);
    };

    const handleReturn = async () => {
        if (!selectedLoan) {
            setToast({ type: "error", message: "Please scan a valid Loan ID." });
            return;
        }
        setLoading(true);
        const res = await returnBook(selectedLoan.id);
        setLoading(false);
        if (res.success) {
            setToast({ type: "success", message: `"${selectedLoan.book?.title || `Loan #${selectedLoan.id}`}" returned successfully!` });
            onReturnSuccess();
            setSelectedLoan(null);
            setLoanId("");
            setPaid(false);
        } else {
            setToast({ type: "error", message: res.message || res.error || "Failed to return book" });
        }
    };

    const dueDate = selectedLoan ? new Date(selectedLoan.dueDate) : null;
    const isOverdue = dueDate ? new Date() > dueDate : false;
    const daysOverdue = isOverdue ? Math.ceil((new Date() - dueDate) / (1000 * 60 * 60 * 24)) : 0;
    const fineAmount = daysOverdue * 10;

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
                    placeholder="Enter Loan ID to return..."
                    icon="⊞"
                    value={loanId}
                    onChange={handleScan}
                />

                {selectedLoan && (
                    <>
                        <ReturnBookCard loan={selectedLoan} />

                        {isOverdue && !paid && (
                            <>
                                <PenaltyCard amount={fineAmount} perDay={10} />
                            </>
                        )}
                    </>
                )}

                {toast && (
                    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
                )}

                {selectedLoan && (
                    <PrimaryButton onClick={handleReturn} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200">
                        {loading ? "Processing..." : "Process Return"}
                    </PrimaryButton>
                )}
            </div>
        </SectionCard>
    );
}

// ─── STATS ROW ────────────────────────────────────────────────────────────────

function StatsRow({ stats }) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <StatCard
                label="Active Loans"
                value={stats.totalIssued || 0}
                sub={`${stats.totalOverdue || 0} overdue`}
                icon="📚"
                color="blue"
            />
            <StatCard
                label="Total Returned"
                value={stats.totalReturned || 0}
                sub="Books returned"
                icon="🔁"
                color="amber"
            />
            <StatCard
                label="Total Fines"
                value={`Rs. ${stats.totalFineCollected || 0}`}
                sub="Collected from overdue"
                icon="💰"
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
    const [stats, setStats] = useState({
        totalIssued: 0,
        totalOverdue: 0,
        totalReturned: 0,
        totalFineCollected: 0
    });
    const [refresh, setRefresh] = useState(false);

    const fetchStats = async () => {
        try {
            const res = await getLoanStats();
            if (res.success) setStats(res.data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [refresh]);

    const handleRefresh = () => {
        setRefresh(prev => !prev);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans">
            <div className="max-w-5xl mx-auto flex flex-col gap-5">
                <PageHeader />

                {/* Main two-column panel */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <IssueNewBook onIssueSuccess={handleRefresh} />
                    <ReturnAsset onReturnSuccess={handleRefresh} />
                </div>

                {/* Stats row */}
                <StatsRow stats={stats} />
            </div>
        </div>
    );
}