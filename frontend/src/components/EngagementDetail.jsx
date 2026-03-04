import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./EngagementDetail.css";

export default function EngagementDetail() {
  const navigate = useNavigate();

  // 🔥 กำหนดราคาแพ็กเกจงานหมั้นที่นี่
  const packagePrice = 49999;

  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // DATE
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
    Number(guestCount) >= 50 &&
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
        user_id: 1, // หมายเหตุ: สมมติค่าเป็น 1 ไว้ก่อน
        package_id: 2, // 🔥 สมมติแพ็กเกจนี้ id = 2 (งานหมั้น)
        guest_count: guestCount,
        duration: "ประมาณ 4 ชั่วโมง", // ตามรายละเอียดแพ็กเกจ
        budget: packagePrice, // ส่งราคา 49999 เข้าไป
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
      const response = await fetch("http://localhost:8080/api/bookings", {
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
    <div className="eng-container">
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

      <main className="eng-content">
        <div className="eng-card">
          <button
            className="back-btn"
            onClick={() => navigate("/event/wedding")}
          >
            ←
          </button>

          <div className="eng-body">
            <img
              src="/engagement1.jpg"
              alt="Engagement"
              className="eng-image"
            />

            <div className="eng-text">
              <h2>Engagement Ceremony Package</h2>

              {/* 🔥 ดึงราคาจากตัวแปรมาแสดง */}
              <p className="price">
                แพ็กเกจงานหมั้น ราคา {packagePrice.toLocaleString()} บาท
              </p>

              <p>
                พร้อมทีมดูแลพิธีการแบบครบวงจร ทั้งสถานที่ อาหาร และการตกแต่ง
              </p>

              <p className="section-title">สิ่งที่รวมในแพ็กเกจ</p>

              <ul> 
                <li>ห้องจัดเลี้ยง: การใช้สถานที่ประมาณ 4 ชั่วโมง (ช่วงเช้า 08.00 - 12.00 น.)</li> 
                <li>การจัดอาสนะ: ชุดโซฟาสำหรับประธานและญาติผู้ใหญ่บนเวที</li> 
                <li>เก้าอี้สำหรับแขก: การจัดที่นั่งแบบ Theater style ตามจำนวนแขกในแพ็กเกจ (เช่น 30-50 ท่าน)</li> 
                <li>ป้ายชื่อบ่าวสาว: Backdrop บนเวทีพร้อมโลโก้ชื่อคู่บ่าวสาว</li> 
                <li>การตกแต่งดอกไม้: สแตนด์ดอกไม้บนเวที 1 คู่, ดอกไม้ตกแต่งโต๊ะลงทะเบียน</li> 
                <li>พานแหวนหมั้น: พานดอกไม้สำหรับวางแหวนหมั้น</li> 
                <li>ห้องพัก: ห้องพัก 1 คืนสำหรับบ่าวสาวพร้อมอาหารเช้า</li> 
                <li>ที่จอดรถ: บริการสำรองที่จอดรถสำหรับแขกผู้ใหญ่</li> 
              </ul>

              <p className="limit-title">
                ข้อจำกัดในแพ็กเกจนี้!
              </p>

              <ul>
                <li>จำนวนแขกขั้นต่ำ 50 ไม่เกิน 150 คน</li>
              </ul>

              <button
                className="eng-btn"
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
                    : "กำหนดวันที่"}
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
            <div className="form-group">
              <label>จำนวนแขก (50 - 150 คน)</label>
              <input
                type="number"
                placeholder="ระบุจำนวนแขก"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="location-input"
              />

              {guestCount !== "" && !isGuestValid && (
                <p style={{ color: "red", fontSize: "13px" }}>
                  จำนวนแขกต้องอยู่ระหว่าง 50 - 150 คน
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
                className="location-input"
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

            {/* 🔥 เรียกใช้ handleSubmit แทน */}
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