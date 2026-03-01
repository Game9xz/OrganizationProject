import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./Budget.css";
import "./Workrecord.css";

const TYPE_MAP = {
  wedding: { title: "งานแต่ง", color: "pink", budget: 400000 },
  party: { title: "งานเลี้ยง", color: "blue", budget: 200000 },
  merit: { title: "งานบุญ", color: "orange", budget: 200000 },
  funeral: { title: "งานศพ", color: "purple", budget: 200000 },
};

export default function BudgetDetail() {
  const { type } = useParams();
  const navigate = useNavigate();
  const meta = TYPE_MAP[type] || TYPE_MAP.wedding;

  const logout = () => {
    localStorage.removeItem("se_remember");
    navigate("/login");
  };

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
          <Link to="#" className="nav-item">สถานะคลัง</Link>
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

        <section className="bd-detail">
          <div className="bd-detail-left">
            <div className="bd-panel-title">{meta.title}</div>
            <div className={`bd-table-box ${meta.color}`}>
              <table className="bd-detail-table">
                <thead>
                  <tr>
                    <th>รายการ</th>
                    <th>จำนวนเงิน</th>
                    <th>หน่วย</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>-</td><td>0</td><td>บาท</td></tr>
                  <tr><td>-</td><td>0</td><td>บาท</td></tr>
                  <tr><td>-</td><td>0</td><td>บาท</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bd-detail-right">
            <div className="bd-summary-card violet">
              <div className="sum-title">งบประมาณ</div>
              <div className="sum-value">{meta.budget.toLocaleString()} บาท</div>
            </div>
            <div className="bd-summary-card orange">
              <div className="sum-title">สรุปงบประมาณสุทธิ</div>
              <div className="sum-sub">รายการทั้งหมดรวม</div>
              <div className="sum-value">0 บาท</div>
            </div>
            <div className="bd-summary-card green">
              <div className="sum-title">กำไร</div>
              <div className="sum-value">0 บาท</div>
            </div>
            <div className="bd-summary-card red">
              <div className="sum-title">ขาดทุน</div>
              <div className="sum-value">0 บาท</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
