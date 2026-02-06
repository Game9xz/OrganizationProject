import React, { useState } from "react";
import "./SignUpForm.css";
import { registerUser } from "../api/apiService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน!");
      return;
    }
    if (!agreeTerms) {
      setError("กรุณายอมรับเงื่อนไข");
      return;
    }

    setLoading(true);

    const result = await registerUser(username, email, password);

    setLoading(false);

    if (result.success) {
      console.log("Register successful:", result.data);
      Swal.fire({
        title: "สมัครสมาชิกสำเร็จ!",
        icon: "success",
        confirmButtonText: "เข้าสู่ระบบ",
      }).then(() => {
        navigate("/login");
      });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="register-container">
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon"></div>
          <h2>เข้าสู่ระบบ</h2>
        </div>
        <nav className="nav-menu">
          <a href="#" className="nav-item" onClick={() => navigate("/login")}>
            เข้าสู่ระบบ
          </a>
          <a href="#" className="nav-item active">
            สมัครสมาชิก
          </a>
        </nav>
      </div>

      <div className="main-content">
        <div className="form-box">
          <h1 className="form-title">สมัครสมาชิก</h1>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username | ชื่อผู้ใช้งาน</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

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

            <div className="form-group">
              <label>Comfirm Password | ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>
                  ฉันยอมรับและให้ถือว่าสมัครใจในการดำเนินการ
                  <br />
                  เพื่อประกอบการตรวจสอบของบริษัท
                </span>
              </label>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            </button>

            <div className="login-link">
              <p>Already have an account | มีบัญชีอยู่แล้ว</p>
              <a href="#" onClick={() => navigate("/login")}>
                Login | เข้าสู่ระบบ
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
