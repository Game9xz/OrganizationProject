import React, { useState, useRef, useEffect } from "react";
import "./ResetPassword.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const VerifyOTP = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(300); // 5 นาที
    const inputRefs = useRef([]);
    const email = sessionStorage.getItem("resetEmail");

    // ถ้าไม่มี email ใน session → กลับไปหน้า forgot-password
    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // รับแค่ตัวเลข

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // ย้ายไปช่องถัดไปอัตโนมัติ
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // กด Backspace → ย้ายกลับช่องก่อนหน้า
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").trim();
        if (/^\d{6}$/.test(pasted)) {
            const digits = pasted.split("");
            setOtp(digits);
            inputRefs.current[5].focus();
        }
    };

    const handleResend = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reset/request-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setCountdown(300);
            setOtp(["", "", "", "", "", ""]);
            setError("");

            await Swal.fire({
                icon: "success",
                title: "ส่ง OTP ใหม่แล้ว!",
                text: "กรุณาตรวจสอบ email ของคุณ",
                confirmButtonColor: "#7c3aed",
                background: "#2d2d2d",
                color: "#fff",
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join("");

        if (otpCode.length !== 6) {
            setError("กรุณากรอก OTP ให้ครบ 6 หลัก");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/reset/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "เกิดข้อผิดพลาด");
            }

            // เก็บ reset token ไว้ใช้ในหน้าถัดไป
            sessionStorage.setItem("resetToken", data.resetToken);
            navigate("/reset-password");
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
                    <h2>ยืนยัน OTP</h2>
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
                        <div className="step active">2</div>
                        <div className="step-line"></div>
                        <div className="step">3</div>
                    </div>

                    <h1 className="form-title">ยืนยัน OTP</h1>
                    <p className="form-subtitle">
                        กรอกรหัส OTP 6 หลักที่ส่งไปที่ <strong>{email}</strong>
                    </p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="otp-inputs" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="otp-input"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        <div className="countdown">
                            {countdown > 0 ? (
                                <span>รหัสจะหมดอายุใน {formatTime(countdown)}</span>
                            ) : (
                                <span className="expired">รหัส OTP หมดอายุแล้ว</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading || countdown <= 0}
                        >
                            {loading ? "กำลังยืนยัน..." : "ยืนยัน OTP"}
                        </button>

                        <div className="resend-link">
                            <a onClick={handleResend}>ส่งรหัส OTP ใหม่</a>
                        </div>

                        <div className="back-link">
                            <a onClick={() => navigate("/forgot-password")}>
                                ← กลับไปกรอก email
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
