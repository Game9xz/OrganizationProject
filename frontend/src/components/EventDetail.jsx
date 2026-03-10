import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./EventDetail.css";

export default function EventDetail() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let storedUser = localStorage.getItem("user");
    if (!storedUser) {
      storedUser = sessionStorage.getItem("user");
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <div className="detail-container">
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

          <h3>{user?.username}</h3>
          <span>{user?.email}</span>
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