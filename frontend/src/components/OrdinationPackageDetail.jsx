import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./OrdinationPackageDetail.css";

export default function OrdinationPackageDetail() {
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

  // Budget
  const [budget, setBudget] = useState("");

  // Contact
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
    <div className="ordpkg-container">
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
                แพ็กเกจงานบวชครบวงจร ราคาเริ่มต้น 50,000 บาท
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

            {/* จำนวนแขก */}
            <div className="form-group">
              <label>จำนวนแขก</label>

              <div className="option-row">
                {[
                  "ต่ำกว่า 100 คน",
                  "101-300 คน",
                  "301-500 คน",
                  "500 คนขึ้นไป",
                ].map((item) => (
                  <button
                    key={item}
                    className={`option-btn ${
                      selectedGuest === item ? "active" : ""
                    }`}
                    onClick={() => setSelectedGuest(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* งบประมาณ */}
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
