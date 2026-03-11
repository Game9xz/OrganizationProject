import db from "../config/db.js"; // เปลี่ยน path ให้ตรงกับไฟล์เชื่อมต่อ Database ของคุณ

// 1. ดึงรายการยืม-คืนทั้งหมด
export const getAllBorrows = (req, res) => {
  const sql = "SELECT * FROM borrow_records ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching borrow records:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

// 2. เพิ่มรายการยืม-คืนใหม่
export const createBorrow = (req, res) => {
  const { user_id, event_name, borrow_date, return_due_date, caretaker_name, phone, status } = req.body;
  
  const sql = `
    INSERT INTO borrow_records 
    (user_id, event_name, borrow_date, return_due_date, caretaker_name, phone, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const currentStatus = status || 'ยืมแล้ว';

  db.query(sql, [user_id, event_name, borrow_date, return_due_date, caretaker_name, phone, currentStatus], (err, result) => {
    if (err) {
      console.error("Error creating borrow record:", err);
      return res.status(500).json({ error: "Failed to create record" });
    }
    res.status(201).json({ message: "Record created successfully", id: result.insertId });
  });
};

// 3. อัปเดตสถานะ (เช่น กดปุ่ม "คืน")
export const updateBorrowStatus = (req, res) => {
  const borrowId = req.params.id;
  const { status } = req.body; 

  const sql = "UPDATE borrow_records SET status = ? WHERE borrow_id = ?";
  
  db.query(sql, [status, borrowId], (err, result) => {
    if (err) {
      console.error("Error updating status:", err);
      return res.status(500).json({ error: "Failed to update status" });
    }
    res.json({ message: "Status updated successfully" });
  });
};

// 4. ลบรายการ
export const deleteBorrow = (req, res) => {
  const borrowId = req.params.id;

  const sql = "DELETE FROM borrow_records WHERE borrow_id = ?";
  
  db.query(sql, [borrowId], (err, result) => {
    if (err) {
      console.error("Error deleting record:", err);
      return res.status(500).json({ error: "Failed to delete record" });
    }
    res.json({ message: "Record deleted successfully" });
  });
};