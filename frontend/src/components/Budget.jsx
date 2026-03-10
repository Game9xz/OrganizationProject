import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Budget.css";
import "./Workrecord.css";

export default function Budget() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("se_remember");
    navigate("/login");
  };

  const summaryCards = [
    { title: "งานแต่งงาน", budget: 400000, profit: 0, loss: 0, color: "pink", icon: "💎" },
    { title: "งานบุญ", budget: 200000, profit: 0, loss: 0, color: "orange", icon: "🌸" },
    { title: "งานเลี้ยง", budget: 200000, profit: 0, loss: 0, color: "blue", icon: "🍸" },
    { title: "งานศพ", budget: 200000, profit: 0, loss: 0, color: "purple", icon: "🐦" },
  ];

  const tableRows = [
    { manager: "กาญจนศิริ", date: "21 ม.ค.", amount: 0, status: "Complete" },
    { manager: "พัฒน์ธนันภู", date: "30 ม.ค.", amount: 0, status: "Complete" },
    { manager: "พีรณัฐ", date: "14 ก.พ.", amount: 0, status: "Complete" },
    { manager: "ศุภกร", date: "28 ก.พ.", amount: 0, status: "Complete" },
  ];

  return (
    <div className="bd-layout">
      <aside className="wr-sidebar">
        <div className="brand-logo">
          <svg className="cat-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M34 38 L38 24 L50 35 Z" fill="#000" />
            <path d="M66 38 L62 24 L50 35 Z" fill="#000" />
            <path d="M20 60 C20 40, 40 35, 50 35 C60 35, 80 40, 80 60 C80 75, 70 85, 50 85 C30 85, 20 75, 20 60 Z" fill="#000" />
            <circle cx="42" cy="58" r="6" fill="#fff" />
            <circle cx="58" cy="58" r="6" fill="#fff" />
            <circle cx="42" cy="58" r="2.5" fill="#000" />
            <circle cx="58" cy="58" r="2.5" fill="#000" />
          </svg>
        </div>
        <div className="brand-text">SE EVENT</div>
        <div className="brand-sub">Group8.SE@ku.th</div>

        <nav className="nav-menu">
          <Link to="/homepage" className="nav-item">หน้าแรก</Link>
          <Link to="/workrecord" className="nav-item">บันทึกงาน</Link>
          <Link to="/workrecord/status" className="nav-item">สถานะงาน</Link>
          <Link to="#" className="nav-item">ออกแบบ</Link>
          <Link to="/inventory" className="nav-item">คลัง</Link>
          <Link to="/inventory/status" className="nav-item">สถานะคลัง</Link>
          <Link to="/budget" className="nav-item active">งบประมาณ</Link>
        </nav>

        <button className="logout-btn" onClick={logout}>Log out</button>
      </aside>

      <main className="bd-content">
        <div className="bd-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ←
          </button>
          <h1 className="bd-title">Budget</h1>
        </div>

        <section className="bd-summary">
          <div className="bd-summary-left">
            <div className="bd-summary-title">งบประมาณ</div>
            <div className="bd-summary-sub">ทั้งปี 2569</div>
          </div>
          <div className="bd-summary-cards">
            {summaryCards.map((c, idx) => {
              const slug =
                c.title === "งานแต่งงาน"
                  ? "wedding"
                  : c.title === "งานบุญ"
                  ? "merit"
                  : c.title === "งานเลี้ยง"
                  ? "party"
                  : "funeral";
              return (
                <Link key={idx} to={`/budget/${slug}`} className="bd-card-link">
                  <div className={`bd-card ${c.color}`}>
                    <div className="bd-card-icon">{c.icon}</div>
                    <div className="bd-card-title">{c.title}</div>
                    <div className="bd-card-text">งบประมาณ {c.budget.toLocaleString()} บาท</div>
                    <div className="bd-card-text">กำไร {c.profit} บาท</div>
                    <div className="bd-card-text">ขาดทุน {c.loss} บาท</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="bd-bottom">
          <div className="bd-chart">
            <div className="bd-panel-title">Profit 2569</div>
            <div className="bd-chart-body">
              <div className="bd-yaxis">
                <span>50K</span>
                <span>30K</span>
                <span>20K</span>
                <span>10K</span>
                <span>0</span>
              </div>
              <div>
                <div className="bd-bars">
                  <div className="bd-bar pink" style={{ height: "0px" }}></div>
                  <div className="bd-bar blue" style={{ height: "0px" }}></div>
                  <div className="bd-bar orange" style={{ height: "0px" }}></div>
                  <div className="bd-bar purple" style={{ height: "0px" }}></div>
                </div>
                <div className="bd-bar-labels">
                  <span>งานแต่ง</span>
                  <span>งานเลี้ยง</span>
                  <span>งานบุญ</span>
                  <span>งานศพ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bd-table">
            <div className="bd-panel-title">Profit 2569</div>
            <table>
              <thead>
                <tr>
                  <th>Manager</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.manager}</td>
                    <td>{r.date}</td>
                    <td>{r.amount === 0 ? "0" : r.amount}</td>
                    <td><span className="bd-status-pill">Complete</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
