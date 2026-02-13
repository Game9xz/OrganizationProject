import { useNavigate } from "react-router-dom";
import "./FuneralPackageDetail.css";

export default function FuneralPackageDetail() {
  const navigate = useNavigate();

  return (
    <div className="funeralpkg-container">
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
      <main className="funeralpkg-content">
        <div className="funeralpkg-card">
          {/* Back */}
          <button className="back-btn" onClick={() => navigate(-1)}>
            ←
          </button>

          <div className="funeralpkg-body">
            {/* Image */}
            <img
              src="/funeral11.jpg"
              alt="Funeral Package"
              className="funeralpkg-image"
            />

            {/* Text */}
            <div className="funeralpkg-text">
              <h2>Funeral Ceremony</h2>

              <p className="price">
                แพ็กเกจจัดงานศพครบวงจร ราคาเริ่มต้น 13,500 บาท
              </p>

              <p>
                งานศพหลากหลายรูปแบบ ให้ท่านเลือกได้ตามงบประมาณ
                พร้อมทีมงานดูแลครบทุกขั้นตอน
              </p>

              <p className="section-title">สิ่งที่รวมในแพ็กเกจ</p>

              <ul>
                <li>หีบศพ 3 ชั้น</li>
                <li>ดอกไม้หน้าหีบ</li>
                <li>ระบบเครื่องเสียง</li>
                <li>โต๊ะรับแขก</li>
                <li>ทีมงานดูแลตลอดงาน</li>
                <li>บริการถ่ายภาพพิธี</li>
              </ul>

              <button className="funeralpkg-btn">สนใจแพ็กเกจ</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
