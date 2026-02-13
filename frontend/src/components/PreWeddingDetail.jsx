import { useNavigate } from "react-router-dom";
import "./PreWeddingDetail.css";

export default function PreWeddingDetail() {
  const navigate = useNavigate();

  return (
    <div className="pre-container">
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
      <main className="pre-content">
        <div className="pre-card">
          {/* ปุ่มย้อนกลับ */}
          <button
            className="back-btn"
            onClick={() => navigate("/event/wedding")}
          >
            ←
          </button>

          <div className="pre-body">
            {/* รูป */}
            <img
              src="/prewedding1.jpg"
              alt="Pre Wedding"
              className="pre-image"
            />

            {/* ข้อมูล */}
            <div className="pre-text">
              <h2>Pre - Wedding Package</h2>

              <p className="price">แพ็กเกจพรีเวดดิ้ง 13,000 บาท</p>

              <p>
                พร้อมทีมดูแล และ ช่างภาพมืออาชีพ ทั้งสถานที่ อาหาร และการตกแต่ง
              </p>

              <p className="section-title">สิ่งที่รวมในแพ็กเกจ</p>

              <ul>
                <li>ห้องถ่ายภาพส่วนตัว สำหรับ 2 ท่าน</li>
                <li>สามารถถ่ายรูปได้ตั้งแต่ 08.00-18.00 น.</li>
                <li>ดินเนอร์สุดโรแมนติกสำหรับ 2 ท่าน</li>
                <li>
                  ส่วนลดพิเศษ 15% สำหรับอาหารและเครื่องดื่ม(ยกเว้นแอลกอฮอล์)
                </li>
                <li>
                  ห้องพักวิลล่า 1 ห้องนอน ในราคาอัปเกรดพิเศษเพียง 3,000 บาท
                </li>
              </ul>

              <button className="pre-btn">สนใจแพ็กเกจ</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
