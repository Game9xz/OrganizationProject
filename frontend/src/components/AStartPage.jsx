import { Link } from "react-router-dom";
import "./AStartPage.css";

export default function StartPage() {
  return (
    <div className="start-container">
      {/* ฝั่งซ้าย */}
      <div className="start-left">
        <img
          src="/wedding.jpg" // ใส่รูปใน public/
          alt="event"
          className="start-image"
        />
      </div>

      {/* ฝั่งขวา */}
      <div className="start-right">
        <h1 className="start-logo">
          GROUP8 <span>ORGANIZE</span>
        </h1>

        <p className="start-text">
          รับจัดอีเว้นท์
          <br />
          ออแกไนซ์จัดงานอีเว้นท์ทุกประเภท
        </p>

        <Link to="/login">
          <button className="start-btn">เข้าสู่เว็บไซต์</button>
        </Link>
      </div>
    </div>
  );
}
