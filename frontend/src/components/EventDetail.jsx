import { useNavigate, Link } from "react-router-dom";
import "./EventDetail.css";

export default function EventDetail() {
  const navigate = useNavigate();

  return (
    <div className="detail-container">
      {/* Sidebar */}
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

      {/* Content */}
      <main className="detail-content">
        <button className="back-btn" onClick={() => navigate("/homepage")}>
          ←
        </button>

        <h1 className="title">WEDDING</h1>

        <div className="detail-main">
          <img src="/wedding2.jpg" alt="Wedding" className="main-image" />

          <div className="detail-text">
            <p>
              บริการจัดงานแต่งงาน ทุกรูปแบบ ครบวงจร ด้วยทีมงานมืออาชีพ ด้วย
              Package ที่หลากลาย ไม่ว่าจะเป็นพิธีหมั้นช่วงเช้า
              หรือพิธีมงคลสมรสช่วงเย็น ตามงบประมาณของท่าน
            </p>

            <p>
              เพียบพร้อมด้วยอุปกรณ์และสิ่งอำนวยความสะดวกครบ ไม่ว่าจะเป็น
              ระบบภาพและเสียง, ระบบไฟเวที, ดอกไม้ตกแต่ง, แบคดรอปถ่ายรูป,
              เค้กแต่งงาน, หอคอยรินแชมเปญ, ไปจนถึงอุปกรณ์ในการจัดพิธีสงฆ์ต่างๆ
              ครบ จบในที่เดียว
            </p>
          </div>
        </div>

        {/* Package section */}
        <div className="package-grid">
          <div className="package-card">
            <img src="/prewedding.jpg" alt="Pre Wedding" />
            <h4>Pre Wedding Package
              แพ็กเกจพรีเวดดิ้ง สถานที่ พร้อมช่างภาพ
            </h4>
            <span className="price">ราคา 12,999 THB</span>
            <Link to="/event/wedding/prewedding" className="detail-btn">
              ดูรายละเอียด
            </Link>
          </div>

          <div className="package-card">
            <img src="/engagement.jpg" alt="Engagement" />
            <h4>Engagement Ceremony Package
              แพ็กเกจงานหมั้นครบวงจร รวมทุกพิธีสำคัญ
            </h4>
            <span className="price">ราคา 49,999 THB</span>
            <button
              className="detail-btn"
              onClick={() => navigate("/event/wedding/engagement")}
            >
              ดูรายละเอียด
            </button>
          </div>

          <div className="package-card">
            <img src="/wedding-package.jpg" alt="Wedding Package" />
            <h4>Wedding Package
              แพ็กเกจงานแต่งงานครบทุกความต้องการ
            </h4>
            <span className="price">ราคา 95,500 THB</span>
            <button
              className="detail-btn"
              onClick={() => navigate("/event/wedding/weddingpackage")}
            >
              ดูรายละเอียด
            </button>{" "}
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div>📞 089-999-9999</div>
          <div>✉ cpe_group8@ku.th</div>
          <div>จ.-ศ. 09:00-22:00 | ส.-อา. 10:00-20:00</div>
        </footer>
      </main>
    </div>
  );
}
