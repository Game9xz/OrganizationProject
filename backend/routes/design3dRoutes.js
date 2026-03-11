import express from "express";
import db from "../config/db.js";

const router = express.Router();

// 1. API สำหรับบันทึกโปรเจกต์
router.post("/save-project", async (req, res) => {
  try {
    const { name, layout } = req.body; // layout คือ JSON string จาก captureState
    const sql = "INSERT INTO projects (project_name, layout_data) VALUES (?, ?)";
    const [result] = await db.query(sql, [name, layout]);
    res.json({ message: "บันทึกสำเร็จ!", id: result.insertId });
  } catch (error) {
    console.error("Error saving project:", error);
    res.status(500).json(error);
  }
});

// 2. API สำหรับดึงรายชื่อโปรเจกต์ทั้งหมด (เอามาโชว์ใน Modal)
router.get("/projects", async (req, res) => {
  try {
    const sql = "SELECT id, project_name, created_at FROM projects ORDER BY created_at DESC";
    const [results] = await db.query(sql);
    res.json(results);
  } catch (error) {
    console.error("ดึงรายชื่อไม่สำเร็จ:", error);
    res.status(500).send(error);
  }
});

// 3. API สำหรับดึงข้อมูล Layout ของโปรเจกต์นั้นๆ (เมื่อกดปุ่ม โหลดงาน)
router.get("/projects/:id", async (req, res) => {
  try {
    const sql = "SELECT layout_data FROM projects WHERE id = ?";
    const [result] = await db.query(sql, [req.params.id]);
    
    if (result.length === 0) return res.status(404).send("ไม่พบโปรเจกต์");
    res.json(result[0]);
  } catch (error) {
    console.error("ดึงข้อมูล Layout ไม่สำเร็จ:", error);
    res.status(500).send(error);
  }
});

// 4. API สำหรับลบโปรเจกต์
router.delete("/projects/:id", async (req, res) => {
  try {
    const sql = "DELETE FROM projects WHERE id = ?";
    await db.query(sql, [req.params.id]);
    res.send({ message: "Deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).send(error);
  }
});

export default router;
