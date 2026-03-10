import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./PreWeddingDetail.css";

// 1. ดึง URL หลักจาก Railway (ถ้ามี) หรือใช้ Localhost เป็นตัวสำรอง
const BASE_API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export default function PreWeddingDetail() {
  const navigate = useNavigate();

  // 🔥 กำหนดราคาแพ็กเกจพรีเวดดิ้งที่นี่
  const packagePrice = 12999;

  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [selectedDateType, setSelectedDateType] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // จำนวนแขกแบบพิมพ์
  const [guestCount, setGuestCount] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lineId, setLineId] = useState("");
  const [location, setLocation] = useState("");

  /* ================= VALIDATION ================= */
  const isFormComplete =
    selectedDateType &&
    guestCount &&
    name &&
    phone &&
    email &&
    lineId &&
    location &&
    guestCount >= 10 &&
    guestCount <= 15 &&
    (selectedDateType !== "custom" || (startDate && endDate));

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
        package_id: 5, // 🔥 สมมติแพ็กเกจนี้ id = 5 (Pre-Wedding)
        guest_count: Number(guestCount),
        duration: "08.00-18.00 น.", // ตามรายละเอียดแพ็กเกจ
        budget: packagePrice, // ส่งราคา 12999 เข้าไป
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

      // 3. ยิง API บันทึกลงฐานข้อมูล (ใช้ BASE_API เชื่อมต่ออัตโนมัติ)
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
    <div className="pre-container">
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
      <main className="pre-content">
        <div className="pre-card">
          <button
            className="back-btn"
            onClick={() => navigate("/event/wedding")}
          >
            ←
          </button>

          <div className="pre-body">
            <img
              src="/prewedding1.jpg"
              alt="Pre Wedding"
              className="pre-image"
            />

            <div className="pre-text">
              <h2>Pre - Wedding Package</h2>

              {/* 🔥 ดึงราคาจากตัวแปรมาแสดง */}
              <p className="price">
                แพ็กเกจพรีเวดดิ้ง ราคา {packagePrice.toLocaleString()} บาท
              </p>

              <p>
                พร้อมทีมดูแล และ ช่างภาพมืออาชีพ ทั้งสถานที่ อาหาร และการตกแต่ง
              </p>

              <p className="section-title">สิ่งที่รวมในแพ็กเกจ</p>
              <ul>
                <li>ห้องถ่ายภาพส่วนตัว สำหรับ 2 ท่าน</li>
                <li>สามารถถ่ายรูปได้ตั้งแต่ 08.00-18.00 น.</li>
                <li>ดินเนอร์สุดโรแมนติกสำหรับ 2 ท่าน</li>
                <li>ส่วนลดพิเศษ 15% สำหรับอาหารและเครื่องดื่ม</li>
                <li>ห้องพักวิลล่า 1 ห้องนอน</li>
              </ul>

              <p className="limit-title">
                ข้อจำกัดในแพ็กเกจนี้!
              </p>

              <ul>
                <li>จำนวนแขกขั้นต่ำ 10 ไม่เกิน 15 คน</li>
              </ul>

              <button
                className="pre-btn"
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

            {/* วันที่ */}
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

            {/* จำนวนแขกแบบพิมพ์ */}
            <div className="form-group">
              <label>จำนวนแขก (10 - 15 คน)</label>
              <input
                type="number"
                placeholder="ระบุจำนวนแขก"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="location-input"
              />
              {guestCount &&
                (guestCount < 10 || guestCount > 15) && (
                  <p style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
                    จำนวนแขกต้องอยู่ระหว่าง 10 - 15 คน
                  </p>
                )}
            </div>

            {/* สถานที่ */}
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
                placeholder="เบอร์โทรติดต่อ"
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

            {/* 🔥 เรียกใช้ handleSubmit แทนการโชว์ Modal ทันที */}
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