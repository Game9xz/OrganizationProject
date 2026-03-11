import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WorkContext } from "../context/WorkContextBase";
import "./Budget.css";
import "./Workrecord.css";

export default function Budget() {
  const navigate = useNavigate();
  const { budgetItems, weddingEvents, partyEvents } = useContext(WorkContext);
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

  const getStats = useCallback((type, baseBudget) => {
    const items = budgetItems[type] || [];
    const itemTotal = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);

    // รวมค่าจากหน้าบันทึกงาน
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
    
    let staffTotal = 0;
    let venueTotal = 0;
    
    events.forEach((ev) => {
      const staff = Number(String(ev.staff_cost || ev.staffWages || "0").replace(/[^0-9.]/g, "")) || 0;
      const venue = Number(String(ev.venue_cost || ev.venueCost || "0").replace(/[^0-9.]/g, "")) || 0;
      staffTotal += staff;
      venueTotal += venue;
    });

    const workRecordTotal = staffTotal + venueTotal;
    const totalSpent = itemTotal + workRecordTotal;

    // ถ้าไม่มีการใช้จ่ายเลย (ไม่มีข้อมูล) ให้กำไรเป็น 0
    if (totalSpent === 0) {
      return { profit: "0", loss: "0", staffTotal: 0, venueTotal: 0 };
    }

    const netResult = baseBudget - totalSpent;

    return {
      profit: netResult > 0 ? netResult.toLocaleString() : "0",
      loss: netResult < 0 ? Math.abs(netResult).toLocaleString() : "0",
      staffTotal,
      venueTotal
    };
  }, [budgetItems, weddingEvents, partyEvents]);

  const summaryCards = useMemo(() => [
    {
      title: "งานแต่งงาน",
      budget: 1000000,
      ...getStats("wedding", 1000000),
      color: "pink",
      icon: "💎"
    },
    {
      title: "งานบุญ",
      budget: 1000000,
      ...getStats("merit", 1000000),
      color: "orange",
      icon: "🌸"
    },
    {
      title: "งานเลี้ยง",
      budget: 1000000,
      ...getStats("party", 1000000),
      color: "blue",
      icon: "🍸"
    },
    {
      title: "งานศพ",
      budget: 1000000,
      ...getStats("funeral", 1000000),
      color: "purple",
      icon: "🐦"
    },
  ], [getStats]);

  const { chartData, yAxisLabels } = useMemo(() => {
    const categories = ["wedding", "party", "merit", "funeral"];
    const baseBudgets = [1000000, 1000000, 1000000, 1000000];

    const profits = categories.map((cat, i) => {
      const items = budgetItems[cat] || [];
      const itemTotal = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);

      let events = [];
      if (cat === 'wedding') events = weddingEvents;
      else if (cat === 'party') events = partyEvents.filter(e => 
        e.category === 'ปาร์ตี้' || 
        e.category === 'งานเลี้ยง' || 
        e.category === 'งานวันเกิด' || 
        e.category === 'งานสร้างสรรค์' ||
        e.title.includes('วันเกิด')
      );
      else if (cat === 'merit') events = partyEvents.filter(e => e.category === 'งานบุญ' || e.category === 'สัมมนา');
      else if (cat === 'funeral') events = partyEvents.filter(e => e.category === 'งานศพ');
      
      const workRecordTotal = events.reduce((acc, ev) => {
        const staff = Number(String(ev.staff_cost || ev.staffWages || "0").replace(/[^0-9.]/g, "")) || 0;
        const venue = Number(String(ev.venue_cost || ev.venueCost || "0").replace(/[^0-9.]/g, "")) || 0;
        return acc + staff + venue;
      }, 0);

      const totalSpent = itemTotal + workRecordTotal;

      // ถ้าไม่มีการใช้จ่ายเลย ให้กำไรเป็น 0 ให้สอดคล้องกับบัตรสรุป
      if (totalSpent === 0) return 0;

      const netResult = baseBudgets[i] - totalSpent;
      return netResult > 0 ? netResult : 0;
    });

    const maxProfit = Math.max(...profits);
    // ปรับ chartMax ให้เป็นเลขที่ลงตัวกว่าเดิม (เช่น หลักแสน)
    const chartMax = Math.max(1000000, Math.ceil(maxProfit / 200000) * 200000);

    const data = profits.map((p) => {
      const height = chartMax > 0 ? Math.max(0, (p / chartMax) * 180) : 0;
      return { height: `${height}px` };
    });

    const labels = [];
    for (let i = 0; i <= 5; i++) {
      const val = (chartMax / 5) * i;
      labels.unshift(val >= 1000 ? `${(val / 1000).toFixed(0)}K` : `${val}`);
    }

    return { chartData: data, yAxisLabels: labels };
  }, [budgetItems, weddingEvents, partyEvents]);

  const tableRows = useMemo(() => {
    const allEvents = [...weddingEvents, ...partyEvents];

    return allEvents.map(ev => {
      const baseBudget = parseFloat(String(ev.budget || "0").replace(/[^0-9.]/g, "")) || 0;
      const staff = parseFloat(String(ev.staff_cost || ev.staffWages || "0").replace(/[^0-9.]/g, "")) || 0;
      const venue = parseFloat(String(ev.venue_cost || ev.venueCost || "0").replace(/[^0-9.]/g, "")) || 0;

      let category = "party";
      if (ev.category === "งานแต่ง") category = "wedding";
      else if (ev.category === "งานบุญ" || ev.category === "สัมมนา") category = "merit";
      else if (ev.category === "งานศพ") category = "funeral";
      else if (ev.category === "งานวันเกิด" || ev.category === "งานสร้างสรรค์" || ev.category === "ปาร์ตี้" || ev.category === "งานเลี้ยง") category = "party";

      const relatedItems = budgetItems[category] || [];
      const itemsTotal = relatedItems
        .filter(item => item.name.includes(ev.title))
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      const totalSpent = staff + venue + itemsTotal;
      const profitValue = baseBudget - totalSpent;

      // ปรับรูปแบบ Amount เป็น K (เช่น 35,000 -> 35K, 0 -> 0, -28,000 -> -28K)
      const formatK = (val) => {
        if (val === 0) return "0";
        const kVal = val / 1000;
        // ถ้าเป็นเลขลงตัว (เช่น 35.0) ให้แสดงแค่ 35K ถ้ามีทศนิยมให้แสดง 1 ตำแหน่ง
        return kVal % 1 === 0 ? `${kVal}K` : `${kVal.toFixed(1)}K`;
      };

      // ปรับรูปแบบวันที่
      let shortDate = ev.date || "-";
      if (shortDate.includes(" ")) {
        // กรณีเป็นภาษาไทย "21 มกราคม 2568" -> "21 ม.ค."
        const parts = shortDate.split(" ");
        if (parts.length >= 2) {
          const day = parts[0];
          const monthFull = parts[1];
          const monthMap = {
            "มกราคม": "ม.ค.", "กุมภาพันธ์": "ก.พ.", "มีนาคม": "มี.ค.", "เมษายน": "เม.ย.",
            "พฤษภาคม": "พ.ค.", "มิถุนายน": "มิ.ย.", "กรกฎาคม": "ก.ค.", "สิงหาคม": "ส.ค.",
            "กันยายน": "ก.ย.", "ตุลาคม": "ต.ค.", "พฤศจิกายน": "พ.ย.", "ธันวาคม": "ธ.ค."
          };
          shortDate = `${day} ${monthMap[monthFull] || monthFull}`;
        }
      }

      return {
        category: category,
        manager: ev.manager || "-",
        date: shortDate,
        amount: formatK(profitValue),
        status: ev.status === "completed" || ev.status === "เสร็จสิ้น" ? "Complete" :
                ev.status === "in_progress" || ev.status === "กำลังดำเนินการ" ? "In Progress" : "Pending",
        isLoss: profitValue < 0
      };
    }).sort((a, b) => {
      // เรียงตามหมวดหมู่ก่อน (Wedding, Party, Merit, Funeral)
      const catOrder = { "wedding": 1, "party": 2, "merit": 3, "funeral": 4 };
      if (catOrder[a.category] !== catOrder[b.category]) {
        return catOrder[a.category] - catOrder[b.category];
      }
      // ถ้าหมวดหมู่เดียวกัน ให้เรียงตาม Manager
      return a.manager.localeCompare(b.manager, 'th');
    });
  }, [weddingEvents, partyEvents, budgetItems]);

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
                    <div className="bd-card-costs" style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '8px', fontSize: '11px' }}>
                      <div className="cost-row">ค่าจ้าง: {c.staffTotal.toLocaleString()} บาท</div>
                      <div className="cost-row">ค่าสถานที่: {c.venueTotal.toLocaleString()} บาท</div>
                    </div>
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
                {yAxisLabels.map((label, idx) => (
                  <span key={idx}>{label}</span>
                ))}
              </div>
              <div>
                <div className="bd-bars">
                  <div className="bd-bar pink" style={chartData[0]}></div>
                  <div className="bd-bar blue" style={chartData[1]}></div>
                  <div className="bd-bar orange" style={chartData[2]}></div>
                  <div className="bd-bar purple" style={chartData[3]}></div>
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
            <div className="bd-table-scroll">
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
                      <td style={{ color: r.isLoss ? '#ef4444' : '#fff', fontWeight: '400' }}>
                        {r.amount}
                      </td>
                      <td><span className={`bd-status-pill ${r.status.toLowerCase().replace(' ', '')}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
