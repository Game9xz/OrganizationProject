import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./EngagementDetail.css";

export default function EngagementDetail() {
  const navigate = useNavigate();

  // ================= MODAL =================
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ================= DATE =================
  const [selectedDateType, setSelectedDateType] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ================= FORM =================
  const [selectedGuest, setSelectedGuest] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lineId, setLineId] = useState("");

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
    <div className="eng-container">
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

      {/* ================= MAIN ================= */}
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

              <p className="price">
                แพ็กเกจงานหมั้นเริ่มเพียง 40,000 บาท
              </p>

              <p>
                พร้อมทีมดูแลพิธีการแบบครบวงจร ทั้งสถานที่ อาหาร และการตกแต่ง
              </p>

              <ul>
                <li>แพ็กเกจเริ่มต้น 40,000 บาท (30 ท่าน)</li>
                <li>แพ็กเกจมาตรฐาน 50,000 บาท (50 ท่าน)</li>
                <li>แพ็กเกจพิธีครบชุด 60,000 บาท (50 ท่าน)</li>
                <li>บริการตกแต่งสถานที่ อาหาร และอุปกรณ์ครบ</li>
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
                        if (startDate) {
                          setShowDateInput(false);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* GUEST */}
            <div className="form-group">
              <label>จำนวนแขก</label>

              <div className="option-row">
                {["ต่ำกว่า 50 คน", "50-100 คน", "100 คนขึ้นไป"].map(
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

            {/* BUDGET */}
            <div className="form-group">
              <label>งบประมาณ</label>
              <select
                className="budget-select"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="">เลือกงบประมาณ</option>
                <option>ต่ำกว่า 50,000 บาท</option>
                <option>50,000 - 100,000 บาท</option>
                <option>100,000 บาทขึ้นไป</option>
              </select>
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
