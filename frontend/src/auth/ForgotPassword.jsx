import React, { useState } from "react";
import "./ResetPassword.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/reset/request-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "เกิดข้อผิดพลาด");
            }

            await Swal.fire({
                icon: "success",
                title: "ส่ง OTP สำเร็จ!",
                text: "กรุณาตรวจสอบ email ของคุณ",
                confirmButtonColor: "#7c3aed",
                background: "#2d2d2d",
                color: "#fff",
            });

            // เก็บ email ไว้ใช้ในหน้าถัดไป
            sessionStorage.setItem("resetEmail", email);
            navigate("/verify-otp");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-container">
            <div className="sidebar">
                <div className="logo">
                    <div className="logo-icon"></div>
                    <h2>รีเซ็ตรหัสผ่าน</h2>
                </div>
                <nav className="nav-menu">
                    <a className="nav-item" onClick={() => navigate("/login")}>
                        เข้าสู่ระบบ
                    </a>
                    <a className="nav-item active">รีเซ็ตรหัสผ่าน</a>
                </nav>
            </div>

            <div className="main-content">
                <div className="form-box">
                    <div className="step-indicator">
                        <div className="step active">1</div>
                        <div className="step-line"></div>
                        <div className="step">2</div>
                        <div className="step-line"></div>
                        <div className="step">3</div>
                    </div>

                    <h1 className="form-title">กรอก Email</h1>
                    <p className="form-subtitle">
                        กรอก email ที่ใช้สมัครสมาชิก เราจะส่งรหัส OTP ไปให้
                    </p>

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

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? "กำลังส่ง OTP..." : "ส่งรหัส OTP"}
                        </button>

                        <div className="back-link">
                            <a onClick={() => navigate("/login")}>
                                ← กลับไปหน้าเข้าสู่ระบบ
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
