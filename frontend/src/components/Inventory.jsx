import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Inventory.css";
import "./Workrecord.css";

const placeholder = "https://via.placeholder.com/480x320?text=%E0%B9%83%E0%B8%AA%E0%B9%88%E0%B8%A5%E0%B8%B4%E0%B8%87%E0%B8%81%E0%B9%8C%E0%B8%A3%E0%B8%B9%E0%B8%9B";

export default function Inventory() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("se_remember");
    navigate("/login");
  };

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    remain: 0,
    imageFile: null,
    previewUrl: "",
  });

  const statusLabel = (s) =>
    s === "available" ? "มีอยู่ในคลัง" : s === "low" ? "ใกล้หมด" : "สินค้าหมด";

  const TOTAL_KINDS = 218;
  const LOW_THRESHOLD = 5;

  const initialItems = useMemo(() => [
    { id: 1, name: "โต๊ะจัดเลี้ยง", status: "available", remain: 24, location: "คลัง A", imageUrl: "https://www.thanawantent.com/wp-content/uploads/2013/08/%E0%B9%82%E0%B8%95%E0%B9%8A%E0%B8%B0%E0%B8%88%E0%B8%B5%E0%B8%99-2.jpg" },
    { id: 2, name: "เก้าอี้/โต๊ะ งานเลี้ยง", status: "available", remain: 150, location: "คลัง A", imageUrl: "https://thesun-service.com/wp-content/uploads/2015/09/318792099_610877087707432_7631995644192319998_n-e1673236637830.jpg" },
    { id: 3, name: "แบคดรอป", status: "available", remain: 12, location: "คลัง B", imageUrl: "https://piteereetong.com/wp-content/uploads/2025/07/backdrop7-768x563.jpg" },
    { id: 4, name: "โต๊ะวางอาหาร", status: "low", remain: 4, location: "คลัง C", imageUrl: "https://www.leoaroydee.com/images/articles/15/1579771192.jpg" },
    { id: 5, name: "โลงศพ/หีบศพ", status: "available", remain: 7, location: "คลัง D", imageUrl: "https://suriyacoffin.com/wp-content/uploads/2021/02/%E0%B8%AB%E0%B8%B5%E0%B8%9A%E0%B8%A8%E0%B8%9E%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%9E%E0%B8%99%E0%B8%A1%E0%B8%90%E0%B8%B2%E0%B8%99-2-%E0%B8%8A%E0%B8%B1%E0%B9%89%E0%B8%9912.png" },
    { id: 6, name: "แท่นวางเชิงตะเกียง", status: "out", remain: 0, location: "คลัง D", imageUrl: "https://longyen.com/wp-content/uploads/2022/09/%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%87%E0%B8%95%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%99%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88%E0%B8%94%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%87-1024x768.jpg" },
    { id: 7, name: "พวงหรีด", status: "available", remain: 36, location: "คลัง D", imageUrl: "https://care-nation.com/wp-content/uploads/2024/07/11-2.jpg" },
    { id: 8, name: "โต๊ะหมู่บูชา", status: "low", remain: 3, location: "คลัง D", imageUrl: "https://webucha.com/wp-content/uploads/2023/05/347833342_599287042169544_2863022732239803083_n.jpg" },
    { id: 9, name: "อาสนะ/เบาะรองนั่ง", status: "available", remain: 14, location: "คลัง D", imageUrl: "https://th-test-11.slatic.net/shop/e2c838bd7ffaedda987e2338b5bbdc92.png" },
    { id: 10, name: "โต๊ะวางเครื่องไทยธรรม", status: "available", remain: 9, location: "คลัง D", imageUrl: "https://www.lemon8-app.com/seo/image?item_id=7281587149143998978&index=2&sign=e08912d7206364ba1bfb69c4eb50baae" },
    { id: 11, name: "Mixer ควบคุมเสียง", status: "available", remain: 5, location: "คลัง E", imageUrl: "https://audiocity.co.th/pub/media/catalog/product/cache/4ee3bf760cfa501fe365bbe67aa296db/y/a/yamaha-mgx12_1.jpg" },
    { id: 12, name: "ลำโพง", status: "available", remain: 10, location: "คลัง E", imageUrl: "https://siamsoundstore.com/wp-content/uploads/2020/02/ev_sxa250_powered_loudspeaker.jpg" },
    { id: 13, name: "ไมโครโฟน", status: "available", remain: 18, location: "คลัง E", imageUrl: "https://media.ctmusicshop.com/wp-content/uploads/2022/08/26040823/GOLD.jpg" },
    { id: 14, name: "ไฟเวที", status: "low", remain: 2, location: "คลัง E", imageUrl: "https://image.made-in-china.com/202f0j00LreqRSwsyibm/Easy-Install-Wedding-Stage-Equipment-Lighting-Truss-Decoration-Truss.webp" },
    { id: 15, name: "ไฟประดับ", status: "available", remain: 40, location: "คลัง E", imageUrl: "https://down-th.img.susercontent.com/file/sg-11134201-22110-lt8n01t8qhkv06" },
  ], []);
  const [items, setItems] = useState(initialItems);

  const stats = useMemo(() => {
    const remaining = items
      .filter((it) => it.status !== "out")
      .reduce((s, it) => s + (it.remain || 0), 0);
    const lowCount = items.filter((it) => it.status === "low").length;
    const outCount = items.filter((it) => it.status === "out").length;
    const totalKinds = items.length; // ใช้จำนวนชนิดจริงในหน้า
    return { totalKinds, remaining, lowCount, outCount };
  }, [items]);

  const adjustRemain = async (id, delta) => {
    const current = items.find((it) => it.id === id);
    const prevRemain = current ? current.remain || 0 : 0;
    const newRemain = Math.max(0, prevRemain + delta);
    const newStatus =
      newRemain === 0 ? "out" : newRemain <= LOW_THRESHOLD ? "low" : "available";
    const prevStatus =
      prevRemain === 0 ? "out" : prevRemain <= LOW_THRESHOLD ? "low" : "available";

    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, remain: newRemain, status: newStatus } : it,
      ),
    );
    try {
      await fetch(`/api/inventory/${id}/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta, remain: newRemain, status: newStatus }),
      });
    } catch {
      // rollback if request failed
      setItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, remain: prevRemain, status: prevStatus } : it,
        ),
      );
    }
  };

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
    const status = remain === 0 ? "out" : remain <= LOW_THRESHOLD ? "low" : "available";
    const id = Math.max(0, ...items.map((i) => i.id)) + 1;
    const optimistic = {
      id,
      name,
      remain,
      status,
      location: "คลัง A",
      imageUrl: newItem.previewUrl || placeholder,
    };
    setItems((prev) => [optimistic, ...prev]);
    closeAddModal();

    try {
      const form = new FormData();
      form.append("name", name);
      form.append("remain", String(remain));
      form.append("status", status);
      if (newItem.imageFile) form.append("image", newItem.imageFile);

      const res = await fetch("/api/inventory", {
        method: "POST",
        body: form,
      });
      if (res.ok) {
        const created = await res.json().catch(() => null);
        if (created && created.id) {
          setItems((prev) =>
            prev.map((it) =>
              it.id === id
                ? {
                    ...it,
                    id: created.id,
                    imageUrl: created.imageUrl || it.imageUrl,
                  }
                : it,
            ),
          );
        }
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="inv-layout">
      <aside className="wr-sidebar">
        <div className="brand-logo">
          <svg
            className="cat-icon"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M34 38 L38 24 L50 35 Z" fill="#000" />
            <path d="M66 38 L62 24 L50 35 Z" fill="#000" />
            <path
              d="M20 60 C20 40, 40 35, 50 35 C60 35, 80 40, 80 60 C80 75, 70 85, 50 85 C30 85, 20 75, 20 60 Z"
              fill="#000"
            />
            <circle cx="42" cy="58" r="6" fill="#fff" />
            <circle cx="58" cy="58" r="6" fill="#fff" />
            <circle cx="42" cy="58" r="2.5" fill="#000" />
            <circle cx="58" cy="58" r="2.5" fill="#000" />
          </svg>
        </div>
        <div className="brand-text">SE EVENT</div>
        <div className="brand-sub">Group8.SE@ku.th</div>

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
          <Link to="#" className="nav-item">
            สถานะคลัง
          </Link>
          <Link to="/budget" className="nav-item">
            งบประมาณ
          </Link>
        </nav>

        <button className="logout-btn" onClick={logout}>
          Log out
        </button>
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
            <article key={it.id} className="inv-card">
              <div className="inv-card-image">
                <img src={it.imageUrl || placeholder} alt={it.name} />
                {it.status === "low" && <span className="badge orange">ใกล้หมด</span>}
                {it.status === "out" && <span className="badge red">หมด</span>}
              </div>
              <div className="inv-card-body">
                <div className="inv-name">{it.name}</div>
                <div className="inv-meta">
                  <span>คงเหลือ: {it.remain}</span>
                  <span>สถานะ: {statusLabel(it.status)}</span>
                </div>
                <div className="inv-actions-row">
                  <div className="inv-controls">
                    <button
                      className="inv-btn minus"
                      onClick={() => adjustRemain(it.id, -1)}
                      disabled={it.remain <= 0}
                    >
                      −
                    </button>
                    <button
                      className="inv-btn plus"
                      onClick={() => adjustRemain(it.id, +1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="inv-delete"
                    onClick={async () => {
                      const prev = items;
                      setItems((p) => p.filter((x) => x.id !== it.id));
                      try {
                        await fetch(`/api/inventory/${it.id}`, { method: "DELETE" });
                      } catch {
                        setItems(prev);
                      }
                    }}
                    aria-label="ลบสินค้า"
                    title="ลบสินค้า"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
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
                    <img src={newItem.previewUrl} alt="preview" />
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
