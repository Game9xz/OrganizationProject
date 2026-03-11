import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./InventoryStatus.css";

// 🌟 ปรับตรงนี้: ลบ process.env ออก เพื่อไม่ให้ Vite บัคหน้าจอขาว
const BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/api/borrows`;

export default function InventoryStatus() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]); 
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    job: "",
    borrowDate: "",
    returnDate: "",
    manager: "",
    phone: "",
  });

  // 1. ดึงข้อมูล User ตอนเปิดหน้าเว็บ + ดึงข้อมูลตาราง
  useEffect(() => {
    let storedUser = localStorage.getItem("user");
    if (!storedUser) {
      storedUser = sessionStorage.getItem("user");
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchInventory();
  }, []);

  // ฟังก์ชันดึงข้อมูล (GET)
  const fetchInventory = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 2. ฟังก์ชันเพิ่มข้อมูล (POST)
  const handleAdd = async () => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนทำรายการ");
      return;
    }

    const newItem = {
      user_id: user.user_id || user.id, 
      event_name: formData.job,
      borrow_date: formData.borrowDate,
      return_due_date: formData.returnDate,
      caretaker_name: formData.manager,
      phone: formData.phone,
      status: "ยืมแล้ว", 
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        fetchInventory(); 
        setShowModal(false); 
        setFormData({ job: "", borrowDate: "", returnDate: "", manager: "", phone: "" }); 
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  // 3. ฟังก์ชันกดคืนอุปกรณ์ (PUT)
  const handleReturn = async (id) => {
    if (window.confirm("ยืนยันการคืนอุปกรณ์ใช่หรือไม่?")) {
      try {
        const response = await fetch(`${API_URL}/${id}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "คืนแล้ว" }),
        });

        if (response.ok) {
          fetchInventory(); 
        }
      } catch (error) {
        console.error("Error returning item:", error);
      }
    }
  };

  // 4. ฟังก์ชันลบรายการ (DELETE)
  const handleRemove = async (id) => {
    if (window.confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchInventory(); 
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const checkDueStatus = (returnDate, status) => {
    if (!returnDate) return "normal";
    const today = new Date();
    const due = new Date(returnDate);

    if (status === "คืนแล้ว") {
      return today > due ? "late" : "done";
    }
    return today > due ? "late" : "normal";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dateString.substring(0, 10);
  };

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
          <Link to="/homepage" className="nav-item">หน้าแรก</Link>
          <Link to="/workrecord" className="nav-item">บันทึกงาน</Link>
          <Link to="/workrecord/status" className="nav-item">สถานะงาน</Link>
          <Link to="/design3d" className="nav-item">ออกแบบ</Link>
          <Link to="/inventory" className="nav-item">คลัง</Link>
          <Link to="/inventory/status" className="nav-item active">สถานะคลัง</Link>
          <Link to="/budget" className="nav-item">งบประมาณ</Link>
        </nav>

        <button className="logout-btn" onClick={logout}>Log out</button>
      </aside>

      <main className="inv-content">
        <table className="warehouse-table">
          <thead>
            <tr>
              <th>#</th>
              <th>สถานะ</th>
              <th>วันที่ยืม</th>
              <th>กำหนดคืน</th>
              <th>ชื่องาน</th>
              <th>ชื่อผู้ดูแล</th>
              <th>เบอร์โทร</th>
              <th>Action</th>
              <th>ครบกำหนด</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={item.borrow_id}>
                <td>{index + 1}</td>
                <td>
                  <span className={item.status === "คืนแล้ว" ? "status returned" : "status borrowed"}>
                    {item.status}
                  </span>
                </td>
                <td>{formatDate(item.borrow_date)}</td>
                <td>{formatDate(item.return_due_date)}</td>
                <td>{item.event_name}</td>
                <td>{item.caretaker_name}</td>
                <td>{item.phone}</td>
                <td className="actions">
                  {item.status === "ยืมแล้ว" ? (
                    <>
                      <button className="btn-return" onClick={() => handleReturn(item.borrow_id)}>
                        คืน
                      </button>
                      <button className="btn-cancel" onClick={() => handleRemove(item.borrow_id)}>
                        ลบ
                      </button>
                    </>
                  ) : (
                    <span className="done">✓</span>
                  )}
                </td>
                <td>
                  {checkDueStatus(item.return_due_date, item.status) === "late" ? (
                    <span className="late">เลยกำหนด</span>
                  ) : item.status === "คืนแล้ว" ? (
                    <span className="done">✓</span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}

            {[...Array(Math.max(0, 10 - inventory.length))].map((_, i) => (
              <tr key={"empty" + i}>
                <td>{inventory.length + i + 1}</td>
                <td><span className="status empty">ว่าง</span></td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td><button className="btn-borrow">↩ ยืม</button></td>
                <td>-</td>
              </tr>
            ))}
          </tbody>
        </table>

        {user?.role === "admin" && (
          <button className="add-btn" onClick={() => setShowModal(true)}>
            + เพิ่ม
          </button>
        )}
      </main>

      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <h2>เพิ่มการยืมคืนใหม่</h2>
            <input type="text" name="job" placeholder="ชื่องาน" value={formData.job} onChange={handleChange} />
            <div className="date-row">
              <input type="date" name="borrowDate" value={formData.borrowDate} onChange={handleChange} />
              <input type="date" name="returnDate" value={formData.returnDate} onChange={handleChange} />
            </div>
            <input type="text" name="manager" placeholder="ชื่อผู้ดูแล" value={formData.manager} onChange={handleChange} />
            <input type="text" name="phone" placeholder="เบอร์โทร" value={formData.phone} onChange={handleChange} />
            <button className="btn-save" onClick={handleAdd}>บันทึก</button>
            <button className="btn-close" onClick={() => setShowModal(false)}>ยกเลิก</button>
          </div>
        </div>
      )}
    </div>
  );
}