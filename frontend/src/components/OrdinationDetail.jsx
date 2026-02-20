import { useNavigate } from "react-router-dom";
import "./OrdinationDetail.css";

export default function OrdinationDetail() {
  const navigate = useNavigate();

  return (
    <div className="ordination-container">
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
