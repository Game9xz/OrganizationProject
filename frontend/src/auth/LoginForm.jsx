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

    const result = await loginUser(email, password, rememberMe);

    setLoading(false);

    if (result.success) {
      // ✅ กรณี Login สำเร็จ
      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ!",
        text: "กำลังนำคุณไปยังหน้าแรก...",
        timer: 1500, // แสดง 1.5 วินาทีแล้วหายไปเอง
        showConfirmButton: false,
      }).then(() => {
        const userData = result.data.user || result.data || {};
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          sessionStorage.setItem("user", JSON.stringify(userData));
        }
        navigate("/homepage", { replace: true });
      });

    } else {
      // ❌ กรณี Login ไม่สำเร็จ
      setError(result.error); // ยังเก็บไว้แสดงในฟอร์มได้ (ถ้าต้องการ)

      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: result.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        confirmButtonColor: "#d33", // สีปุ่มตกลงเป็นสีแดง
        confirmButtonText: "ลองอีกครั้ง"
      });
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
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }}>Forgotten Password | รับรหัสผ่าน</a>
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
