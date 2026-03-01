import React, { useState, useEffect } from "react";
import "./ResetPassword.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const resetToken = sessionStorage.getItem("resetToken");

    // ถ้าไม่มี resetToken → กลับไปหน้า forgot-password
    useEffect(() => {
        if (!resetToken) {
            navigate("/forgot-password");
        }
    }, [resetToken, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword.length < 6) {
            setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/reset/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resetToken, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "เกิดข้อผิดพลาด");
            }

            // ลบข้อมูล reset ออกจาก session
            sessionStorage.removeItem("resetEmail");
            sessionStorage.removeItem("resetToken");

            await Swal.fire({
                icon: "success",
                title: "เปลี่ยนรหัสผ่านสำเร็จ!",
                text: "กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่",
                confirmButtonColor: "#7c3aed",
                background: "#2d2d2d",
                color: "#fff",
            });

            navigate("/login");
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
                    <h2>ตั้งรหัสผ่านใหม่</h2>
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
                        <div className="step completed">✓</div>
                        <div className="step-line active"></div>
                        <div className="step completed">✓</div>
                        <div className="step-line active"></div>
                        <div className="step active">3</div>
                    </div>

                    <h1 className="form-title">ตั้งรหัสผ่านใหม่</h1>
                    <p className="form-subtitle">กรอกรหัสผ่านใหม่ที่ต้องการ</p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>รหัสผ่านใหม่</label>
                            <input
                                type="password"
                                placeholder="อย่างน้อย 6 ตัวอักษร"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label>ยืนยันรหัสผ่านใหม่</label>
                            <input
                                type="password"
                                placeholder="กรอกรหัสผ่านอีกครั้ง"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
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

export default ResetPassword;
