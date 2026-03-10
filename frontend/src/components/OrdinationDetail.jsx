import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./OrdinationDetail.css";

export default function OrdinationDetail() {
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
    <div className="ordination-container">
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

      {/* Main */}
      <main className="ordination-content">
        <div className="ordination-card">
          <button className="back-btn" onClick={() => navigate("/homepage")}>
            ←
          </button>

          <h2>Ordination Ceremony</h2>

          <div className="ordination-body">
            <img src="/funeral1.jpg" alt="Ordination" />

            <div className="ordination-text">
              <p>
                บริการจัดงานอุปสมบท ไม่ว่าจะเป็นพิธีทำขวัญนาค พิธีแห่นาค
                หรือพิธีฉลองพระใหม่ ตามงบประมาณของท่าน
              </p>

              <p>
                เพียบพร้อมด้วยอุปกรณ์และสิ่งอำนวยความสะดวกครบครัน ไม่ว่าจะเป็น
                ระบบภาพและเสียง, ระบบไฟเวที, ดอกไม้ตกแต่งสถานที่, ฉากถ่ายรูป
                (Backdrop), บริการอาหารเลี้ยงแขก, โต๊ะจีน,
                ไปจนถึงอุปกรณ์ในพิธีสงฆ์และเครื่องไทยธรรมต่างๆ
              </p>
            </div>
          </div>

          <button
            className="detail-btn"
            onClick={() => navigate("/event/ordination/package")}
          >
            ดูรายละเอียด
          </button>
        </div>

        <footer className="ordination-footer">
          <div>📞 089-999-9999</div>
          <div>✉ cpe_group8@ku.th</div>
          <div>จ.-ศ. 09:00-22:00 | ส.-อา. 10:00-20:00</div>
        </footer>
      </main>
    </div>
  );
}