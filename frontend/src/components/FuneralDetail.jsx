import { useNavigate } from "react-router-dom";
import "./FuneralDetail.css";
export default function FuneralDetail() {
  const navigate = useNavigate();

  return (
    <div className="funeral-container">
      {/* Sidebar */}{" "}
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

      {/* Main Content */}
      <main className="funeral-content">
        <div className="funeral-card">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ←
          </button>

          <h2>Funeral Ceremony</h2>

          <div className="funeral-body">
            <img src="/ordination1.jpg" alt="Funeral" />
            <div className="funeral-text">
              {" "}
              <p>
                บริการจัดงานศพครบวงจร
                <br />
                ไม่ว่าจะเป็นพิธีทางศาสนา การสวดอภิธรรม หรือพิธีฌาปนกิจ
                <br />
                ทางบริษัทของเราพร้อมดูแลทุกขั้นตอน
                ด้วยความเรียบร้อยและเหมาะสม{" "}
              </p>
              <p>
                พร้อมบริการอุปกรณ์ครบครัน เช่น ระบบเสียง, ดอกไม้ประดับ, เวที,
                ฉากถ่ายภาพ (Backdrop) และทีมงานดูแลตลอดงาน
              </p>
            </div>
          </div>

          <button
            className="funeral-btn"
            onClick={() => navigate("/event/funeral/package")}
          >
            ดูรายละเอียด
          </button>
        </div>

        {/* Footer */}
        <footer className="funeral-footer">
          <div>📞 089-999-9999</div>
          <div>✉ cpe_group8@ku.th</div>
          <div>จ.-ศ. 09:00-22:00 | ส.-อา. 10:00-20:00</div>
        </footer>
      </main>
    </div>
  );
}