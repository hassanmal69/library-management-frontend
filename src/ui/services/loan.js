const API_BASE = "http://localhost:4000/api/v1";

export const issueBook = async (userId, bookId, days = 14) => {
    try {
        const res = await fetch(`${API_BASE}/loans/issue`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, bookId, days })
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Issue book error:", error);
        return { success: false, error: "Something went wrong" };
    }
};

export const returnBook = async (loanId) => {
    try {
        const res = await fetch(`${API_BASE}/loans/return`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loanId })
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Return book error:", error);
        return { success: false, error: "Something went wrong" };
    }
};

export const getActiveLoans = async (page = 1, limit = 10) => {
    try {
        const res = await fetch(`${API_BASE}/loans?page=${page}&limit=${limit}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Get loans error:", error);
        return { success: false, error: "Something went wrong" };
    }
};

export const getLoansByUser = async (userId) => {
    try {
        const res = await fetch(`${API_BASE}/loans/user/${userId}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Get user loans error:", error);
        return { success: false, error: "Something went wrong" };
    }
};

export const getOverdueLoans = async () => {
    try {
        const res = await fetch(`${API_BASE}/loans/overdue`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Get overdue loans error:", error);
        return { success: false, error: "Something went wrong" };
    }
};

export const getLoanStats = async () => {
    try {
        const res = await fetch(`${API_BASE}/loans/stats`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Get loan stats error:", error);
        return { success: false, error: "Something went wrong" };
    }
};