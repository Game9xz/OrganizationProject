import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Inventory.css";
import "./Workrecord.css";

// ลิ้งก์รูปสำรอง (ถ้าไม่มีรูปจริงๆ จะขึ้นรูปนี้)
const fallbackImage = "https://placehold.co/480x320/2a2a2a/ffffff?text=No+Image";

// 1. ดึง URL หลักจาก Railway (ถ้ามี) หรือใช้ Localhost เป็นตัวสำรอง
const BASE_API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// 2. ต่อท้ายด้วย /inventory สำหรับยิง API ในหน้านี้
const API_BASE_URL = `${BASE_API}/inventory`;

// 3. ตัดคำว่า /api ออก เพื่อเอาไว้ดึงรูปภาพจากโฟลเดอร์ uploads
const BACKEND_URL = BASE_API.replace('/api', '');

export default function Inventory() {
  const navigate = useNavigate();

  // 1. State สำหรับเก็บข้อมูลสินค้าและสถิติ (ดึงจาก Backend)
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    totalKinds: 0,
    remaining: 0,
    lowCount: 0,
    outCount: 0
  });

  // 2. State สำหรับเปิด-ปิด Modal เพิ่มสินค้า
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    remain: 0,
    imageFile: null,
    previewUrl: "",
  });

  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  // ฟังก์ชันแปลงสถานะสต็อก
  const getStatusLabel = (remain) => {
    if (remain === 0) return "สินค้าหมด";
    if (remain > 0 && remain <= 5) return "ใกล้หมด";
    return "มีอยู่ในคลัง";
  };

  // ฟังก์ชันดึงรูปจาก Backend ให้ถูกต้อง
  const getValidImage = (url) => {
    if (!url || url === "null" || url.trim() === "") return fallbackImage;
    if (url.startsWith("http")) return url;

    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    if (cleanPath.includes('/uploads/')) {
      return `${BACKEND_URL}${cleanPath}`;
    } else {
      return `${BACKEND_URL}/uploads${cleanPath}`;
    }
  };

  // ดึงข้อมูลจาก Backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalKinds: data.total_product_types || 0,
          remaining: data.total_items_in_stock || 0,
          lowCount: data.low_stock_items || 0,
          outCount: data.out_of_stock_items || 0
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchStats();

    let storedUser = localStorage.getItem("user");
    if (!storedUser) {
      storedUser = sessionStorage.getItem("user");
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ฟังก์ชันกดบวก-ลบ จำนวนสินค้า
  const adjustRemain = async (id, delta) => {
    const current = items.find((it) => it.product_id === id);
    if (!current) return;

    const prevRemain = current.available_stock || 0;
    const newRemain = Math.max(0, prevRemain + delta);

    // อัปเดตหน้าเว็บทันที (Optimistic update)
    setItems((prev) =>
      prev.map((it) =>
        it.product_id === id ? { ...it, available_stock: newRemain } : it
      )
    );

    // ส่งไปอัปเดตที่หลังบ้าน
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_quantity: newRemain }),
      });

      if (response.ok) {
        fetchStats();
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      // ถ้า Error ให้คืนค่าเดิม
      setItems((prev) =>
        prev.map((it) =>
          it.product_id === id ? { ...it, available_stock: prevRemain } : it
        )
      );
    }
  };

  // --------- ส่วนของการจัดการ Modal เพิ่มสินค้า ---------

  const handleOpenAdd = () => {
    setNewItem({ name: "", remain: 0, imageFile: null, previewUrl: "" });
    setIsAddOpen(true);
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewItem((p) => ({ ...p, imageFile: file, previewUrl: url }));
    }
  };

  const handleSaveNew = async () => {
    const name = newItem.name.trim();
    const remain = Number(newItem.remain) || 0;
    if (!name) {
      alert("กรุณากรอกชื่อสินค้า");
      return;
    }

    // สร้างข้อมูลชั่วคราวเพื่อให้หน้าเว็บแสดงผลทันที (รอข้อมูลจริงจาก Backend)
    const tempId = Math.max(0, ...items.map((i) => i.product_id || 0)) + 1;
    const optimistic = {
      product_id: tempId,
      product_name: name,
      available_stock: remain,
      image_url: newItem.previewUrl || fallbackImage,
    };

    setItems((prev) => [optimistic, ...prev]);
    closeAddModal();

    // ส่งข้อมูลไป Backend
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("remain", String(remain));
      if (newItem.imageFile) form.append("image", newItem.imageFile);

      // ใช้ API_BASE_URL แทน /api/inventory เฉยๆ เพื่อให้เชื่อมหลังบ้านได้
      const res = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        // ถ้าเซฟสำเร็จ โหลดข้อมูลใหม่ทั้งหมดเพื่อให้ ID และรูปภาพตรงกับ Database
        fetchProducts();
        fetchStats();
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // -----------------------------------------------------------------------------------

  return (
    <div className="inv-layout">
      <aside className="ws-sidebar">
        <div className="brand-logo">
          <svg className="cat-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M34 38 L38 24 L50 35 Z" fill="#000" />
            <path d="M66 38 L62 24 L50 35 Z" fill="#000" />
            <path d="M20 60 C20 40, 40 35, 50 35 C60 35, 80 40, 80 60 C80 75, 70 85, 50 85 C30 85, 20 75, 20 60 Z" fill="#000" />
            <circle cx="42" cy="58" r="6" fill="#fff" />
            <circle cx="58" cy="58" r="6" fill="#fff" />
            <circle cx="42" cy="58" r="2.5" fill="#000" />
            <circle cx="58" cy="58" r="2.5" fill="#000" />
          </svg>
        </div>
        <div className="brand-text">{user?.username}</div>
        <div className="brand-sub">{user?.email}</div>

        <nav className="nav-menu">
          <Link to="/homepage" className="nav-item">
            หน้าแรก
          </Link>
          <Link to="/workrecord" className="nav-item">
            บันทึกงาน
          </Link>
          <Link to="/workrecord/status" className="nav-item">
            สถานะงาน
          </Link>
          <Link to="#" className="nav-item">
            ออกแบบ
          </Link>
          <Link to="/inventory" className="nav-item active">
            คลัง
          </Link>
          <Link to="/inventory/status" className="nav-item">
            สถานะคลัง
          </Link>
          <Link to="/budget" className="nav-item">
            งบประมาณ
          </Link>
        </nav>

        <button className="logout-btn" onClick={logout}>Log out</button>
      </aside>

      <main className="inv-content">
        <header className="inv-header">
          <h1 className="inv-title">คลังอุปกรณ์</h1>
          <div className="inv-actions">
            <button className="inv-add-btn" onClick={handleOpenAdd}>
              + เพิ่มสินค้าใหม่
            </button>
          </div>
          <div className="inv-stats">
            <div className="stat blue">
              <div className="stat-label">สินค้าทั้งหมด</div>
              <div className="stat-value">{stats.totalKinds} ชิ้น</div>
            </div>
            <div className="stat green">
              <div className="stat-label">คงเหลือทั้งหมด</div>
              <div className="stat-value">{stats.remaining} ชิ้น</div>
            </div>
            <div className="stat orange">
              <div className="stat-label">สินค้าใกล้หมด</div>
              <div className="stat-value">{stats.lowCount} รายการ</div>
            </div>
            <div className="stat red">
              <div className="stat-label">สินค้าหมด</div>
              <div className="stat-value">{stats.outCount} รายการ</div>
            </div>
          </div>
        </header>

        <section className="inv-grid">
          {items.map((it) => (
            <article key={it.product_id} className="inv-card">
              <div className="inv-card-image">
                <img
                  src={getValidImage(it.image_url)}
                  alt={it.product_name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                  style={{ width: "100%", height: "100%", minHeight: "150px", objectFit: "cover", display: "block", backgroundColor: "#fff" }}
                />

                {it.available_stock > 0 && it.available_stock <= 5 && <span className="badge orange">ใกล้หมด</span>}
                {it.available_stock === 0 && <span className="badge red">หมด</span>}
              </div>
              <div className="inv-card-body">
                <div className="inv-name">{it.product_name}</div>
                <div className="inv-meta">
                  <span>คงเหลือ: {it.available_stock}</span>
                  <span>สถานะ: {getStatusLabel(it.available_stock)}</span>
                </div>
                <div className="inv-controls">
                  <button
                    className="inv-btn minus"
                    onClick={() => adjustRemain(it.product_id, -1)}
                    disabled={it.available_stock <= 0}
                  >
                    −
                  </button>
                  <button
                    className="inv-btn plus"
                    onClick={() => adjustRemain(it.product_id, +1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {isAddOpen && (
          <div className="inv-modal-overlay">
            <div className="inv-modal">
              <div className="inv-modal-title">เพิ่มสินค้าใหม่</div>
              <div className="inv-form">
                <label className="inv-field">
                  <span>ชื่อสินค้า</span>
                  <input
                    className="inv-input"
                    value={newItem.name}
                    onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                    placeholder="เช่น โต๊ะจัดเลี้ยง"
                  />
                </label>
                <label className="inv-field">
                  <span>จำนวนเริ่มต้น</span>
                  <input
                    type="number"
                    min="0"
                    className="inv-input"
                    value={newItem.remain}
                    onChange={(e) =>
                      setNewItem((p) => ({ ...p, remain: Math.max(0, Number(e.target.value || 0)) }))
                    }
                  />
                </label>
                <label className="inv-field">
                  <span>รูปภาพ</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>
                {newItem.previewUrl && (
                  <div className="inv-preview">
                    <img src={newItem.previewUrl} alt="preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
                  </div>
                )}
              </div>
              <div className="inv-modal-actions">
                <button className="inv-cancel" onClick={closeAddModal}>
                  ยกเลิก
                </button>
                <button className="inv-save" onClick={handleSaveNew}>
                  เพิ่มสินค้า
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}