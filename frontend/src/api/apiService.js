const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Register
export const registerUser = async (username, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Login
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "ไม่พบข้อมูลผู้ใช้");
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
