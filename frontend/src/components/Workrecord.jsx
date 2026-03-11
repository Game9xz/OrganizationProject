import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWorkContext } from "../context/useWorkContext";
import "./Workrecord.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { th } from "date-fns/locale";

// Icons
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
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconPin = () => (
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
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconUser = () => (
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
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const IconWallet = () => (
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
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const IconEdit = () => (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const IconTrash = () => (
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
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const IconSearch = () => (
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
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

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
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
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

// Helper: format date for display
const formatEventDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getFullYear() + 543;
    const dayMonth = format(d, "d MMMM", { locale: th });
    return `${dayMonth} ${year}`;
  } catch {
    return dateStr;
  }
};

export default function WorkRecord() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    room: "",
    category: "",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateOpen, setIsDateOpen] = useState(false);
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

  const { events, deleteEvent, addEvent, updateEvent } = useWorkContext();

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    eventId: null,
  });

  // Modal State for Create Work
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Modal State for Edit Work
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editWork, setEditWork] = useState(null);
  const [editDate, setEditDate] = useState(null);
  const [isEditDateOpen, setIsEditDateOpen] = useState(false);

  const [newWork, setNewWork] = useState({
    title: "",
    manager: "",
    category: "",
    location: "",
    room: "",
    date: "",
    budget: "",
    participants: "",
    staff_cost: "",
    venue_cost: "",
    status: "กำลังจัดเตรียม",
  });

  const handleOpenCreateModal = (e) => {
    if (e) e.preventDefault();
    setNewWork({
      title: "",
      manager: "",
      category: "",
      location: "",
      room: "",
      date: "",
      budget: "",
      participants: "",
      staff_cost: "",
      venue_cost: "",
      status: "กำลังจัดเตรียม",
    });
    setSelectedDate(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Auto-format numbers with commas for budget, staff_cost, and venue_cost
    if (["budget", "staff_cost", "venue_cost"].includes(name)) {
      // Remove non-digit characters
      const rawValue = value.replace(/\D/g, "");
      // Format with commas
      newValue = rawValue ? Number(rawValue).toLocaleString("en-US") : "";
    }

    setNewWork((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSaveNewWork = async () => {
    if (!newWork.title || !newWork.category) {
      alert("กรุณากรอกชื่องานและประเภทงาน");
      return;
    }

    // Convert selectedDate to ISO format for the API
    const eventPayload = {
      title: newWork.title,
      manager: newWork.manager,
      category: newWork.category,
      location: newWork.location,
      room: newWork.room,

      event_date: selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : null,

      people_count: Number(newWork.participants) || 0,

      budget: Number(newWork.budget.replace(/,/g, "")) || 0,
      staff_cost: Number(newWork.staff_cost.replace(/,/g, "")) || 0,
      venue_cost: Number(newWork.venue_cost.replace(/,/g, "")) || 0,

      status: newWork.status,
    };

    await addEvent(eventPayload);
    setIsCreateModalOpen(false);
  };

  const formatThaiBE = (d) => {
    if (!d) return "";
    const year = d.getFullYear() + 543;
    const dayMonth = format(d, "d MMMM", { locale: th });
    return `${dayMonth} ${year}`;
  };

  const confirmDelete = async () => {
    const { eventId } = deleteModal;
    await deleteEvent(eventId);
    cancelDelete();
  };

  const filterEvent = (event) => {
    const matchesSearch = (event.title || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLocation =
      !filters.location || event.location === filters.location;
    const matchesRoom = !filters.room || event.room === filters.room;
    const matchesCategory =
      !filters.category || event.category === filters.category;
    return matchesSearch && matchesLocation && matchesRoom && matchesCategory;
  };

  const filteredEvents = events.filter(filterEvent);
  const totalWorks = filteredEvents.length;

  // Dropdown Helpers
  const uniqueLocations = [...new Set(events.map((e) => e.location).filter(Boolean))];
  const uniqueRooms = [...new Set(events.map((e) => e.room).filter(Boolean))];
  const uniqueCategories = [...new Set(events.map((e) => e.category).filter(Boolean))];

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleFilterSelect = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type] === value ? "" : value,
    }));
    setActiveDropdown(null);
  };

  const handleEditClick = (event) => {
    setEditWork({
      event_id: event.event_id,
      title: event.title || "",
      manager: event.manager || "",
      category: event.category || "",
      location: event.location || "",
      room: event.room || "",
      date: event.event_date || "",
      budget: String(event.budget ?? ""),
      participants: String(event.people_count ?? ""),
      staff_cost: String(event.staff_cost ?? ""),
      venue_cost: String(event.venue_cost ?? ""),
      status: event.status || "กำลังจัดเตรียม",
    });
    if (event.event_date) {
      setEditDate(new Date(event.event_date));
    } else {
      setEditDate(null);
    }
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Auto-format numbers with commas for budget, staff_cost, and venue_cost
    if (["budget", "staff_cost", "venue_cost"].includes(name)) {
      // Remove non-digit characters
      const rawValue = value.replace(/\D/g, "");
      // Format with commas
      newValue = rawValue ? Number(rawValue).toLocaleString("en-US") : "";
    }

    setEditWork((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSaveEditWork = async () => {
    if (!editWork.title) {
      alert("กรุณากรอกชื่องาน");
      return;
    }

    const eventPayload = {
      title: editWork.title,
      manager: editWork.manager,
      category: editWork.category,
      location: editWork.location,
      room: editWork.room,
      event_date: editDate
        ? editDate.toISOString().split("T")[0]
        : editWork.date
          ? String(editWork.date).split("T")[0]
          : null,
      people_count: Number(editWork.participants) || 0,
      budget: Number(String(editWork.budget).replace(/,/g, "")) || 0,
      staff_cost: Number(String(editWork.staff_cost).replace(/,/g, "")) || 0,
      venue_cost: Number(String(editWork.venue_cost).replace(/,/g, "")) || 0,
      status: editWork.status,
    };

    console.log("EDIT PAYLOAD (before updateEvent):", eventPayload);

    await updateEvent(editWork.event_id, eventPayload);
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = (event) => {
    setDeleteModal({
      isOpen: true,
      eventId: event.event_id,
    });
  };

  const cancelDelete = () => {
    setDeleteModal({
      isOpen: false,
      eventId: null,
    });
  };

  const renderCard = (event) => (
    <div
      key={event.event_id}
      className="work-card"
      onClick={() => {
        navigate(`/workrecord/detail/${event.event_id}`, {
          state: { event },
        });
      }}
      style={{ cursor: "pointer" }}
    >
      <div className="card-title">{event.title}</div>
      <div className="card-desc">{event.category || ""}</div>

      <div className="card-row">
        <IconCalendar />
        <span>{formatEventDate(event.event_date || event.date)}</span>
      </div>

      <div className="card-row">
        <IconPin />
        <span>{event.location || "-"}</span>
      </div>

      <div className="card-footer">
        <div className="footer-left" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="stat-item">
              <IconUser />
              <span>{event.people || event.people_count || 0}</span>
            </div>
            <div className="stat-item">
              <IconWallet />
              <span>{Number(String(event.budget || 0).replace(/[^0-9.]/g, "")).toLocaleString()} บาท</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#9ca3af' }}>
            <div>จ้าง: {Number(String(event.staff_cost || 0).replace(/[^0-9.]/g, "")).toLocaleString()} ฿</div>
            <div>สถานที่: {Number(String(event.venue_cost || 0).replace(/[^0-9.]/g, "")).toLocaleString()} ฿</div>
          </div>
        </div>

        <div className="action-btns">
          <button
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(event);
            }}
          >
            <IconEdit /> แก้ไข
          </button>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(event);
            }}
          >
            <IconTrash />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="wr-layout">
      {/* Sidebar */}
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
        <div className="brand-text">{user?.username}</div>
        <div className="brand-sub">{user?.email}</div>

        <nav className="nav-menu">
          <Link to="/homepage" className="nav-item">
            หน้าแรก
          </Link>
          <Link to="/workrecord" className="nav-item active">
            บันทึกงาน
          </Link>
          <Link to="/workrecord/status" className="nav-item">
            สถานะงาน
          </Link>
          <Link to="#" className="nav-item">
            ออกแบบ
          </Link>
          <Link to="/inventory" className="nav-item">
            คลัง
          </Link>
          <Link to="/inventory/status" className="nav-item">
            สถานะคลัง
          </Link>
          <Link to="/budget" className="nav-item">
            งบประมาณ
          </Link>
        </nav>

        <button className="logout-btn" onClick={logout}>
          Log out <IconLogout />
        </button>
      </aside>

      {/* Main Content */}
      <main className="wr-content">
        <header className="wr-header">
          <div>
            <h1 className="page-title">บันทึกงานทั้งหมด</h1>
            <div className="page-year">{new Date().getFullYear() + 543}</div>
          </div>
          <button
            type="button"
            className="create-btn"
            onClick={handleOpenCreateModal}
          >
            + สร้างงานใหม่
          </button>
        </header>

        <div className="stats-pill">จำนวนงานทั้งหมด : {totalWorks}</div>

        <section className="filters-bar">
          {/* Location Dropdown */}
          <div className="filter-dropdown-container">
            <button
              className={`filter-btn btn-blue ${filters.location ? "active-filter" : ""}`}
              onClick={() => toggleDropdown("location")}
            >
              {filters.location || "สถานที่"}
            </button>
            {activeDropdown === "location" && (
              <div className="dropdown-menu">
                {uniqueLocations.map((loc) => (
                  <button
                    key={loc}
                    className={`dropdown-item ${filters.location === loc ? "active" : ""}`}
                    onClick={() => handleFilterSelect("location", loc)}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Room Dropdown */}
          <div className="filter-dropdown-container">
            <button
              className={`filter-btn btn-purple ${filters.room ? "active-filter" : ""}`}
              onClick={() => toggleDropdown("room")}
            >
              {filters.room || "ห้อง"}
            </button>
            {activeDropdown === "room" && (
              <div className="dropdown-menu">
                {uniqueRooms.map((room) => (
                  <button
                    key={room}
                    className={`dropdown-item ${filters.room === room ? "active" : ""}`}
                    onClick={() => handleFilterSelect("room", room)}
                  >
                    {room}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="filter-dropdown-container">
            <button
              className={`filter-btn btn-orange ${filters.category ? "active-filter" : ""}`}
              onClick={() => toggleDropdown("category")}
            >
              {filters.category || "ประเภท"}
            </button>
            {activeDropdown === "category" && (
              <div className="dropdown-menu">
                {uniqueCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`dropdown-item ${filters.category === cat ? "active" : ""}`}
                    onClick={() => handleFilterSelect("category", cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="search-box">
            <input
              className="search-input"
              placeholder="ค้นหากิจกรรม"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="search-icon-svg">
              <IconSearch />
            </div>
          </div>
        </section>

        <div className="cards-grid">
          {filteredEvents.map((event) => renderCard(event))}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <h2 className="delete-modal-title">ยืนยันการลบ?</h2>
            <p className="delete-modal-message">คุณต้องการลบงานนี้ใช่หรือไม่</p>
            <div className="delete-modal-actions">
              <button className="delete-confirm-btn" onClick={confirmDelete}>
                ตกลง
              </button>
              <button className="delete-cancel-btn" onClick={cancelDelete}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Work Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={handleCloseCreateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">สร้างงานใหม่</h2>

            <div className="modal-form">
              <div className="form-group">
                <label>ชื่องาน</label>
                <input
                  type="text"
                  name="title"
                  value={newWork.title}
                  onChange={handleCreateInputChange}
                  className="form-input"
                  placeholder="ชื่องาน"
                />
              </div>

              <div className="form-group">
                <label>ชื่อผู้รับผิดชอบ (Manager)</label>
                <input
                  type="text"
                  name="manager"
                  value={newWork.manager}
                  onChange={handleCreateInputChange}
                  className="form-input"
                  placeholder="ชื่อผู้รับผิดชอบ"
                />
              </div>

              <div className="form-group">
                <label>ประเภทงาน</label>
                <input
                  type="text"
                  name="category"
                  value={newWork.category}
                  onChange={handleCreateInputChange}
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
                  onChange={handleCreateInputChange}
                  className="form-input"
                  placeholder="สถานที่จัดงาน"
                />
              </div>

              <div className="form-group">
                <label>ห้อง</label>
                <input
                  type="text"
                  name="room"
                  value={newWork.room}
                  onChange={handleCreateInputChange}
                  className="form-input"
                  placeholder="ห้อง"
                />
              </div>

              <div className="form-group-row">
                <div className="form-group date-group">
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
                <div className="form-group participants-group">
                  <label>จำนวนคน</label>
                  <input
                    type="text"
                    name="participants"
                    value={newWork.participants}
                    onChange={handleCreateInputChange}
                    className="form-input"
                    placeholder="200"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>งบประมาณ</label>
                <div className="budget-input-wrapper">
                  <input
                    type="text"
                    name="budget"
                    value={newWork.budget}
                    onChange={handleCreateInputChange}
                    className="form-input"
                    placeholder="500,000"
                  />
                  <span className="budget-unit">บาท</span>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>ค่าจ้างพนักงาน</label>
                  <div className="budget-input-wrapper">
                    <input
                      type="text"
                      name="staff_cost"
                      value={newWork.staff_cost}
                      onChange={handleCreateInputChange}
                      className="form-input"
                      placeholder="35,000"
                    />
                    <span className="budget-unit">บาท</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>ค่าสถานที่</label>
                  <div className="budget-input-wrapper">
                    <input
                      type="text"
                      name="venue_cost"
                      value={newWork.venue_cost}
                      onChange={handleCreateInputChange}
                      className="form-input"
                      placeholder="100,000"
                    />
                    <span className="budget-unit">บาท</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>สถานะ</label>
                <div className="select-wrapper">
                  <select
                    name="status"
                    value={newWork.status}
                    onChange={handleCreateInputChange}
                    className="form-input form-select"
                  >
                    <option value="กำลังจัดเตรียม">กำลังจัดเตรียม</option>
                    <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                    <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                  </select>
                  <span className="select-arrow-black">
                    <IconChevronDown />
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCloseCreateModal}>
                ยกเลิก
              </button>
              <button className="btn-save" onClick={handleSaveNewWork}>
                สร้างงาน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Work Modal */}
      {isEditModalOpen && editWork && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">แก้ไขงาน</h2>

            <div className="modal-form">
              <div className="form-group">
                <label>ชื่องาน</label>
                <input
                  type="text"
                  name="title"
                  value={editWork.title}
                  onChange={handleEditInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>ชื่อผู้รับผิดชอบ (Manager)</label>
                <input
                  type="text"
                  name="manager"
                  value={editWork.manager}
                  onChange={handleEditInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>ประเภทงาน</label>
                <input
                  type="text"
                  name="category"
                  value={editWork.category}
                  onChange={handleEditInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>สถานที่จัดงาน</label>
                <input
                  type="text"
                  name="location"
                  value={editWork.location}
                  onChange={handleEditInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>ห้อง</label>
                <input
                  type="text"
                  name="room"
                  value={editWork.room}
                  onChange={handleEditInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group-row">
                <div className="form-group date-group">
                  <label>วันที่</label>
                  <div className="date-input-wrapper">
                    <span
                      className="calendar-icon-left"
                      onClick={() => setIsEditDateOpen(true)}
                    >
                      <IconCalendar />
                    </span>
                    <DatePicker
                      selected={editDate}
                      onChange={(date) => {
                        setEditDate(date);
                        setEditWork((prev) => ({
                          ...prev,
                          date: formatThaiBE(date),
                        }));
                        setIsEditDateOpen(false);
                      }}
                      open={isEditDateOpen}
                      onInputClick={() => setIsEditDateOpen(true)}
                      onClickOutside={() => setIsEditDateOpen(false)}
                      locale={th}
                      placeholderText="14/2/2568"
                      className="form-input with-icon-left"
                      dateFormat="dd/MM/yyyy"
                      showPopperArrow={false}
                    />
                  </div>
                </div>
                <div className="form-group participants-group">
                  <label>จำนวนคน</label>
                  <input
                    type="text"
                    name="participants"
                    value={editWork.participants}
                    onChange={handleEditInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>งบประมาณ</label>
                <div className="budget-input-wrapper">
                  <input
                    type="text"
                    name="budget"
                    value={editWork.budget}
                    onChange={handleEditInputChange}
                    className="form-input"
                  />
                  <span className="budget-unit">บาท</span>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>ค่าจ้างพนักงาน</label>
                  <div className="budget-input-wrapper">
                    <input
                      type="text"
                      name="staff_cost"
                      value={editWork.staff_cost}
                      onChange={handleEditInputChange}
                      className="form-input"
                    />
                    <span className="budget-unit">บาท</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>ค่าสถานที่</label>
                  <div className="budget-input-wrapper">
                    <input
                      type="text"
                      name="venue_cost"
                      value={editWork.venue_cost}
                      onChange={handleEditInputChange}
                      className="form-input"
                    />
                    <span className="budget-unit">บาท</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>สถานะ</label>
                <div className="select-wrapper">
                  <select
                    name="status"
                    value={editWork.status}
                    onChange={handleEditInputChange}
                    className="form-input form-select"
                  >
                    <option value="กำลังจัดเตรียม">กำลังจัดเตรียม</option>
                    <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                    <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                  </select>
                  <span className="select-arrow-black">
                    <IconChevronDown />
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>
                ยกเลิก
              </button>
              <button className="btn-save" onClick={handleSaveEditWork}>
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
