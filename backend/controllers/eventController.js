import db from "../config/db.js";

// สร้างงาน
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
      status,
    } = req.body;

    const sql = `
      INSERT INTO events
      (user_id, title, category, location, room, event_date, people_count, budget, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      user_id,
      title,
      category,
      location,
      room,
      event_date,
      people_count,
      budget,
      status,
    ]);

    res.status(201).json({ message: "สร้างงานสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึงงานทั้งหมด + filter
export const getEvents = async (req, res) => {
  try {
    const { user_id, category, location, room } = req.query;

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

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// แก้ไขงาน
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

    await db.query(sql, [
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

    res.json({ message: "อัปเดตสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

// ลบงาน
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM events WHERE event_id=?", [id]);

    res.json({ message: "ลบสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// เปลี่ยนสถานะ
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.query("UPDATE events SET status=? WHERE event_id=?", [status, id]);

    res.json({ message: "เปลี่ยนสถานะสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
