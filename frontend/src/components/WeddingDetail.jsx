import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./WeddingDetail.css";

export default function WeddingDetail() {
  const navigate = useNavigate();

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Date
  const [selectedDateType, setSelectedDateType] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Guest
  const [selectedGuest, setSelectedGuest] = useState("");

  // Form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lineId, setLineId] = useState("");
  const [budget, setBudget] = useState("");

  const isFormComplete =
    selectedDateType &&
    selectedGuest &&
    budget &&
    name &&
    phone &&
    email &&
    lineId &&
    (selectedDateType !== "custom" || (startDate && endDate));

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

              <p className="price">
                แพ็กเกจจัดงานแต่งงาน ราคาเริ่มต้น 95,000 บาท
              </p>

              <p>
                พร้อมทีมดูแลพิธีการแบบครบวงจร ห้องจัดงานขนาดใหญ่
                รวมอาหารและเครื่องดื่ม
              </p>

              <ul>
                <li>อาหารสำหรับแขก 150 ท่าน</li>
                <li>การตกแต่งเวที VIP และโต๊ะในงาน</li>
                <li>กล่องรับซอง (สำหรับยืม)</li>
                <li>ชั้นวางของชำร่วย</li>
                <li>ช่อดอกไม้บูเก้</li>
                <li>มาลัยคล้องคอบ่าวสาว</li>
                <li>น้ำดื่ม, น้ำอัดลม บริการฟรีตลอดทั้งงาน</li>
                <li>ฟรี ค่าธรรมเนียมนำเข้าเครื่องดื่มแอลกอฮอล์ (ยกเว้นเบียร์)</li>
                <li>บริการที่จอดรถสำหรับแขก VIP</li>
                <li>เครื่องฉายโปรเจคเตอร์ พร้อมฉาก</li>
                <li>บริการเครื่องเสียงแบบมาตรฐาน</li>
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
                        if (startDate) setShowDateInput(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Guest */}
            <div className="form-group">
              <label>จำนวนแขก</label>
              <div className="option-row">
                {["ต่ำกว่า 100 คน",
                  "101-300 คน",
                  "301-500 คน",
                  "500 คนขึ้นไป",]
                .map(
                  (item) => (
                    <button
                      key={item}
                      className={`option-btn ${
                        selectedGuest === item ? "active" : ""
                      }`}
                      onClick={() => setSelectedGuest(item)}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Budget */}
            <div className="form-group">
              <label>งบประมาณ</label>
              <select
                className="budget-select"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="">เลือกงบประมาณ</option>
                <option>ต่ำกว่า 40,000 บาท</option>
                <option>40,000 - 150,000 บาท</option>
                <option>150,000 - 300,000 บาท</option>
                <option>300,000 บาทขึ้นไป</option>
              </select>
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

            <button
              className="submit-btn"
              disabled={!isFormComplete}
              onClick={() => setShowSuccess(true)}
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
