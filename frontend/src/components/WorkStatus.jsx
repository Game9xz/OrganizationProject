import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWorkContext } from "../context/WorkContext";
import "./WorkStatus.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { th } from "date-fns/locale";

// Icons
const IconLogout = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconChevronDown = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconPlus = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconCalendar = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const createEventTimeline = (eventId) => {
  const timelines = {
    1: [
      { time: "06.00 น.", items: [{ title: "พิธีเช้าตักบาตร", timeRange: "เริ่มต้น 06:00 - 08:00 น.", type: "normal" }] },
      { time: "09.00 น.", items: [{ title: "พิธีแห่ขันหมาก", timeRange: "เริ่มต้น 09:00 - 10:30 น.", type: "normal" }, { title: "พิธีการสู่ขอ และนับสินสอด", timeRange: "เริ่มต้น 10:30 - 11:00 น.", type: "normal" }, { title: "พิธีหลั่งน้ำพระพุทธมนต์", timeRange: "เริ่มต้น 11:30 - 12:00 น.", type: "normal" }] },
      { time: "12.00 น.", items: [{ title: "รับประทานอาหารกลางวัน", timeRange: "เริ่มต้น 12:00 - 14:00 น.", type: "normal" }, { title: "พักผ่อน", timeRange: "เริ่มต้น 12:00 - 15:00 น.", type: "warning" }] },
      { time: "15.00 น.", items: [{ title: "เตรียมตัว", timeRange: "เริ่มต้น 15:30 - 18:00 น.", type: "normal" }] },
      { time: "18.00 น.", items: [{ title: "พิธีเย็น", timeRange: "เริ่มต้น 18:00 - 18:30 น.", type: "normal" }] },
    ],
    2: [
      { time: "06.00 น.", items: [{ title: "พิธีเช้าตักบาตร", timeRange: "เริ่มต้น 06:30 - 08:00 น.", type: "normal" }] },
      { time: "09.00 น.", items: [{ title: "พิธีแห่ขันหมาก", timeRange: "เริ่มต้น 09:00 - 10:00 น.", type: "normal" }, { title: "การประกอบพิธี", timeRange: "เริ่มต้น 10:30 - 11:30 น.", type: "normal" }] },
      { time: "12.00 น.", items: [{ title: "เลี้ยงอาหารกลางวัน", timeRange: "เริ่มต้น 12:00 - 13:30 น.", type: "normal" }] },
      { time: "15.00 น.", items: [{ title: "เตรียมเย็น", timeRange: "เริ่มต้น 15:00 - 16:30 น.", type: "normal" }] },
      { time: "18.00 น.", items: [{ title: "สังสรรค์คืนค่ำ", timeRange: "เริ่มต้น 18:30 - 20:00 น.", type: "normal" }] },
    ],
    3: [
      { time: "06.00 น.", items: [{ title: "เตรียมการ", timeRange: "เริ่มต้น 07:00 - 08:30 น.", type: "normal" }] },
      { time: "09.00 น.", items: [{ title: "พิธีหลัก", timeRange: "เริ่มต้น 09:30 - 11:00 น.", type: "normal" }, { title: "ถ่ายรูป", timeRange: "เริ่มต้น 11:00 - 11:30 น.", type: "normal" }] },
      { time: "12.00 น.", items: [{ title: "อาหารกลางวัน", timeRange: "เริ่มต้น 12:00 - 13:00 น.", type: "normal" }] },
      { time: "15.00 น.", items: [{ title: "ลงพื้น", timeRange: "เริ่มต้น 15:00 - 17:00 น.", type: "normal" }] },
      { time: "18.00 น.", items: [] },
    ],
    4: [
      { time: "06.00 น.", items: [{ title: "เตรียมพื้นที่", timeRange: "เริ่มต้น 06:00 - 07:00 น.", type: "normal" }] },
      { time: "09.00 น.", items: [{ title: "พิธีวิวาห์", timeRange: "เริ่มต้น 09:00 - 10:00 น.", type: "normal" }, { title: "ฉากหลัง", timeRange: "เริ่มต้น 10:00 - 11:00 น.", type: "normal" }] },
      { time: "12.00 น.", items: [{ title: "ปลุกเสก", timeRange: "เริ่มต้น 12:30 - 13:30 น.", type: "normal" }] },
      { time: "15.00 น.", items: [{ title: "แพทย์เยี่ยม", timeRange: "เริ่มต้น 15:30 - 16:30 น.", type: "normal" }] },
      { time: "18.00 น.", items: [{ title: "ดูหน้า", timeRange: "เริ่มต้น 18:00 - 19:00 น.", type: "normal" }] },
    ],
    5: [
      { time: "06.00 น.", items: [] },
      { time: "09.00 น.", items: [{ title: "ตั้งค่าสถานที่", timeRange: "เริ่มต้น 09:00 - 11:00 น.", type: "normal" }] },
      { time: "12.00 น.", items: [{ title: "เสิร์ฟอาหาร", timeRange: "เริ่มต้น 12:00 - 13:00 น.", type: "normal" }] },
      { time: "15.00 น.", items: [{ title: "ตัดเค้ก", timeRange: "เริ่มต้น 15:00 - 15:30 น.", type: "normal" }] },
      { time: "18.00 น.", items: [{ title: "การแสดงสด", timeRange: "เริ่มต้น 18:00 - 20:00 น.", type: "normal" }] },
    ],
    6: [
      { time: "06.00 น.", items: [] },
      { time: "09.00 น.", items: [{ title: "ลงทะเบียน", timeRange: "เริ่มต้น 08:30 - 09:00 น.", type: "normal" }, { title: "สปีชอาร์ต", timeRange: "เริ่มต้น 09:00 - 10:30 น.", type: "normal" }] },
      { time: "12.00 น.", items: [{ title: "อาหารกลางวัน", timeRange: "เริ่มต้น 12:00 - 13:00 น.", type: "normal" }, { title: "Workshop", timeRange: "เริ่มต้น 13:00 - 14:30 น.", type: "normal" }] },
      { time: "15.00 น.", items: [{ title: "อภิปรายกลุ่ม", timeRange: "เริ่มต้น 15:00 - 16:30 น.", type: "normal" }] },
      { time: "18.00 น.", items: [{ title: "เลี้ยงค่ำ", timeRange: "เริ่มต้น 18:00 - 19:30 น.", type: "normal" }] },
    ],
  };
  return timelines[eventId] || [
    { time: "06.00 น.", items: [] },
    { time: "09.00 น.", items: [] },
    { time: "12.00 น.", items: [] },
    { time: "15.00 น.", items: [] },
    { time: "18.00 น.", items: [] },
  ];
};

