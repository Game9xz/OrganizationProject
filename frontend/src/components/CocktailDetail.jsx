import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./CocktailDetail.css";

export default function CocktailDetail() {
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
    <div className="cocktail-container">
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
      <main className="cocktail-content">
        <div className="cocktail-card">
          <button className="back-btn" onClick={() => navigate("/homepage")}>
            ←
          </button>

          <h2>Cocktail Party</h2>

          <div className="cocktail-body">
            <img src="/party1.jpg" alt="Cocktail" />

            <div className="cocktail-text">
              <p>
                บริการจัดงานเลี้ยงค็อกเทลและปาร์ตี้ ด้วยทีมงานมืออาชีพ
                พร้อมแพ็กเกจที่หลากหลาย ไม่ว่าจะเป็นงานเลี้ยงฉลองความสำเร็จ
                งานเปิดตัวสินค้า หรือปาร์ตี้ส่วนตัว ตามงบประมาณของท่าน
              </p>

              <p>
                เพียบพร้อมด้วยอุปกรณ์และสิ่งอำนวยความสะดวกครบครัน ไม่ว่าจะเป็น
                ระบบแสงสีเสียงระดับพรีเมียม, การจัดตกแต่งสถานที่ตามธีม,
                มุมถ่ายรูปสุดเก๋, อาหารสไตล์ค็อกเทลและเครื่องดื่มหลากหลายรูปแบบ,
                ไปจนถึงพนักงานบริการระดับมืออาชีพ
              </p>
            </div>
          </div>

          <button
            className="cocktail-btn"
            onClick={() => navigate("/event/cocktail/package")}
          >
            ดูรายละเอียด
          </button>
        </div>

        <footer className="cocktail-footer">
          <div>📞 089-999-9999</div>
          <div>✉ cpe_group8@ku.th</div>
          <div>จ.-ศ. 09:00-22:00 | ส.-อา. 10:00-20:00</div>
        </footer>
      </main>
    </div>
  );
}