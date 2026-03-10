import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./InventoryStatus.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let storedUser = localStorage.getItem("user");

    if (!storedUser) {
      storedUser = sessionStorage.getItem("user");
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="ws-sidebar">
      
      {/* Profile เหมือน HomePage */}
      <div className="brand">

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

        <NavLink
          to="/homepage"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          หน้าแรก
        </NavLink>

        <NavLink
          to="/workrecord"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          บันทึกงาน
        </NavLink>

        <NavLink
          to="/workrecord/status"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          สถานะงาน
        </NavLink>

        <NavLink
          to="/event/wedding"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          ออกแบบ
        </NavLink>

        <NavLink
          to="/inventory"
          end
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          คลัง
        </NavLink>

        <NavLink
          to="/inventory/status"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          สถานะคลัง
        </NavLink>

        <NavLink
          to="/budget"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          งบประมาณ
        </NavLink>

      </nav>

      <button className="logout-btn" onClick={logout}>
        Log out
      </button>
    </aside>
  );
}