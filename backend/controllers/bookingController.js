import db from "../config/db.js";

/* =====================================================
   GET ALL BOOKINGS (JOIN user + packages)
   GET /api/bookings
===================================================== */
export const getAllBookings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        b.booking_id,
        b.guest_count,
        b.duration,
        b.budget,
        b.full_name,
        b.contact_email,
        b.phone,
        b.line_id,
        u.user_id,
        u.name,
        p.package_id,
        p.package_name,
        p.base_price
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN packages p ON b.package_id = p.package_id
      ORDER BY b.booking_id DESC
    `);

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* =====================================================
   GET BOOKING BY ID
   GET /api/bookings/:id
===================================================== */
export const getBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT 
        b.*,
        u.name,
        p.package_name,
        p.base_price
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN packages p ON b.package_id = p.package_id
      WHERE b.booking_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลการจอง" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* =====================================================
   CREATE BOOKING
   POST /api/bookings
===================================================== */
export const createBooking = async (req, res) => {
  const {
    user_id,
    package_id,
    guest_count,
    duration,
    budget,
    full_name,
    contact_email,
    phone,
    line_id,
  } = req.body;

  if (!user_id || !package_id || !guest_count || !full_name || !contact_email) {
    return res.status(400).json({
      message: "กรุณากรอกข้อมูลให้ครบ",
    });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO bookings
      (user_id, package_id, guest_count, duration, budget,
       full_name, contact_email, phone, line_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        package_id,
        guest_count,
        duration,
        budget,
        full_name,
        contact_email,
        phone,
        line_id,
      ]
    );

    res.status(201).json({
      message: "สร้างการจองสำเร็จ",
      booking_id: result.insertId,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* =====================================================
   DELETE BOOKING
   DELETE /api/bookings/:id
===================================================== */
export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM bookings WHERE booking_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "ไม่พบข้อมูลที่ต้องการลบ",
      });
    }

    res.status(200).json({
      message: "ลบการจองสำเร็จ",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
