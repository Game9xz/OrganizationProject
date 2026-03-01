import { useNavigate } from "react-router-dom";
import "./WeddingDetail.css";

export default function WeddingDetail() {
  const navigate = useNavigate();

  return (
    <div className="wed-container">
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
      <main className="wed-content">
        <div className="wed-card">
          {/* ปุ่มย้อนกลับ */}
          <button
            className="back-btn"
            onClick={() => navigate("/event/wedding")}
          >
            ←
          </button>

          <div className="wed-body">
            {/* รูป */}
            <img src="/wedding3.jpg" alt="Wedding" className="wed-image" />

            {/* ข้อมูล */}
            <div className="wed-text">
              <h2>Wedding Package</h2>

              <p className="price">
                แพ็กเกจจัดงานแต่งงาน ราคาเริ่มต้น 95,000 บาท
              </p>

              <p>
                พร้อมทีมดูแลพิธีการแบบครบวงจร ห้องจัดงานขนาดใหญ่
                รวมอาหารและเครื่องดื่ม
              </p>

              <ul>
                <li>อาหารสำหรับแขก 150 ท่าน</li>
                <li>การตกแต่งเวที VIP และโต๊ะอาหาร</li>
                <li>ช่างภาพมืออาชีพ</li>
                <li>ระบบแสง สี เสียง ครบชุด</li>
                <li>บริการเครื่องดื่มแบบมาตรฐาน</li>
                <li>ทีมงานดูแลตลอดงาน</li>
              </ul>

              <button className="wed-btn">สนใจแพ็กเกจ</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
