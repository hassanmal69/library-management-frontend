export const getUsers = async (page = 1, limit = 10) => {
    try {
        const res = await fetch(
            `http://localhost:4000/api/v1/users?page=${page}&limit=${limit}`,
            { method: "GET" }
        );
        const data = await res.json();
        if (res.ok) {
            console.log("Users fetched:", data);
            return data.data || [];
        } else {
            console.log("Error:", data);
            return [];
        }
    } catch (error) {
        console.log(error);
        return { error: "Something went wrong" };
    }
};

export const getUserStats = async () => {
    try {
        const res = await fetch(
            "http://localhost:4000/api/v1/users/stats",
            { method: "GET" }
        );
        const data = await res.json();
        if (res.ok) {
            console.log("Stats fetched:", data);
            return data.data;
        }
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const createUser = async (userData) => {
    try {
        const res = await fetch(
            "http://localhost:4000/api/v1/users",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            }
        );
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return { success: false, error: "Something went wrong" };
    }
};

export const updateUserStatus = async (userId, status) => {
    try {
        const res = await fetch(
            `http://localhost:4000/api/v1/users/${userId}/status`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            }
        );
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return { success: false, error: "Something went wrong" };
    }
};

export const deleteUser = async (userId) => {
    try {
        const res = await fetch(
            `http://localhost:4000/api/v1/users/${userId}`,
            { method: "DELETE" }
        );
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return { success: false, error: "Something went wrong" };
    }
};