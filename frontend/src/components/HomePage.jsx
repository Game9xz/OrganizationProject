import { Link } from "react-router-dom";
import "./HomePage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    // เช็คก่อนใน localStorage
    let storedUser = localStorage.getItem("user");

    // ถ้าไม่มี ให้ไปดูใน sessionStorage
    if (!storedUser) {
      storedUser = sessionStorage.getItem("user");
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="home-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="cat-logo">
            <div className="ear left"></div>
            <div className="ear right"></div>
            <div className="face">
              <div className="eye left-eye"></div>
              <div className="eye right-eye"></div>
            </div>
          </div>

          <h3>{user?.username}</h3>
          <span>{user?.email}</span>
        </div>

        <nav className="nav-menu">
          <div
            className={isActive("/homepage") ? "nav-item active" : "nav-item"}
            onClick={() => navigate("/homepage")}
          >
            หน้าแรก
          </div>

          <div
            className={isActive("/workrecord") ? "nav-item active" : "nav-item"}
            onClick={() => navigate("/workrecord")}
          >
            บันทึกงาน
          </div>

          <div
            className={
              isActive("/workrecord/status") ? "nav-item active" : "nav-item"
            }
            onClick={() => navigate("/workrecord/status")}
          >
            สถานะงาน
          </div>

          <div className="nav-item">ออกแบบ</div>
          <div className={isActive("/inventory") ? "nav-item active" : "nav-item"} onClick={() => navigate("/inventory")}>คลัง</div>
          <div className="nav-item">สถานะคลัง</div>
          <div className="nav-item">งบประมาณ</div>
        </nav>

        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("user");
            sessionStorage.removeItem("user");
            navigate("/login");
          }}
        >
          Log out
        </button>
      </aside>

      {/* Main content */}
      <main className="content">
        <h2 className="page-title">Home Page</h2>

        <div className="card-grid">
          <EventCard
            img="/wedding1.jpg"
            title="Wedding"
            price="13,000 THB"
            link="/event/wedding"
          />
          <EventCard
            img="/funeral.jpg"
            title="Funeral"
            price="13,500 THB"
            link="/event/funeral"
          />
          <EventCard
            img="/party.jpg"
            title="Cocktail Party"
            price="20,000 THB"
            link="/event/cocktail"
          />
          <EventCard
            img="/ordination.jpg"
            title="Ordination"
            price="50,000 THB"
            link="/event/ordination"
          />
        </div>

        <footer className="footer">
          <div>📞 089-999-9999</div>
          <div>✉ cpe_group8@ku.th</div>
          <div>จ.-ศ. 09:00-22:00 | ส.-อา. 10:00-20:00</div>
        </footer>
      </main>
    </div>
  );
}

function EventCard({ img, title, price, link }) {
  return (
    <div className="event-card">
      <img src={img} alt={title} />
      <div className="event-info">
        <h4>{title}</h4>
        <span className="price">เริ่มต้น {price}</span>

        {/* ปุ่มกดไปหน้ารายละเอียด */}
        <Link to={link}>
          <button>ดูรายละเอียด</button>
        </Link>
      </div>
    </div>
  );
}
