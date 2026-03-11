import React, { useState, useEffect, useContext, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { WorkContext } from "../context/WorkContextBase";
import "./Budget.css";
import "./Workrecord.css";

const TYPE_MAP = {
  wedding: { title: "งานแต่ง", color: "pink", budget: 1000000 },
  party: { title: "งานเลี้ยง", color: "blue", budget: 1000000 },
  merit: { title: "งานบุญ", color: "orange", budget: 1000000 },
  funeral: { title: "งานศพ", color: "purple", budget: 1000000 },
};

export default function BudgetDetail() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { budgetItems, weddingEvents, partyEvents } = useContext(WorkContext);
  const meta = TYPE_MAP[type] || TYPE_MAP.wedding;
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

  const currentItems = useMemo(() => budgetItems[type] || [], [budgetItems, type]);

  // ดึงรายการค่าจ้างและค่าสถานที่จากหน้าบันทึกงาน แยกตามงาน
  const workRecordItems = useMemo(() => {
    let events = [];
    if (type === 'wedding') events = weddingEvents;
    else if (type === 'party') events = partyEvents.filter(e => 
      e.category === 'ปาร์ตี้' || 
      e.category === 'งานเลี้ยง' || 
      e.category === 'งานวันเกิด' || 
      e.category === 'งานสร้างสรรค์' ||
      e.title.includes('วันเกิด')
    );
    else if (type === 'merit') events = partyEvents.filter(e => e.category === 'งานบุญ' || e.category === 'สัมมนา');
    else if (type === 'funeral') events = partyEvents.filter(e => e.category === 'งานศพ');
    
    const items = [];
    events.forEach(ev => {
      const staff = Number(String(ev.staff_cost || ev.staffWages || "0").replace(/[^0-9.]/g, "")) || 0;
      const venue = Number(String(ev.venue_cost || ev.venueCost || "0").replace(/[^0-9.]/g, "")) || 0;
      
      if (staff > 0) {
        items.push({
          name: `ค่าจ้างพนักงาน (${ev.title})`,
          amount: staff,
          unit: "บาท",
          isWorkRecord: true
        });
      }
      if (venue > 0) {
        items.push({
          name: `ค่าสถานที่ (${ev.title})`,
          amount: venue,
          unit: "บาท",
          isWorkRecord: true
        });
      }
    });
    return items;
  }, [type, weddingEvents, partyEvents]);

  const totalSpent = useMemo(() => {
    const itemTotal = currentItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const workRecordTotal = workRecordItems.reduce((sum, item) => sum + item.amount, 0);
    return itemTotal + workRecordTotal;
  }, [currentItems, workRecordItems]);

  const workRecordCosts = useMemo(() => {
    return workRecordItems.reduce((sum, item) => sum + item.amount, 0);
  }, [workRecordItems]);

  // ถ้าไม่มีการใช้จ่ายเลย ให้กำไรและขาดทุนเป็น 0
  const netResult = totalSpent === 0 ? 0 : meta.budget - totalSpent;
  const profit = netResult > 0 ? netResult : 0;
  const loss = netResult < 0 ? Math.abs(netResult) : 0;

  const logout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bd-layout">
      <aside className="ws-sidebar">
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
        <div className="brand-text">{user?.username}</div>
        <div className="brand-sub">{user?.email}</div>

        <nav className="nav-menu">
          <Link to="/homepage" className="nav-item">หน้าแรก</Link>
          <Link to="/workrecord" className="nav-item">บันทึกงาน</Link>
          <Link to="/workrecord/status" className="nav-item">สถานะงาน</Link>
          <Link to="/design3d" className="nav-item">ออกแบบ</Link>
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
          <h1 className="bd-title">Budget Detail</h1>
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
                  {workRecordItems.length > 0 && (
                    workRecordItems.map((it, idx) => (
                      <tr key={`wr-${idx}`}>
                        <td style={{ color: '#6b7280', fontStyle: 'italic' }}>{it.name}</td>
                        <td>{it.amount.toLocaleString()}</td>
                        <td>{it.unit}</td>
                      </tr>
                    ))
                  )}
                  {currentItems.length > 0 ? (
                    currentItems.map((it, idx) => (
                      <tr key={`item-${idx}`}>
                        <td>{it.name}</td>
                        <td>{it.amount.toLocaleString()}</td>
                        <td>{it.unit}</td>
                      </tr>
                    ))
                  ) : (
                    workRecordItems.length === 0 && (
                      <>
                        <tr><td>-</td><td>0</td><td>บาท</td></tr>
                        <tr><td>-</td><td>0</td><td>บาท</td></tr>
                        <tr><td>-</td><td>0</td><td>บาท</td></tr>
                      </>
                    )
                  )}
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
              <div className="sum-value">{totalSpent.toLocaleString()} บาท</div>
            </div>
            <div className="bd-summary-card green">
              <div className="sum-title">กำไร</div>
              <div className="sum-value">{profit.toLocaleString()} บาท</div>
            </div>
            <div className="bd-summary-card red">
              <div className="sum-title">ขาดทุน</div>
              <div className="sum-value">{loss.toLocaleString()} บาท</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
