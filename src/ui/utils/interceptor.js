const BASE_URL = "http://localhost:4000/api/v1";

const fetchClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Global auth handling
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

export default fetchClient;