const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/* ===============================
   🔐 Token Helpers
================================ */

const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

const setToken = (token, rememberMe = false) => {
  if (rememberMe) {
    localStorage.setItem("token", token);
  } else {
    sessionStorage.setItem("token", token);
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};

/* ===============================
   🧠 Generic Fetch Wrapper
================================ */

const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "เกิดข้อผิดพลาด");
  }

  return data;
};

/* ===============================
   👤 USER APIs
================================ */

// Register
export const registerUser = async (username, email, password) => {
  try {
    const data = await fetchWithAuth(`${API_BASE_URL}/users/register`, {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Login
export const loginUser = async (email, password, rememberMe = false) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // 🔥 เก็บ token อัตโนมัติ
    setToken(data.token, rememberMe);

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user by ID (Protected)
export const getUserById = async (userId) => {
  try {
    const data = await fetchWithAuth(`${API_BASE_URL}/users/${userId}`, {
      method: "GET",
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
