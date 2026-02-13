import { useNavigate } from "react-router-dom";
import "./CocktailPackageDetail.css";

export default function CocktailPackageDetail() {
  const navigate = useNavigate();

  return (
    <div className="cocktailpkg-container">
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
      <main className="cocktailpkg-content">
        <div className="cocktailpkg-card">
          {/* Back */}
          <button
            className="back-btn"
            onClick={() => navigate("/event/cocktail")}
          >
            ←
          </button>

          <div className="cocktailpkg-body">
            <img
              src="/cocktail2.jpg"
              alt="Cocktail Package"
              className="cocktailpkg-image"
            />

            <div className="cocktailpkg-text">
              <h2>Cocktail Party Package</h2>

              <p className="price">
                แพ็กเกจจัดเลี้ยงค็อกเทล ระดับพรีเมียม ราคาเริ่มต้นเพียง 20,000
                บาท
              </p>

              <p>
                โดยทีมงานมืออาชีพ พร้อมอาหารสไตล์ค็อกเทล เหมาะสำหรับงานแต่งงาน
                งานเลี้ยงบริษัท งานประชุม และงานสังสรรค์ต่างๆ
              </p>

              <p className="section-title">สิ่งที่รวมในแพ็กเกจ</p>

              <ul>
                <li>อาหารว่าง Thai</li>
                <li>อาหารว่าง Inter</li>
                <li>ของหวาน</li>
                <li>น้ำดื่ม น้ำอัดลม บริการตลอดงาน</li>
                <li>ตกแต่งสถานที่</li>
                <li>บริการเครื่องเสียงมาตรฐาน</li>
              </ul>

              <button className="cocktailpkg-btn">สนใจแพ็กเกจ</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
