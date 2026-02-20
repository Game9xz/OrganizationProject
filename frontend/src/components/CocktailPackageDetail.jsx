import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CocktailPackageDetail.css";

export default function CocktailPackageDetail() {
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
    <div className="cocktailpkg-container">
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

              <p className="price">
                แพ็กเกจจัดเลี้ยงค็อกเทล ระดับพรีเมียม ราคาเริ่มต้นเพียง 20,000 บาท
              </p>

              <p>
                โดยทีมงานมืออาชีพ พร้อมอาหารสไตล์ค็อกเทล เหมาะสำหรับงานแต่งงาน
                งานเลี้ยงบริษัท งานประชุม และงานสังสรรค์ต่างๆ
              </p>

              <p className="section-title">สิ่งที่รวมในแพ็กเกจ</p>

              <ul>
                <li>อาหารว่าง Thai</li>
                <li>อาหารว่าง Inter</li>
                <li>ของหวาน</li>
                <li>น้ำดื่ม น้ำอัดลม บริการตลอดงาน</li>
                <li>ตกแต่งสถานที่</li>
                <li>บริการเครื่องเสียงมาตรฐาน</li>
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