import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import "./OrdinationPackageDetail.css";
import LocationMap from './LocationMap';

// 1. ดึง URL หลักจาก Railway (ถ้ามี) หรือใช้ Localhost เป็นตัวสำรอง
const BASE_API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export default function OrdinationPackageDetail() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let storedUser = localStorage.getItem("user");
    if (!storedUser) {
      storedUser = sessionStorage.getItem("user");
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  // 🔥 กำหนดราคาแพ็กเกจงานบวชที่นี่
  const packagePrice = 79999;

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Date
  const [selectedDateType, setSelectedDateType] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Contact
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lineId, setLineId] = useState("");

  // Location
  const [location, setLocation] = useState({ lon: 100.5383, lat: 13.7649, address: "" });

  /* ===============================
     VALIDATION
  =============================== */

  const isDateValid =
    selectedDateType === "custom"
      ? startDate !== "" && endDate !== ""
      : selectedDateType === "3m" ||
        selectedDateType === "6m" ||
        selectedDateType === "1y";

  const isFormComplete =
    isDateValid &&
    name.trim() !== "" &&
    phone.trim() !== "" &&
    email.trim() !== "" &&
    lineId.trim() !== "" &&
    location.address.trim() !== "";

  const handleLocationChange = (loc) => {
    setLocation(loc);
  };

  const handleAddressSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (location.address && mapRef.current) {
        mapRef.current.searchLocation(location.address);
      }
    }
  };

  /* ================= SUBMIT TO DATABASE ================= */
  const handleSubmit = async () => {
    try {
      // 1. จัดเตรียมข้อมูลวันที่ให้ตรงกับ Database
      let event_timeframe = null;
      let event_date = null;

      if (selectedDateType === "custom") {
        event_date = `${startDate} - ${endDate}`;
      } else if (selectedDateType === "3m") {
        event_timeframe = "ภายใน 3 เดือน";
      } else if (selectedDateType === "6m") {
        event_timeframe = "ภายใน 6 เดือน";
      } else if (selectedDateType === "1y") {
        event_timeframe = "ภายใน 1 ปี";
      }

      // 2. สร้าง Payload
      const payload = {
        user_id: 1, // หมายเหตุ: สมมติค่าเป็น 1 ไว้ก่อน
        package_id: 4, // 🔥 สมมติแพ็กเกจนี้ id = 4 (งานบวช)
        duration: "ทั้งวัน",
        budget: packagePrice,
        full_name: name,
        contact_email: email,
        phone: phone,
        line_id: lineId,
        location: location,
        start_date: startDate || null,
        end_date: endDate || null,
        event_date: event_date,
        event_timeframe: event_timeframe
      };

      // 3. ยิง API บันทึกลงฐานข้อมูล
      const response = await fetch(`${BASE_API}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowSuccess(true);
      } else {
        const data = await response.json();
        alert(`เกิดข้อผิดพลาด: ${data.message || "ไม่สามารถลงทะเบียนได้"}`);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="ordpkg-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">

          <div className="cat-logo">
            <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className="cat-icon"
            >
              <g transform="scale(1.45) translate(-15,-15)">
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
              </g>
            </svg>
          </div>

          <h3>{user?.username}</h3>
          <span>{user?.email}</span>
        </div>

        <ul className="menu">
          <li onClick={() => navigate("/homepage")}>หน้าแรก</li>
          <li>บันทึกงาน</li>
          <li>สถานะงาน</li>
          <li>ออกแบบ</li>
          <li>คลัง</li>
          <li>สถานะคลัง</li>
          <li>งบประมาณ</li>
        </ul>

        <button className="logout">Log out</button>
      </aside>

      {/* Main */}
      <main className="ordpkg-content">
        <div className="ordpkg-card">
          <button
            className="back-btn"
            onClick={() => navigate("/event/ordination")}
          >
            ←
          </button>

          <div className="ordpkg-body">
            <img
              src="/ordination2.jpg"
              alt="Ordination Package"
              className="ordpkg-image"
            />

            <div className="ordpkg-text">
              <h2>Ordination Ceremony</h2>

              <p className="price">
                แพ็กเกจงานบวชครบวงจร ราคา {packagePrice.toLocaleString()} บาท
              </p>

              <p>
                รวมครบทุกพิธีการตั้งแต่เช้าจนจบงาน
                พร้อมทีมงานมืออาชีพดูแลตลอดงาน
              </p>

              <p className="section-title">สิ่งที่รวมในแพ็กเกจ</p>

              <ul>
                <li>พิธีโกนผมนาค และพิธีอุปสมบท</li>
                <li>ชุดเครื่องบวชครบชุด</li>
                <li>ดอกไม้ตกแต่งสถานที่</li>
                <li>อาหารเลี้ยงแขก</li>
                <li>โต๊ะจีน / บุฟเฟต์</li>
                <li>ระบบเครื่องเสียง</li>
                <li>ทีมงานดูแลตลอดงาน</li>
              </ul>

              <button
                className="ordpkg-btn"
                onClick={() => setShowModal(true)}
              >
                สนใจแพ็กเกจ
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box large">
            <h2>ลงทะเบียน</h2>

            <div className="form-group">
              <label>วันที่กำหนดจัดงาน</label>

              <div className="option-row">
                <button
                  className={`option-btn ${selectedDateType === "custom" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedDateType("custom");
                    setShowDateInput(true);
                  }}
                >
                  📅 {startDate && endDate
                    ? `${startDate} - ${endDate}`
                    : "ระบุวันที่"}
                </button>

                <button
                  className={`option-btn ${selectedDateType === "3m" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedDateType("3m");
                    setShowDateInput(false);
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  ภายใน 3 เดือน
                </button>

                <button
                  className={`option-btn ${selectedDateType === "6m" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedDateType("6m");
                    setShowDateInput(false);
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  ภายใน 6 เดือน
                </button>

                <button
                  className={`option-btn ${selectedDateType === "1y" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedDateType("1y");
                    setShowDateInput(false);
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  ภายใน 1 ปี
                </button>
              </div>

              {showDateInput && (
                <div className="date-popup">
                  <div className="date-range">
                    <input
                      type="date"
                      value={startDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span>ถึง</span>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        if (startDate && e.target.value) {
                          setShowDateInput(false);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* สถานที่ */}
            <div className="form-group">
              <label>สถานที่จัดงาน</label>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <LocationMap 
                  ref={mapRef}
                  onLocationChange={handleLocationChange} 
                  initialLocation={location}
                />
                <div className="address-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '12px', color: '#6b7280' }}>📍</span>
                  <input
                    type="text"
                    placeholder="พิมพ์ชื่อสถานที่แล้วกด Enter เพื่อค้นหา"
                    value={location.address}
                    onChange={(e) => setLocation({ ...location, address: e.target.value })}
                    onKeyDown={handleAddressSearch}
                    style={{ paddingLeft: '36px', width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* ข้อมูลติดต่อ */}
            <div className="row-2">
              <input
                type="text"
                placeholder="ชื่อ - นามสกุล"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="เบอร์โทร"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="row-2">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Line ID"
                value={lineId}
                onChange={(e) => setLineId(e.target.value)}
              />
            </div>

            <button
              className="submit-btn"
              disabled={!isFormComplete}
              onClick={handleSubmit}
            >
              ลงทะเบียน
            </button>

            <button
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-box success-box">
            <h2>ลงทะเบียนเสร็จสิ้น</h2>
            <div className="success-icon">✔</div>
            <p>ติดต่อสอบถามได้ที่</p>
            <p>📧 cpe_group8@ku.th</p>
            <p>📞 089-999-9999</p>

            <button
              className="submit-btn"
              onClick={() => {
                setShowSuccess(false);
                setShowModal(false);
              }}
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}