import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// ตั้งค่า transporter สำหรับส่ง email (รองรับ Google Workspace เช่น @ku.th)
import dns from "dns";
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    dnsLookup: (hostname, options, callback) => {
        dns.lookup(hostname, { family: 4 }, callback);
    },
});

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
        // เช็คว่ามี user อยู่จริง
        const [users] = await db.query(
            "SELECT user_id FROM user WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "ไม่พบ email นี้ในระบบ" });
        }

        // สร้าง OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // หมดอายุใน 5 นาที

        // ลบ OTP เก่าของ email นี้
        await db.query("DELETE FROM otp_codes WHERE email = ?", [email]);

        // บันทึก OTP ใหม่
        await db.query(
            "INSERT INTO otp_codes (email, otp_code, expires_at) VALUES (?, ?, ?)",
            [email, otp, expiresAt]
        );

        // ส่ง email
        const mailOptions = {
            from: `"Event Organizer" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "รหัส OTP สำหรับรีเซ็ตรหัสผ่าน",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #1a1a1a; border-radius: 16px;">
          <h2 style="color: #a855f7; text-align: center; margin-bottom: 8px;">🔐 รีเซ็ตรหัสผ่าน</h2>
          <p style="color: #ccc; text-align: center; margin-bottom: 24px;">ใช้รหัส OTP ด้านล่างเพื่อยืนยันตัวตน</p>
          <div style="background: linear-gradient(135deg, #7c3aed, #a855f7); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: bold; color: white; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #999; text-align: center; font-size: 14px;">รหัสนี้จะหมดอายุใน <strong style="color: #f59e0b;">5 นาที</strong></p>
          <p style="color: #666; text-align: center; font-size: 12px; margin-top: 24px;">หากคุณไม่ได้ร้องขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยต่อ email นี้</p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "ส่ง OTP ไปที่ email เรียบร้อยแล้ว" });
    } catch (err) {
        console.error("Request OTP Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// POST /api/reset/verify-otp
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

        // สร้าง reset token (ใช้ได้ 10 นาที)
        const resetToken = jwt.sign(
            { email, purpose: "reset_password" },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );

        // ลบ OTP ที่ใช้แล้ว
        await db.query("DELETE FROM otp_codes WHERE email = ?", [email]);

        res.status(200).json({
            message: "ยืนยัน OTP สำเร็จ",
            resetToken,
        });
    } catch (err) {
        console.error("Verify OTP Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// POST /api/reset/reset-password
export const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
        return res
            .status(400)
            .json({ message: "กรุณากรอก token และ password ใหม่" });
    }

    try {
        // Verify reset token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

        if (decoded.purpose !== "reset_password") {
            return res.status(400).json({ message: "Token ไม่ถูกต้อง" });
        }

        // Hash password ใหม่
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password ใน DB
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
            return res
                .status(400)
                .json({ message: "Token หมดอายุ กรุณาขอ OTP ใหม่" });
        }
        console.error("Reset Password Error:", err);
        res.status(500).json({ error: err.message });
    }
};
