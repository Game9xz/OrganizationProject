import React, { useState } from "react";
import "./LoginForm.css";
import { loginUser } from "../api/apiService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginUser(email, password);

    setLoading(false);

    if (result.success) {
      // Login สำเร็จ
      console.log("Login successful:", result.data);

      // เก็บข้อมูล user ใน localStorage (ถ้าเลือก Remember me)
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(result.data.user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(result.data.user));
      }

      // TODO: นำทางไปหน้าอื่น หรือ update state
      Swal.fire({
        title: "เข้าสู่ระบบสำเร็จ!",
        icon: "success",
        confirmButtonText: "หน้าแรก",
      }).then(() => {
        navigate("/home");
      });
    } else {
      // Login ไม่สำเร็จ
      setError(result.error);
    }
  };

  return (
    <div className="login-container">
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon"></div>
          <h2>เข้าสู่ระบบ</h2>
        </div>
        <nav className="nav-menu">
          <a href="#" className="nav-item active">
            เข้าสู่ระบบ
          </a>
          <a
            href="#"
            className="nav-item"
            onClick={() => navigate("/register")}
          >
            สมัครสมาชิก
          </a>
        </nav>
      </div>

      <div className="main-content">
        <div className="form-box">
          <h1 className="form-title">เข้าสู่ระบบ</h1>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email | อีเมลล์</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password | รหัสผ่าน</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me | จดจำฉัน</span>
              </label>
            </div>

            <div className="forgot-password">
              <a href="#">Forgotten Password | รับรหัสผ่าน</a>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>

            <div className="register-link">
              <p>Don't have an account | ยังไม่มีบัญชีผู้ใช้หรือไม่ ?</p>
              <a href="#" onClick={() => navigate("/register")}>
                Register now | สร้างบัญชีใหม่
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
