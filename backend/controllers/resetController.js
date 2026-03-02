import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ส่ง email ผ่าน Brevo HTTP API
const sendOTPEmail = async (email, otp) => {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
            sender: {
                email: process.env.BREVO_SENDER_EMAIL,
                name: "Event Organizer",
            },
            to: [{ email }],
            subject: "รหัส OTP สำหรับรีเซ็ตรหัสผ่าน",
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px;">
                    <h2>🔐 รีเซ็ตรหัสผ่าน</h2>
                    <p>ใช้รหัส OTP ด้านล่างเพื่อยืนยันตัวตน</p>
                    <h1 style="letter-spacing: 6px;">${otp}</h1>
                    <p>รหัสจะหมดอายุใน 5 นาที</p>
                </div>
            `,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Brevo API Error: ${JSON.stringify(error)}`);
    }

    return response.json();
};

// สร้าง OTP 6 หลัก
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// POST /api/reset/request-otp
export const requestOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "กรุณากรอก email" });
    }

    try {
        const [users] = await db.query(
            "SELECT user_id FROM user WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "ไม่พบ email นี้ในระบบ" });
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await db.query("DELETE FROM otp_codes WHERE email = ?", [email]);
        await db.query(
            "INSERT INTO otp_codes (email, otp_code, expires_at) VALUES (?, ?, ?)",
            [email, otp, expiresAt]
        );

        await sendOTPEmail(email, otp);

        res.status(200).json({ message: "ส่ง OTP ไปที่ email เรียบร้อยแล้ว" });
    } catch (err) {
        console.error("Request OTP Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// POST /api/reset/verify-otp (เหมือนเดิม)
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "กรุณากรอก email และ OTP" });
    }

    try {
        const [rows] = await db.query(
            "SELECT * FROM otp_codes WHERE email = ? AND otp_code = ? AND expires_at > NOW()",
            [email, otp]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "OTP ไม่ถูกต้องหรือหมดอายุ" });
        }

        const resetToken = jwt.sign(
            { email, purpose: "reset_password" },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );

        await db.query("DELETE FROM otp_codes WHERE email = ?", [email]);

        res.status(200).json({ message: "ยืนยัน OTP สำเร็จ", resetToken });
    } catch (err) {
        console.error("Verify OTP Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// POST /api/reset/reset-password (เหมือนเดิม)
export const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
        return res.status(400).json({ message: "กรุณากรอก token และ password ใหม่" });
    }

    try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

        if (decoded.purpose !== "reset_password") {
            return res.status(400).json({ message: "Token ไม่ถูกต้อง" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [result] = await db.query(
            "UPDATE user SET password = ? WHERE email = ?",
            [hashedPassword, decoded.email]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "ไม่พบ user" });
        }

        res.status(200).json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(400).json({ message: "Token หมดอายุ กรุณาขอ OTP ใหม่" });
        }
        console.error("Reset Password Error:", err);
        res.status(500).json({ error: err.message });
    }
};