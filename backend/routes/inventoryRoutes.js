import express from "express";
import multer from "multer"; // นำเข้า multer เพื่อจัดการไฟล์รูป
import path from "path";

import { 
  getAllProducts, 
  getInventoryStats, 
  updateStockQuantity,
  addProduct // เพิ่มการนำเข้า addProduct จาก Controller
} from "../controllers/InventoryController.js";

const router = express.Router();

/* =====================================================
   ตั้งค่า Multer สำหรับอัปโหลดรูปภาพ
===================================================== */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // บันทึกไฟล์ไปที่โฟลเดอร์ uploads/ (ต้องสร้างโฟลเดอร์นี้ไว้ใน backend ด้วยนะครับ)
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    // ตั้งชื่อไฟล์ใหม่ไม่ให้ซ้ำกัน (เช่น 1678901234-image.jpg)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

/* =====================================================
   Routes
===================================================== */

// Route สำหรับดึงข้อมูลสินค้าทั้งหมด
router.get("/products", getAllProducts);

// Route สำหรับดึงข้อมูลสถิติ (4 กล่องด้านบน)
router.get("/stats", getInventoryStats);

// Route สำหรับอัปเดตจำนวนสินค้า
router.put("/products/:id", updateStockQuantity);

// Route ใหม่: สำหรับเพิ่มสินค้า 
// (ต้องใช้ upload.single("image") เพราะ Frontend ของคุณส่งไฟล์มาในคีย์ชื่อ "image")
router.post("/", upload.single("image"), addProduct);

export default router;