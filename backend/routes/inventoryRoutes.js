import express from "express";
// ✅ แก้ไข: เปลี่ยนจาก inventoryController.js (ตัว i เล็ก) เป็น InventoryController.js (ตัว I ใหญ่)
import { 
  getAllProducts, 
  getInventoryStats, 
  updateStockQuantity 
} from "../controllers/InventoryController.js";

const router = express.Router();

// Route สำหรับดึงข้อมูลสินค้าทั้งหมด
router.get("/products", getAllProducts);

// Route สำหรับดึงข้อมูลสถิติ (4 กล่องด้านบน)
router.get("/stats", getInventoryStats);

// Route สำหรับอัปเดตจำนวนสินค้า
router.put("/products/:id", updateStockQuantity);

export default router;