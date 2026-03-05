import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Inventory.css";
import "./Workrecord.css";

// ลิ้งก์รูปสำรอง (ถ้าไม่มีรูปจริงๆ จะขึ้นรูปนี้)
const fallbackImage = "https://placehold.co/480x320/2a2a2a/ffffff?text=No+Image";

const API_BASE_URL = "http://localhost:8080/api/inventory";
const BACKEND_URL = "http://localhost:8080"; // กำหนด URL ของหลังบ้าน

export default function Inventory() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    totalKinds: 0,
    remaining: 0,
    lowCount: 0,
    outCount: 0
  });

  const logout = () => {
    localStorage.removeItem("se_remember");
    navigate("/login");
  };

  const getStatusLabel = (remain) => {
    if (remain === 0) return "สินค้าหมด";
    if (remain > 0 && remain <= 5) return "ใกล้หมด";
    return "มีอยู่ในคลัง";
  };

  // ✅ ฟังก์ชันดึงรูป: วิ่งไปหาที่ http://localhost:8080/uploads/...
  const getValidImage = (url) => {
    if (!url || url === "null" || url.trim() === "") return fallbackImage;
    if (url.startsWith("http")) return url;
    
    // จัดการเรื่องเครื่องหมาย / ข้างหน้า
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    
    // เช็คว่าใน Database มีคำว่า /uploads/ บันทึกไว้หรือยัง ถ้ายังให้เติมเข้าไป
    if (cleanPath.includes('/uploads/')) {
      return `${BACKEND_URL}${cleanPath}`;
    } else {
      return `${BACKEND_URL}/uploads${cleanPath}`;
    }
  };

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
  }, []);

  const adjustRemain = async (id, delta) => {
    const current = items.find((it) => it.product_id === id);
    if (!current) return;

    const prevRemain = current.available_stock || 0;
    const newRemain = Math.max(0, prevRemain + delta);

    setItems((prev) =>
      prev.map((it) =>
        it.product_id === id ? { ...it, available_stock: newRemain } : it
      )
    );

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
      setItems((prev) =>
        prev.map((it) =>
          it.product_id === id ? { ...it, available_stock: prevRemain } : it
        )
      );
    }
  };

  return (
    <div className="inv-layout">
      <aside className="wr-sidebar">
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
        <div className="brand-text">SE EVENT</div>
        <div className="brand-sub">Group8.SE@ku.th</div>

        <nav className="nav-menu">
          <Link to="/homepage" className="nav-item">หน้าแรก</Link>
          <Link to="/workrecord" className="nav-item">บันทึกงาน</Link>
          <Link to="/workrecord/status" className="nav-item">สถานะงาน</Link>
          <Link to="#" className="nav-item">ออกแบบ</Link>
          <Link to="/inventory" className="nav-item active">คลัง</Link>
          <Link to="#" className="nav-item">สถานะคลัง</Link>
          <Link to="/budget" className="nav-item">งบประมาณ</Link>
        </nav>

        <button className="logout-btn" onClick={logout}>Log out</button>
      </aside>

      <main className="inv-content">
        <header className="inv-header">
          <h1 className="inv-title">คลังอุปกรณ์</h1>
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
      </main>
    </div>
  );
}