export default function WorkStatus() {
  const navigate = useNavigate();
  const { weddingEvents, partyEvents, updateEventStatus, addEvent } =
    useWorkContext();
  const [activeTab, setActiveTab] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newWork, setNewWork] = useState({
    title: "",
    category: "",
    location: "",
    date: "",
    budget: "",
    status: "undetermined",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("se_remember");
    navigate("/login");
  };

  const allEvents = useMemo(() => {
    return [...weddingEvents, ...partyEvents].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
  }, [weddingEvents, partyEvents]);

  // Stats Calculation
  const totalWorks = allEvents.length;
  const undeterminedCount = allEvents.filter(
    (e) => e.status === "undetermined",
  ).length;

  const overlappingCount = useMemo(() => {
    const dateMap = {};
    allEvents.forEach((e) => {
      dateMap[e.date] = (dateMap[e.date] || 0) + 1;
    });
    return Object.values(dateMap).filter((count) => count > 1).length;
  }, [allEvents]);

  const statusCounts = {
    all: totalWorks,
    preparing: allEvents.filter((e) => e.status === "preparing").length,
    in_progress: allEvents.filter((e) => e.status === "in_progress").length,
    completed: allEvents.filter((e) => e.status === "completed").length,
  };

  const filteredEvents =
    activeTab === "all"
      ? allEvents
      : allEvents.filter((e) => e.status === activeTab);

  const getStatusColor = (status) => {
    switch (status) {
      case "preparing":
        return "status-preparing";
      case "in_progress":
        return "status-inprogress";
      case "completed":
        return "status-completed";
      case "undetermined":
        return "status-undetermined";
      default:
        return "";
    }
  };

  // Handlers for Create Modal
  const handleOpenModal = (e) => {
    if (e) e.preventDefault();
    setNewWork({
      title: "",
      category: "",
      location: "",
      date: "",
      budget: "",
      status: "undetermined",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWork((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveWork = () => {
    if (!newWork.title || !newWork.category) {
      alert("กรุณากรอกชื่องานและประเภทงาน");
      return;
    }

    // Convert date format if needed or just pass as is
    // Assuming simple string for now as per current data structure

    addEvent(newWork);
    setIsModalOpen(false);
  };
  const formatThaiBE = (d) => {
    if (!d) return "";
    const year = d.getFullYear() + 543;
    const dayMonth = format(d, "d MMMM", { locale: th });
    return `${dayMonth} ${year}`;
  };

  return (
    <div className="ws-layout">
      {/* Sidebar - Same as Workrecord */}
      <aside className="ws-sidebar">
        <div className="brand-logo">
          <svg
            className="cat-icon"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
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
          </svg>
        </div>
        <div className="brand-text">SE EVENT</div>
        <div className="brand-sub">Group8.SE@ku.th</div>

        <nav className="nav-menu">
          <Link to="/homepage" className="nav-item">
            หน้าแรก
          </Link>
          <Link to="/workrecord" className="nav-item">
            บันทึกงาน
          </Link>
          <Link to="/workrecord/status" className="nav-item active">
            สถานะงาน
          </Link>
          <Link to="#" className="nav-item">
            ออกแบบ
          </Link>
          <Link to="#" className="nav-item">
            คลัง
          </Link>
          <Link to="#" className="nav-item">
            สถานะคลัง
          </Link>
          <Link to="#" className="nav-item">
            งบประมาณ
          </Link>
        </nav>

        <button className="logout-btn" onClick={logout}>
          Log out <IconLogout />
        </button>
      </aside>

      {/* Main Content */}
      <main className="ws-content">
        <header className="ws-header">
          <div className="header-left">
            <h1 className="page-title">สถานะงาน</h1>
          </div>
          <div className="header-right">
            <button
              type="button"
              className="create-work-btn"
              onClick={handleOpenModal}
            >
              <IconPlus /> สร้างงานใหม่
            </button>
            <div className="user-profile">
              {/* Placeholder for user profile if needed */}
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">จำนวนกิจกรรมทั้งหมด</div>
            <div className="stat-value">{totalWorks}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">จำนวนงานที่ยังไม่ได้กำหนด</div>
            <div className="stat-value">{undeterminedCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">จำนวนงานที่ซ้อนกัน</div>
            <div className="stat-value">{overlappingCount}</div>
          </div>
        </section>

        {/* Filter Pills */}
        <section className="status-tabs">
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            ทั้งหมด ({statusCounts.all})
          </button>
          <button
            className={`tab-btn ${activeTab === "preparing" ? "active" : ""}`}
            onClick={() => setActiveTab("preparing")}
          >
            กำลังจัดเตรียม ({statusCounts.preparing})
          </button>
          <button
            className={`tab-btn ${activeTab === "in_progress" ? "active" : ""}`}
            onClick={() => setActiveTab("in_progress")}
          >
            กำลังดำเนินการ ({statusCounts.in_progress})
          </button>
          <button
            className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            เสร็จสิ้น ({statusCounts.completed})
          </button>
        </section>

        {/* Works Table */}
        <div className="works-table-container">
          <table className="works-table">
            <thead>
              <tr>
                <th>ชื่องาน</th>
                <th>วันที่</th>
                <th>สถานที่</th>
                <th>สถานะ</th>
                <th>รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td className="col-title">
                    <div className="event-title">{event.title}</div>
                    <div className="event-category">{event.category}</div>
                  </td>
                  <td className="col-date">{event.date}</td>
                  <td className="col-location">{event.location}</td>
                  <td className="col-status">
                    <div className="status-dropdown-wrapper">
                      <select
                        className={`status-select ${getStatusColor(event.status)}`}
                        value={event.status}
                        onChange={(e) =>
                          updateEventStatus(event.id, e.target.value)
                        }
                      >
                        <option value="undetermined">ยังไม่ได้กำหนด</option>
                        <option value="preparing">กำลังจัดเตรียม</option>
                        <option value="in_progress">กำลังดำเนินการ</option>
                        <option value="completed">เสร็จสิ้น</option>
                      </select>
                      <span className="select-arrow">
                        <IconChevronDown />
                      </span>
                    </div>
                  </td>
                  <td className="col-action">
                    <button
                      className="detail-btn"
                      onClick={() => {
                        const timeline = createEventTimeline(event.id);
                        navigate(`/workrecord/detail/${event.id}`, {
                          state: { event, timeline },
                        });
                      }}
                    >
                      รายละเอียด
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Create Work Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">สร้างงานใหม่</h2>

            <div className="modal-form">
              <div className="form-group">
                <label>ชื่องาน</label>
                <input
                  type="text"
                  name="title"
                  value={newWork.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="ชื่องาน"
                />
              </div>

              <div className="form-group">
                <label>ประเภทงาน</label>
                <input
                  type="text"
                  name="category"
                  value={newWork.category}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="ประเภทงาน"
                />
              </div>

              <div className="form-group">
                <label>สถานที่จัดงาน</label>
                <input
                  type="text"
                  name="location"
                  value={newWork.location}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="สถานที่จัดงาน"
                />
              </div>

              <div className="form-group">
                <label>วันที่</label>
                <div className="date-input-wrapper">
                  <span
                    className="calendar-icon-left"
                    onClick={() => setIsDateOpen(true)}
                  >
                    <IconCalendar />
                  </span>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setNewWork((prev) => ({
                        ...prev,
                        date: formatThaiBE(date),
                      }));
                      setIsDateOpen(false);
                    }}
                    open={isDateOpen}
                    onInputClick={() => setIsDateOpen(true)}
                    onClickOutside={() => setIsDateOpen(false)}
                    locale={th}
                    placeholderText="14/2/2568"
                    className="form-input with-icon-left"
                    dateFormat="dd/MM/yyyy"
                    showPopperArrow={false}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>งบประมาณ</label>
                <input
                  type="text"
                  name="budget"
                  value={newWork.budget}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="ระบุงบประมาณ"
                />
              </div>

              <div className="form-group">
                <label>สถานะ</label>
                <div className="select-wrapper">
                  <select
                    name="status"
                    value={newWork.status}
                    onChange={handleInputChange}
                    className="form-input form-select"
                  >
                    <option value="undetermined">ยังไม่ได้กำหนด</option>
                    <option value="preparing">กำลังจัดเตรียม</option>
                    <option value="in_progress">กำลังดำเนินการ</option>
                    <option value="completed">เสร็จสิ้น</option>
                  </select>
                  <span className="select-arrow-black">
                    <IconChevronDown />
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCloseModal}>
                ยกเลิก
              </button>
              <button className="btn-save" onClick={handleSaveWork}>
                สร้างงาน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
