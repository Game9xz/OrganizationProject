import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// POST /api/users/register
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // validate เบื้องต้น
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "กรุณากรอกข้อมูลให้ครบ",
    });
  }

  try {
    // เช็ก email ซ้ำ
    const [existing] = await db.query(
      "SELECT user_id FROM user WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Email นี้ถูกใช้แล้ว",
      });
    }

    // insert user ใหม่
    const [result] = await db.query(
      `INSERT INTO user (username, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, "user"],
    );

    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      user_id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// POST /api/users/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "กรุณากรอก email และ password",
    });
  }

  try {
    const [rows] = await db.query(
      "SELECT user_id, username, email, password, role FROM user WHERE email = ?",
      [email],
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Email หรือ Password ไม่ถูกต้อง",
      });
    }

    const user = rows[0];

    // เช็ค hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email หรือ Password ไม่ถูกต้อง",
      });
    }

    // 🔥 สร้าง JWT
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      message: "Login สำเร็จ",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "User id is required",
    });
  }

  try {
    const [rows] = await db.query(
      `SELECT user_id, username, email, created_at, role
       FROM user
       WHERE user_id = ?`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "ไม่พบ user",
      });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
