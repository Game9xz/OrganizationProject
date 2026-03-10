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
/* =====================================================
   ADD NEW PRODUCT
   POST /api/inventory
===================================================== */
export const addProduct = async (req, res) => {
  try {
    const { name, remain } = req.body;
    let image_url = null;

    // ถ้ามีการแนบไฟล์รูปภาพมา (เดี๋ยวเราต้องใช้ multer จัดการที่ไฟล์ routes)
    if (req.file) {
      image_url = `uploads/${req.file.filename}`;
    }

    // คำนวณสถานะอัตโนมัติ (1: พร้อมใช้งาน, 2: ใกล้หมด, 3: หมด)
    let status_id = 1;
    if (remain == 0) {
      status_id = 3;
    } else if (remain <= 5) {
      status_id = 2;
    }

    // ทำการเพิ่มข้อมูลลง Database
    // หมายเหตุ: category_id และ unit_price ผมใส่ค่าเริ่มต้นเป็น 1 และ 0 ไว้ก่อน ถ้าในอนาคตมีให้กรอก ค่อยมารับค่าเพิ่มครับ
    const [result] = await db.query(
      `INSERT INTO products (product_name, total_stock, available_stock, status_id, image_url, category_id, unit_price, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, 1, 0, NOW(), NOW())`,
      [name, remain, remain, status_id, image_url]
    );

    res.status(201).json({ 
      message: "เพิ่มสินค้าสำเร็จ", 
      product_id: result.insertId 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/* =====================================================
   DELETE PRODUCT
   DELETE /api/inventory/products/:id
===================================================== */
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      `DELETE FROM products WHERE product_id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบสินค้าที่ต้องการลบ" });
    }

    res.status(200).json({ 
      message: "ลบสินค้าสำเร็จ", 
      deleted_product_id: id 
    });

  } catch (err) {
    // ดักจับ Error กรณีติด Foreign Key (ถูกนำไปใช้งานอยู่ ลบไม่ได้)
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: "ไม่สามารถลบได้เนื่องจากสินค้านี้ถูกจัดอยู่ในแพ็กเกจหรือถูกจองไปแล้ว" });
    }
    res.status(500).json({ error: err.message });
  }
};