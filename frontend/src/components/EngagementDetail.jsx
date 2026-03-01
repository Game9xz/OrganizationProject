import { useNavigate } from "react-router-dom";
import "./EngagementDetail.css";

export default function EngagementDetail() {
  const navigate = useNavigate();

  return (
    <div className="eng-container">
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
      <main className="eng-content">
        <div className="eng-card">
          {/* Back */}
          <button
            className="back-btn"
            onClick={() => navigate("/event/wedding")}
          >
            ←
          </button>

          <div className="eng-body">
            {/* Image */}
            <img
              src="/engagement1.jpg"
              alt="Engagement"
              className="eng-image"
            />

            {/* Text */}
            <div className="eng-text">
              <h2>Engagement Ceremony Package</h2>

              <p className="price">แพ็กเกจงานหมั้นเริ่มเพียง 40,000 บาท</p>

              <p>
                พร้อมทีมดูแลพิธีการแบบครบวงจร ทั้งสถานที่ อาหาร และการตกแต่ง
              </p>

              <ul>
                <li>
                  แพ็กเกจเริ่มต้นสุดคุ้มสำหรับคู่รักที่ต้องการความเรียบง่ายและเป็นกันเอง
                  ราคาเริ่มต้นเพียง 40,000 บาท (จำนวนแขก 30 ท่าน)
                </li>
                <li>
                  แพ็กเกจงานหมั้นมาตรฐาน ราคาเริ่มต้นเพียง 50,000 บาท (แขก 50
                  ท่าน)
                </li>
                <li>
                  แพ็กเกจพิธีเลี้ยงพระ พิธีหมั้น พิธีหลั่งน้ำพระพุทธมนต์
                  และพิธีรับไหว้ผู้ใหญ่ ราคาเริ่มต้นเพียง 60,000 บาท (แขก 50
                  ท่าน)
                </li>
                <li>สิ่งที่รวมในแพ็กเกจ</li>
                <li>
                  ห้องจัดพิธีหมั้นหมายที่กว้างขวาง รองรับทุกพิธีหมั้นหมายของคุณ
                </li>
                <li>
                  บริการจัดเตรียมพื้นที่สำหรับพิธีการต่าง ๆ
                  พร้อมพนักงานคอยดูแลตลอดงาน
                </li>
                <li>บริการอาหารและเครื่องดื่ม</li>
                <li>บริการตกแต่งสถานที่</li>
                <li>สิ่งอำนวยความสะดวกและอุปกรณ์ในพิธีการ</li>
                <li>ฟรี ค่านำเข้าอุปกรณ์ตกแต่งสถานที่</li>
                <li>ฟรี ค่าจอดรถ พร้อมสำรองที่จอดรถสำหรับ VIP</li>
              </ul>

              <button className="eng-btn">สนใจแพ็กเกจ</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
