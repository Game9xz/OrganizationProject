import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWorkContext } from "../context/WorkContext";
import "./Workrecord.css";

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

// Helper function to create event timeline
const createEventTimeline = (eventId) => {
  const timelines = {
    1: [
      // งานแต่ง คุณกาญจนา
      {
        time: "06.00 น.",
        items: [
          {
            title: "พิธีเช้าตักบาตร",
            timeRange: "เริ่มต้น 06:00 - 08:00 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "09.00 น.",
        items: [
          {
            title: "พิธีแห่ขันหมาก",
            timeRange: "เริ่มต้น 09:00 - 10:30 น.",
            type: "normal",
          },
          {
            title: "พิธีการสู่ขอ และนับสินสอด",
            timeRange: "เริ่มต้น 10:30 - 11:00 น.",
            type: "normal",
          },
          {
            title: "พิธีหลั่งน้ำพระพุทธมนต์",
            timeRange: "เริ่มต้น 11:30 - 12:00 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "12.00 น.",
        items: [
          {
            title: "รับประทานอาหารกลางวัน",
            timeRange: "เริ่มต้น 12:00 - 14:00 น.",
            type: "normal",
          },
          {
            title: "พักผ่อน",
            timeRange: "เริ่มต้น 12:00 - 15:00 น.",
            type: "warning",
          },
        ],
      },
      {
        time: "15.00 น.",
        items: [
          {
            title: "เตรียมตัว",
            timeRange: "เริ่มต้น 15:30 - 18:00 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "18.00 น.",
        items: [
          {
            title: "พิธีเย็น",
            timeRange: "เริ่มต้น 18:00 - 18:30 น.",
            type: "normal",
          },
        ],
      },
    ],
    2: [
      // งานแต่ง คุณเอ & คุณบี
      {
        time: "06.00 น.",
        items: [
          {
            title: "พิธีเช้าตักบาตร",
            timeRange: "เริ่มต้น 06:30 - 08:00 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "09.00 น.",
        items: [
          {
            title: "พิธีแห่ขันหมาก",
            timeRange: "เริ่มต้น 09:00 - 10:00 น.",
            type: "normal",
          },
          {
            title: "การประกอบพิธี",
            timeRange: "เริ่มต้น 10:30 - 11:30 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "12.00 น.",
        items: [
          {
            title: "เลี้ยงอาหารกลางวัน",
            timeRange: "เริ่มต้น 12:00 - 13:30 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "15.00 น.",
        items: [
          {
            title: "เตรียมเย็น",
            timeRange: "เริ่มต้น 15:00 - 16:30 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "18.00 น.",
        items: [
          {
            title: "สังสรรค์คืนค่ำ",
            timeRange: "เริ่มต้น 18:30 - 20:00 น.",
            type: "normal",
          },
        ],
      },
    ],
    3: [
      // งานแต่ง คุณเจ้านาย
      {
        time: "06.00 น.",
        items: [
          {
            title: "เตรียมการ",
            timeRange: "เริ่มต้น 07:00 - 08:30 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "09.00 น.",
        items: [
          {
            title: "พิธีหลัก",
            timeRange: "เริ่มต้น 09:30 - 11:00 น.",
            type: "normal",
          },
          {
            title: "ถ่ายรูป",
            timeRange: "เริ่มต้น 11:00 - 11:30 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "12.00 น.",
        items: [
          {
            title: "อาหารกลางวัน",
            timeRange: "เริ่มต้น 12:00 - 13:00 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "15.00 น.",
        items: [
          {
            title: "ลงพื้น",
            timeRange: "เริ่มต้น 15:00 - 17:00 น.",
            type: "normal",
          },
        ],
      },
      { time: "18.00 น.", items: [] },
    ],
    4: [
      // งานแต่ง คุณเจได
      {
        time: "06.00 น.",
        items: [
          {
            title: "เตรียมพื้นที่",
            timeRange: "เริ่มต้น 06:00 - 07:00 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "09.00 น.",
        items: [
          {
            title: "พิธีวิวาห์",
            timeRange: "เริ่มต้น 09:00 - 10:00 น.",
            type: "normal",
          },
          {
            title: "ฉากหลัง",
            timeRange: "เริ่มต้น 10:00 - 11:00 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "12.00 น.",
        items: [
          {
            title: "ปลุกเสก",
            timeRange: "เริ่มต้น 12:30 - 13:30 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "15.00 น.",
        items: [
          {
            title: "แพทย์เยี่ยม",
            timeRange: "เริ่มต้น 15:30 - 16:30 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "18.00 น.",
        items: [
          {
            title: "ดูหน้า",
            timeRange: "เริ่มต้น 18:00 - 19:00 น.",
            type: "normal",
          },
        ],
      },
    ],
    5: [
      // งานวันเกิดสุดพิเศษ
      { time: "06.00 น.", items: [] },
      {
        time: "09.00 น.",
        items: [
          {
            title: "ตั้งค่าสถานที่",
            timeRange: "เริ่มต้น 09:00 - 11:00 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "12.00 น.",
        items: [
          {
            title: "เสิร์ฟอาหาร",
            timeRange: "เริ่มต้น 12:00 - 13:00 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "15.00 น.",
        items: [
          {
            title: "ตัดเค้ก",
            timeRange: "เริ่มต้น 15:00 - 15:30 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "18.00 น.",
        items: [
          {
            title: "การแสดงสด",
            timeRange: "เริ่มต้น 18:00 - 20:00 น.",
            type: "normal",
          },
        ],
      },
    ],
    6: [
      // สัมมนาผู้นำองค์กร 2024
      { time: "06.00 น.", items: [] },
      {
        time: "09.00 น.",
        items: [
          {
            title: "ลงทะเบียน",
            timeRange: "เริ่มต้น 08:30 - 09:00 น.",
            type: "normal",
          },
          {
            title: "สปีชอาร์ต",
            timeRange: "เริ่มต้น 09:00 - 10:30 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "12.00 น.",
        items: [
          {
            title: "อาหารกลางวัน",
            timeRange: "เริ่มต้น 12:00 - 13:00 น.",
            type: "normal",
          },
          {
            title: "Workshop",
            timeRange: "เริ่มต้น 13:00 - 14:30 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "15.00 น.",
        items: [
          {
            title: "อภิปรายกลุ่ม",
            timeRange: "เริ่มต้น 15:00 - 16:30 น.",
            type: "normal",
          },
        ],
      },
      {
        time: "18.00 น.",
        items: [
          {
            title: "เลี้ยงค่ำ",
            timeRange: "เริ่มต้น 18:00 - 19:30 น.",
            type: "normal",
          },
        ],
      },
    ],
  };

  return (
    timelines[eventId] || [
      { time: "06.00 น.", items: [] },
      { time: "09.00 น.", items: [] },
      { time: "12.00 น.", items: [] },
      { time: "15.00 น.", items: [] },
      { time: "18.00 น.", items: [] },
    ]
  );
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

  const logout = () => {
    localStorage.removeItem("se_remember");
    navigate("/login");
  };

  const { weddingEvents, partyEvents, deleteEvent, addEvent } =
    useWorkContext();

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    eventId: null,
    eventType: null,
  });

  // Modal State for Create Work
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newWork, setNewWork] = useState({
    title: "",
    category: "",
    location: "",
    date: "",
    budget: "",
    participants: "",
    status: "undetermined",
  });

  const handleOpenCreateModal = (e) => {
    if (e) e.preventDefault();
    setNewWork({
      title: "",
      category: "",
      location: "",
      date: "",
      budget: "",
      participants: "",
      status: "undetermined",
    });
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setNewWork((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveNewWork = () => {
    if (!newWork.title || !newWork.category) {
      alert("กรุณากรอกชื่องานและประเภทงาน");
      return;
    }

    addEvent(newWork);
    setIsCreateModalOpen(false);
  };

  const confirmDelete = () => {
    const { eventId } = deleteModal;
    deleteEvent(eventId);
    cancelDelete();
  };
  const filterEvent = (event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLocation =
      !filters.location || event.location === filters.location;
    const matchesRoom = !filters.room || event.room === filters.room;
    const matchesCategory =
      !filters.category || event.category === filters.category;
    return matchesSearch && matchesLocation && matchesRoom && matchesCategory;
  };

  const filteredWeddingEvents = weddingEvents.filter(filterEvent);
  const filteredPartyEvents = partyEvents.filter(filterEvent);

  const totalWorks = filteredWeddingEvents.length + filteredPartyEvents.length;

  // Dropdown Helpers
  const allEvents = [...weddingEvents, ...partyEvents];
  const uniqueLocations = [...new Set(allEvents.map((e) => e.location))];
  const uniqueRooms = [...new Set(allEvents.map((e) => e.room))];
  const uniqueCategories = [...new Set(allEvents.map((e) => e.category))];

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

  const handleEditClick = (event, eventType) => {
    // Navigate to detail page for editing with event data and timeline
    const timeline = createEventTimeline(event.id);
    navigate(`/workrecord/detail/${event.id}`, {
      state: { event, eventType, timeline },
    });
  };

  const handleDeleteClick = (event, eventType) => {
    setDeleteModal({
      isOpen: true,
      eventId: event.id,
      eventType: eventType,
    });
  };

  const cancelDelete = () => {
    setDeleteModal({
      isOpen: false,
      eventId: null,
      eventType: null,
    });
  };

  const renderCard = (event, eventType) => (
    <div
      key={event.id}
      className="work-card"
      onClick={() => {
        const timeline = createEventTimeline(event.id);
        navigate(`/workrecord/detail/${event.id}`, {
          state: { event, eventType, timeline },
        });
      }}
      style={{ cursor: "pointer" }}
    >
      <div className="card-title">{event.title}</div>
      <div className="card-desc">{event.desc}</div>

      <div className="card-row">
        <IconCalendar />
        <span>{event.date}</span>
      </div>

      <div className="card-row">
        <IconPin />
        <span>{event.location}</span>
      </div>

      <div className="card-footer">
        <div className="footer-left">
          <div className="stat-item">
            <IconUser />
            <span>{event.people}</span>
          </div>
          <div className="stat-item">
            <IconWallet />
            <span>{event.budget}</span>
          </div>
        </div>

        <div className="action-btns">
          <button
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(event, eventType);
            }}
          >
            <IconEdit /> แก้ไข
          </button>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(event, eventType);
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
      <aside className="wr-sidebar">
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
          <Link to="/workrecord" className="nav-item active">
            บันทึกงาน
          </Link>
          <Link to="/workrecord/status" className="nav-item">
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
      <main className="wr-content">
        <header className="wr-header">
          <div>
            <h1 className="page-title">บันทึกงานทั้งหมด</h1>
            <div className="page-year">2025</div>
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
          {filteredWeddingEvents.map((event) => renderCard(event, "wedding"))}
          {filteredPartyEvents.map((event) => renderCard(event, "party"))}
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
                    <span className="calendar-icon-left">
                      <IconCalendar />
                    </span>
                    <input
                      type="text"
                      name="date"
                      value={newWork.date}
                      onChange={handleCreateInputChange}
                      className="form-input with-icon-left"
                      placeholder="14/2/2568"
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

              <div className="form-group">
                <label>สถานะ</label>
                <div className="select-wrapper">
                  <select
                    name="status"
                    value={newWork.status}
                    onChange={handleCreateInputChange}
                    className="form-input form-select"
                  >
                    <option value="undetermined">กำลังจัดเตรียม</option>
                    <option value="inprogress">กำลังดำเนินการ</option>
                    <option value="completed">เสร็จสิ้น</option>
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
    </div>
  );
}
