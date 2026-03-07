import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./WeddingDetail.css";

// 1. ดึง URL หลักจาก Railway (ถ้ามี) หรือใช้ Localhost เป็นตัวสำรอง
const BASE_API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export default function WeddingDetail() {
  const navigate = useNavigate();

  // 🔥 กำหนดราคาแพ็กเกจงานแต่งที่นี่
  const packagePrice = 95500;

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Date
  const [selectedDateType, setSelectedDateType] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Guest
  const [guestCount, setGuestCount] = useState("");

  // Form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lineId, setLineId] = useState("");
  const [location, setLocation] = useState("");

  /* ===============================
     VALIDATION
  =============================== */

  const isGuestValid =
    guestCount !== "" &&
    !isNaN(Number(guestCount)) &&
    Number(guestCount) >= 250 &&
    Number(guestCount) <= 450;

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
    location.trim() !== "";

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
        user_id: 1, // หมายเหตุ: สมมติค่า User ID เป็น 1 ไว้ก่อน
        package_id: 6, // 🔥 สมมติแพ็กเกจนี้ id = 6 (Wedding)
        guest_count: Number(guestCount),
        duration: "ทั้งวัน", // งานแต่งแบบครบวงจร
        budget: packagePrice, // ส่งราคา 95500 เข้าไป
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

      // 3. ยิง API บันทึกลงฐานข้อมูล (ใช้ BASE_API)
      const response = await fetch(`${BASE_API}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // ถ้าบันทึกสำเร็จ ให้แสดงหน้าต่าง Success
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
    <div className="wed-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <h3>SE EVENT</h3>
          <span>Group8@ku.th</span>
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
      <main className="wed-content">
        <div className="wed-card">
          <button
            className="back-btn"
            onClick={() => navigate("/event/wedding")}
          >
            ←
          </button>

          <div className="wed-body">
            <img src="/wedding3.jpg" alt="Wedding" className="wed-image" />

            <div className="wed-text">
              <h2>Wedding Package</h2>

              {/* 🔥 ดึงราคาจากตัวแปรมาแสดง */}
              <p className="price">
                แพ็กเกจจัดงานแต่งงาน ราคา {packagePrice.toLocaleString()} บาท
              </p>

              <p>
                พร้อมทีมดูแลพิธีการแบบครบวงจร ห้องจัดงานขนาดใหญ่
                รวมอาหารและเครื่องดื่ม
              </p>

              <ul>
                <li>อาหารสำหรับแขก 250 - 450 ท่าน</li>
                <li>การตกแต่งเวที VIP และโต๊ะในงาน</li>
                <li>กล่องรับซอง (สำหรับยืม)</li>
                <li>ชั้นวางของชำร่วย</li>
                <li>ช่อดอกไม้บูเก้</li>
                <li>มาลัยคล้องคอบ่าวสาว</li>
                <li>น้ำดื่ม, น้ำอัดลม บริการฟรีตลอดทั้งงาน</li>
                <li>ฟรี ค่าธรรมเนียมนำเข้าเครื่องดื่มแอลกอฮอล์</li>
                <li>บริการที่จอดรถสำหรับแขก VIP</li>
                <li>เครื่องฉายโปรเจคเตอร์</li>
                <li>บริการเครื่องเสียงแบบมาตรฐาน</li>
              </ul>

              <p className="limit-title">
                ข้อจำกัดในแพ็กเกจนี้!
              </p>

              <ul>
                <li>จำนวนแขกขั้นต่ำ 250 ไม่เกิน 450 คน</li>
              </ul>

              <button
                className="wed-btn"
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
          <div className="modal-box">
            <h2>ลงทะเบียน</h2>

            {/* Date */}
            <div className="form-group">
              <label>วันที่กำหนดจัดงาน</label>
              <div className="option-row">
                <button
                  className={`option-btn ${
                    selectedDateType === "custom" ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedDateType("custom");
                    setShowDateInput(true);
                  }}
                >
                  📅{" "}
                  {startDate && endDate
                    ? `${startDate} - ${endDate}`
                    : "ระบุวันที่"}
                </button>

                <button
                  className={`option-btn ${
                    selectedDateType === "3m" ? "active" : ""
                  }`}
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
                  className={`option-btn ${
                    selectedDateType === "6m" ? "active" : ""
                  }`}
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
                  className={`option-btn ${
                    selectedDateType === "1y" ? "active" : ""
                  }`}
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

            {/* Guest */}
            <div className="form-group">
              <label>จำนวนแขก (250 - 450 คน)</label>
              <input
                type="number"
                placeholder="ระบุจำนวนแขก"
                value={guestCount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setGuestCount("");
                  } else {
                    setGuestCount(Number(value));
                  }
                }}
                className="location-input"
              />

              {guestCount !== "" && !isGuestValid && (
                <p style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
                  จำนวนแขกต้องอยู่ระหว่าง 250 - 450 คน
                </p>
              )}
            </div>

            {/* Location */}
            <div className="form-group">
              <label>สถานที่จัดงาน</label>
              <input
                type="text"
                placeholder="ระบุสถานที่จัดงาน"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="location-input"
              />
            </div>

            {/* Contact */}
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

            {/* 🔥 เรียกใช้ handleSubmit ตรงนี้ */}
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

      {/* SUCCESS */}
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