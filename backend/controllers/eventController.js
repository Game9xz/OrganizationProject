import db from "../config/db.js";

// ==========================
// สร้างงาน
// ==========================
export const createEvent = async (req, res) => {
  try {
    const {
      user_id,
      title,
      category,
      location,
      room,
      event_date,
      people_count,
      budget,
      status = "ยังไม่ได้กำหนด",
    } = req.body;

    if (!user_id || !title || !event_date) {
      return res.status(400).json({
        message: "กรอกข้อมูลไม่ครบ (user_id, title, event_date จำเป็น)",
      });
    }

    const sql = `
      INSERT INTO events
      (user_id, title, category, location, room, event_date, people_count, budget, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      user_id,
      title,
      category || null,
      location || null,
      room || null,
      event_date,
      people_count || 0,
      budget || 0,
      status,
    ]);

    res.status(201).json({
      message: "สร้างงานสำเร็จ",
      event_id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// ดึงงานทั้งหมด + filter
// ==========================
export const getEvents = async (req, res) => {
  try {
    const { user_id, category, location, room } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: "ต้องระบุ user_id" });
    }

    let sql = "SELECT * FROM events WHERE user_id = ?";
    const params = [user_id];

    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }

    if (location) {
      sql += " AND location = ?";
      params.push(location);
    }

    if (room) {
      sql += " AND room = ?";
      params.push(room);
    }

    sql += " ORDER BY event_date DESC";

    const [rows] = await db.query(sql, params);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// ดึงงานตาม ID
// ==========================
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT * FROM events WHERE event_id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบงาน" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// แก้ไขงาน
// ==========================
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      category,
      location,
      room,
      event_date,
      people_count,
      budget,
      status,
    } = req.body;

    const sql = `
      UPDATE events
      SET title=?, category=?, location=?, room=?,
          event_date=?, people_count=?, budget=?, status=?
      WHERE event_id=?
    `;

    const [result] = await db.query(sql, [
      title,
      category,
      location,
      room,
      event_date,
      people_count,
      budget,
      status,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบงานที่จะแก้ไข" });
    }

    res.json({ message: "อัปเดตสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// ลบงาน
// ==========================
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM events WHERE event_id=?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบงานที่ต้องการลบ" });
    }

    res.json({ message: "ลบสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// เปลี่ยนสถานะ (ใช้สำหรับ dropdown realtime)
// ==========================
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "ต้องระบุสถานะ" });
    }

    const [result] = await db.query(
      "UPDATE events SET status=? WHERE event_id=?",
      [status, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบงาน" });
    }

    res.json({ message: "เปลี่ยนสถานะสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
