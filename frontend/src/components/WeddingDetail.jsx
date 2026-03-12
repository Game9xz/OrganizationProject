import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import "./WeddingDetail.css";
import LocationMap from './LocationMap';

const BASE_API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export default function WeddingDetail() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let storedUser = localStorage.getItem("user");
    if (!storedUser) storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const packagePrice = 95500;

  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [selectedDateType, setSelectedDateType] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [guestCount, setGuestCount] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lineId, setLineId] = useState("");
  const [location, setLocation] = useState({ lon: 100.5383, lat: 13.7649, address: "" });

  // 🔥 ปรับให้ตรงกับรายละเอียดแพ็กเกจ (200 - 350 ท่าน)
  const isGuestValid =
    guestCount !== "" &&
    !isNaN(Number(guestCount)) &&
    Number(guestCount) >= 200 &&
    Number(guestCount) <= 350;

  const isDateValid =
    selectedDateType === "custom"
      ? startDate !== "" && endDate !== ""
      : selectedDateType === "3m" ||
        selectedDateType === "6m" ||
        selectedDateType === "1y";

  const isFormComplete =
    isDateValid &&
    isGuestValid &&
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

  const handleSubmit = async () => {
    try {
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

      // 🔥 อัปเดต Payload ให้ถูกต้อง
      const payload = {
        user_id: user?.user_id || 1, // ดึง ID จาก User ที่ล็อกอิน
        package_id: 6,
        guest_count: Number(guestCount),
        duration: "ทั้งวัน",
        budget: packagePrice,
        full_name: name,
        contact_email: email,
        phone: phone,
        line_id: lineId,
        location: location.address, // ส่งเฉพาะ String ชื่อสถานที่
        start_date: startDate || null,
        end_date: endDate || null,
        event_date: event_date,
        event_timeframe: event_timeframe
      };

      const response = await fetch(`${BASE_API}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowSuccess(true);
      } else {
        const data = await response.json();
        alert(`เกิดข้อผิดพลาด: ${data.error || data.message || "ไม่สามารถลงทะเบียนได้"}`);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="wed-container">

      <aside className="sidebar">
        <div className="brand">
          <div className="cat-logo">
            <svg viewBox="0 0 100 100" className="cat-icon">
              <g transform="scale(1.45) translate(-15,-15)">
                <path d="M34 38 L38 24 L50 35 Z" fill="#000"/>
                <path d="M66 38 L62 24 L50 35 Z" fill="#000"/>
                <path d="M20 60 C20 40,40 35,50 35 C60 35,80 40,80 60 C80 75,70 85,50 85 C30 85,20 75,20 60 Z" fill="#000"/>
                <circle cx="42" cy="58" r="6" fill="#fff"/>
                <circle cx="58" cy="58" r="6" fill="#fff"/>
                <circle cx="42" cy="58" r="2.5" fill="#000"/>
                <circle cx="58" cy="58" r="2.5" fill="#000"/>
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

      <main className="wed-content">
        <div className="wed-card">

          <button className="back-btn" onClick={() => navigate("/event/wedding")}>
            ←
          </button>

          <div className="wed-body">
            <img src="/wedding3.jpg" alt="Wedding" className="wed-image"/>

            <div className="wed-text">
              <h2>Wedding Package</h2>

              <p className="price">
                แพ็กเกจจัดงานแต่งงาน ราคา {packagePrice.toLocaleString()} บาท
              </p>

              <p>
                พร้อมทีมดูแลพิธีการแบบครบวงจร ห้องจัดงานขนาดใหญ่
                รวมอาหารและเครื่องดื่ม
              </p>

              <p className="section-title">สิ่งที่รวมในแพ็กเกจ</p>

              <ul>
                <li>จำนวนแขก 200 - 350 ท่าน</li>
                <li>การตกแต่งโต๊ะ VIP และโต๊ะในงาน</li>
                <li>กล่องรับซอง (สำหรับบ่าว)</li>
                <li>ขันหมากของเจ้าบ่าว</li>
                <li>ช่อดอกไม้บ่าว</li>
                <li>มาลัยคล้องคอบ่าวสาว</li>
                <li>อาหารว่างสำหรับบ่าวสาว</li>
                <li>เค้กแต่งงาน</li>
                <li>น้ำดื่ม น้ำอัดลม บริการฟรีตลอดทั้งงาน</li>
                <li>ฟรี ค่าธรรมเนียมบ้านเข้าเครื่องดื่มแอลกอฮอล์ (ยกเว้นเบียร์)</li>
                <li>บริการที่จอดรถสำหรับแขก VIP</li>
                <li>เครื่องฉายโปรเจคเตอร์ พร้อมฉาก</li>
                <li>บริการเครื่องเสียงแบบมาตรฐาน</li>
              </ul>

              <button className="wed-btn" onClick={() => setShowModal(true)}>
                สนใจแพ็กเกจ
              </button>
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="wed-modal-overlay">
          <div className="wed-modal-box">

            <h2>ลงทะเบียน</h2>

            <div className="wed-form-group">
              <label>วันที่กำหนดจัดงาน</label>

              <div className="wed-option-row">

                <div className="date-btn-wrapper">

                  <button
                    type="button"
                    className={`wed-option-btn ${selectedDateType === "custom" ? "active" : ""}`}
                    onClick={() => {
                      setSelectedDateType("custom");
                      setShowDateInput(true);
                    }}
                  >
                    📅 {startDate && endDate ? `${startDate} - ${endDate}` : "ระบุวันที่"}
                  </button>

                  {showDateInput && selectedDateType === "custom" && (
                    <div className="wed-date-popup">
                      <div className="wed-date-range">

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

                <button
                  type="button"
                  className={`wed-option-btn ${selectedDateType === "3m" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedDateType("3m");
                    setShowDateInput(false);
                  }}
                >
                  ภายใน 3 เดือน
                </button>

                <button
                  type="button"
                  className={`wed-option-btn ${selectedDateType === "6m" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedDateType("6m");
                    setShowDateInput(false);
                  }}
                >
                  ภายใน 6 เดือน
                </button>

                <button
                  type="button"
                  className={`wed-option-btn ${selectedDateType === "1y" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedDateType("1y");
                    setShowDateInput(false);
                  }}
                >
                  ภายใน 1 ปี
                </button>

              </div>
            </div>

            <div className="wed-form-group">
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
                    className="location-input"
                    style={{ paddingLeft: '36px', width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* 🔥 เพิ่มช่องกรอกจำนวนแขกตรงนี้ */}
            <div className="wed-form-group" style={{ marginBottom: '10px' }}>
              <label>จำนวนแขก (200 - 350 ท่าน)</label>
              <input 
                type="number" 
                placeholder="ระบุจำนวนแขก" 
                value={guestCount} 
                onChange={(e) => setGuestCount(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px", boxSizing: "border-box" }}
              />
            </div>

            <div className="wed-row-2">
              <input type="text" placeholder="ชื่อ - นามสกุล" value={name} onChange={(e) => setName(e.target.value)}/>
              <input type="text" placeholder="เบอร์โทร" value={phone} onChange={(e) => setPhone(e.target.value)}/>
            </div>

            <div className="wed-row-2">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              <input type="text" placeholder="Line ID" value={lineId} onChange={(e) => setLineId(e.target.value)}/>
            </div>

            <button className="submit-btn" disabled={!isFormComplete} onClick={handleSubmit}>
              ลงทะเบียน
            </button>

            <button className="close-btn" onClick={() => setShowModal(false)}>
              ปิด
            </button>

          </div>
        </div>
      )}

      {showSuccess && (
        <div className="wed-modal-overlay">
          <div className="wed-modal-box success-box">

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