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
            <div className="ear left"></div>
            <div className="ear right"></div>
            <div className="face">
              <div className="eye left-eye"></div>
              <div className="eye right-eye"></div>
            </div>
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
