import db from "../config/db.js";

/* =====================================================
   GET ALL PRODUCTS
   GET /api/inventory/products
===================================================== */
export const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM view_products_full 
      ORDER BY product_id ASC
    `);
    
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   GET INVENTORY STATS (สรุป 4 กล่องด้านบน)
   GET /api/inventory/stats
===================================================== */
export const getInventoryStats = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        COUNT(product_id) AS total_product_types,
        COALESCE(SUM(available_stock), 0) AS total_items_in_stock,
        COUNT(CASE WHEN status_id = 2 THEN 1 END) AS low_stock_items,
        COUNT(CASE WHEN status_id = 3 THEN 1 END) AS out_of_stock_items
      FROM products
    `);
    
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================================
   UPDATE STOCK QUANTITY (ปุ่ม + / -)
   PUT /api/inventory/products/:id
===================================================== */
export const updateStockQuantity = async (req, res) => {
  const { id } = req.params;
  const { new_quantity } = req.body;

  if (new_quantity === undefined) {
    return res.status(400).json({ message: "กรุณาส่งค่า new_quantity มาด้วย" });
  }

  try {
    // คำนวณสถานะอัตโนมัติ (1: พร้อมใช้งาน, 2: ใกล้หมด, 3: หมด)
    let new_status_id = 1;
    if (new_quantity === 0) {
      new_status_id = 3;
    } else if (new_quantity <= 5) { // 5 ชิ้นคือใกล้หมด (เปลี่ยนเลขได้)
      new_status_id = 2;
    }

    const [result] = await db.query(
      `UPDATE products 
       SET available_stock = ?, status_id = ?, updated_at = NOW() 
       WHERE product_id = ?`,
      [new_quantity, new_status_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบสินค้าที่ต้องการอัปเดต" });
    }

    res.status(200).json({
      message: "อัปเดตสต็อกสำเร็จ",
      updated_product_id: id,
      new_quantity: new_quantity,
      new_status_id: new_status_id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};