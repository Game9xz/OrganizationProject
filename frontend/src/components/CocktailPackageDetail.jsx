import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CocktailPackageDetail.css";

// 1. ดึง URL หลักจาก Railway (ถ้ามี) หรือใช้ Localhost เป็นตัวสำรอง
const BASE_API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export default function CocktailPackageDetail() {
  const navigate = useNavigate();

  // 🔥 กำหนดราคาแพ็กเกจไว้ที่นี่ (แก้ที่เดียว อัปเดตทั้งหน้าจอและ Database)
  const packagePrice = 29999;

  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Date
  const [selectedDateType, setSelectedDateType] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // จำนวนแขก
  const [guestCount, setGuestCount] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lineId, setLineId] = useState("");
  const [location, setLocation] = useState("");

  /* ================= VALIDATION ================= */

  const isGuestValid =
    guestCount !== "" &&
    !isNaN(Number(guestCount)) &&
    Number(guestCount) >= 100 &&
    Number(guestCount) <= 150;

  const isDateValid =
    selectedDateType === "custom"
      ? startDate && endDate
      : selectedDateType !== "";

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
        user_id: 1, // หมายเหตุ: สมมติค่าเป็น 1 ไว้ก่อน (ปรับเป็น ID ผู้ใช้จริงภายหลัง)
        package_id: 1, // หมายเหตุ: สมมติแพ็กเกจนี้ id = 1
        guest_count: guestCount,
        duration: "ตามแพ็กเกจ",
        budget: packagePrice, // 🔥 ส่งราคา 29999 เข้าไปใน Database
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
    <div className="cocktailpkg-container">
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

      <main className="cocktailpkg-content">
        <div className="cocktailpkg-card">
          <button
            className="back-btn"
            onClick={() => navigate("/event/cocktail")}
          >
            ←
          </button>

          <div className="cocktailpkg-body">
            <img
              src="/cocktail2.jpg"
              alt="Cocktail Package"
              className="cocktailpkg-image"
            />

            <div className="cocktailpkg-text">
              <h2>Cocktail Party Package</h2>

              {/* 🔥 ดึงราคามาแสดงผลแบบมีลูกน้ำ (29,999) อัตโนมัติ */}
              <p className="price">
                แพ็กเกจจัดเลี้ยงค็อกเทล ระดับพรีเมียม ราคา {packagePrice.toLocaleString()} บาท
              </p>

              <p>
                โดยทีมงานมืออาชีพ พร้อมอาหารสไตล์ค็อกเทล
              </p>

              <p className="section-title">สิ่งที่รวมในแพ็กเกจ</p>

              <ul>
                <li>อาหารว่าง Thai</li>
                <li>อาหารว่าง Inter</li>
                <li>ของหวาน</li>
                <li>น้ำดื่มและน้ำอัดลม</li>
                <li>ตกแต่งสถานที่</li>
                <li>ระบบเครื่องเสียงมาตรฐาน</li>
              </ul>

              <p className="limit-title">
                ข้อจำกัดในแพ็กเกจนี้!
              </p>

              <ul>
                <li>จำนวนแขกขั้นต่ำ 100 ไม่เกิน 150 คน</li>
              </ul>

              <button
                className="cocktailpkg-btn"
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

            {/* DATE */}
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
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span>ถึง</span>
                    <input
                      type="date"
                      value={endDate}
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

            {/* 🔥 จำนวนแขกแบบพิมพ์ */}
            {/* จำนวนแขก */}
            <div className="form-group">
              <label>จำนวนแขก (100 - 150 คน)</label>
              <input
                type="number"
                placeholder="ระบุจำนวนแขก"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
              />

              {guestCount !== "" && !isGuestValid && (
                <p style={{ color: "red", fontSize: "13px" }}>
                  จำนวนแขกต้องอยู่ระหว่าง 100 - 150 คน
                </p>
              )}
            </div>

            {/* LOCATION */}
            <div className="form-group">
              <label>สถานที่จัดงาน</label>
              <input
                type="text"
                placeholder="ระบุสถานที่จัดงาน"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* INFO */}
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

            {/* เรียกใช้ handleSubmit แทนที่จะเปิด modal success เฉยๆ */}
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