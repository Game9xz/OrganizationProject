import { useNavigate } from "react-router-dom";
import "./OrdinationPackageDetail.css";

export default function OrdinationPackageDetail() {
  const navigate = useNavigate();

  return (
    <div className="ordpkg-container">
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
      <main className="ordpkg-content">
        <div className="ordpkg-card">
          {/* Back Button */}
          <button
            className="back-btn"
            onClick={() => navigate("/event/ordination")}
          >
            ←
          </button>

          <div className="ordpkg-body">
            {/* Image */}
            <img
              src="/ordination2.jpg"
              alt="Ordination Package"
              className="ordpkg-image"
            />

            {/* Text */}
            <div className="ordpkg-text">
              <h2>Ordination Ceremony</h2>

              <p className="price">
                แพ็กเกจงานบวชครบวงจร ราคาเริ่มต้น 50,000 บาท
              </p>

              <p>
                รวมครบทุกพิธีการตั้งแต่เช้าจนจบงาน
                พร้อมทีมงานมืออาชีพดูแลตลอดงาน
              </p>

              <p className="section-title">สิ่งที่รวมในแพ็กเกจ</p>

              <ul>
                <li>พิธีโกนผมนาค และพิธีอุปสมบท</li>
                <li>ชุดเครื่องบวชครบชุด</li>
                <li>ดอกไม้ตกแต่งสถานที่</li>
                <li>อาหารเลี้ยงแขก</li>
                <li>โต๊ะจีน / บุฟเฟต์</li>
                <li>ระบบเครื่องเสียง</li>
                <li>ทีมงานดูแลตลอดงาน</li>
              </ul>

              <button className="ordpkg-btn">สนใจแพ็กเกจ</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
