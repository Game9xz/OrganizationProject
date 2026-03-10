import db from "../config/db.js";

// =========================
// CREATE Activity
// =========================
export const createActivity = async (req, res) => {
  try {
    const { event_id, title, description, start_time, end_time } = req.body;

    if (!event_id || !title || !start_time || !end_time) {
      return res.status(400).json({
        message: "ข้อมูลไม่ครบ",
      });
    }

    const [result] = await db.execute(
      `INSERT INTO activities
      (event_id, title, description, start_time, end_time)
      VALUES (?, ?, ?, ?, ?)`,
      [event_id, title, description || null, start_time, end_time],
    );

    res.status(201).json({
      message: "Activity created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating activity" });
  }
};

// =========================
// GET Activities by Event
// =========================
export const getActivitiesByEvent = async (req, res) => {
  try {
    const { event_id } = req.params;

    const [rows] = await db.execute(
      `SELECT * FROM activities 
       WHERE event_id = ? 
       ORDER BY start_time`,
      [event_id],
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities" });
  }
};

// =========================
// UPDATE Activity
// =========================
export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, start_time, end_time } = req.body;

    const [result] = await db.execute(
      `UPDATE activities 
       SET title=?, description=?, start_time=?, end_time=?
       WHERE id=?`,
      [title, description, start_time, end_time, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบ activity" });
    }

    res.json({ message: "Activity updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating activity" });
  }
};

// =========================
// DELETE Activity
// =========================
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      `DELETE FROM activities WHERE id=?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบ activity" });
    }
    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting activity" });
  }
};
