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

          {/* แก้เฉพาะส่วนนี้ */}
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

          <div
            className={isActive("/design3d") ? "nav-item active" : "nav-item"}
            onClick={() => navigate("/design3d")}
          >
            ออกแบบ
          </div>
          <div
            className={isActive("/inventory") ? "nav-item active" : "nav-item"}
            onClick={() => navigate("/inventory")}
          >
            คลัง
          </div>
          <div
            className={isActive("/inventory/status") ? "nav-item active" : "nav-item"}
            onClick={() => navigate("/inventory/status")}
          >
            สถานะคลัง
          </div>
          <div
            className={isActive("/budget") ? "nav-item active" : "nav-item"}
            onClick={() => navigate("/budget")}
          >
            งบประมาณ
          </div>
        </nav>

        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("user");
            sessionStorage.removeItem("user");
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
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
            price="59,999 THB"
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
            price="79,999 THB"
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
        <span className="price">ราคา {price}</span>

        {/* ปุ่มกดไปหน้ารายละเอียด */}
        <Link to={link}>
          <button>ดูรายละเอียด</button>
        </Link>
      </div>
    </div>
  );
}