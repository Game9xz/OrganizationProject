import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWorkContext } from "../context/useWorkContext";
import "./WorkStatus.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useLongdoMap } from "../hooks/useLongdoMap";
import LocationMap from "./LocationMap";

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

const LocationName = ({ location }) => {
  const [name, setName] = useState(location?.address || "กำลังโหลดตำแหน่ง..");
  const isMapReady = useLongdoMap('391bb8f4015c8ab179b4714d3f2942bb');

  useEffect(() => {
    if (typeof location === 'string') {
      setName(location);
      return;
    }

    if (location?.address) {
      setName(location.address);
      return;
    }

    if (!isMapReady || !location) {
      setName("-");
      return;
    }

    if (window.longdo && window.longdo.Geocoder) {
      if (typeof location === 'object' && location.lon && location.lat) {
        try {
          const longdo = window.longdo;
          new longdo.Geocoder().location({ lon: location.lon, lat: location.lat }, (result) => {
            if (result) {
              const subdistrict = result.subdistrict ? `${result.subdistrict}, ` : "";
              const district = result.district ? `${result.district}, ` : "";
              const province = result.province ? result.province : "";
              const road = result.road ? `${result.road}, ` : "";
              setName(`${road}${subdistrict}${district}${province}`.replace(/, $/, ''));
            }
          });
        } catch (e) {
          setName("พิกัดแผนที่");
        }
      } else {
        setName("-");
      }
    } else {
      setName("กำลังโหลดตำแหน่ง...");
    }
  }, [location, isMapReady]);

  return <span>{name}</span>;
};
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

export default function WorkStatus() {
  const navigate = useNavigate();
  const mapRef = React.useRef(null);
  const { events, updateEventStatus, addEvent } = useWorkContext();
  const [activeTab, setActiveTab] = useState("all");

  // Filters State
  const [locationFilter, setLocationFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newWork, setNewWork] = useState({
    title: "",
    category: "",
    location: { lon: 100.5383, lat: 13.7649, address: "" },
    room: "",
    date: "",
    budget: "",
    participants: "",
    status: "กำลังจัดเตรียม",
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

  const handleLocationChange = (location) => {
    setNewWork((prev) => ({ ...prev, location }));
  };

  const handleAddressChange = (e) => {
    const { value } = e.target;
    setNewWork((prev) => ({
      ...prev,
      location: {
        ...(prev.location || { lon: 100.5383, lat: 13.7649 }),
        address: value,
      },
    }));
  };

  const handleAddressSearch = () => {
    if (newWork.location?.address && mapRef.current) {
      mapRef.current.searchLocation(newWork.location.address);
    }
  };

  const allEvents = useMemo(() => {
    try {
      const combined = [...(events || [])];
      return combined.sort((a, b) => {
        const dateA = new Date(a.event_date || a.date || 0);
        const dateB = new Date(b.event_date || b.date || 0);
        return dateA - dateB;
      });
    } catch (e) {
      console.error("Error sorting events:", e);
      return events || [];
    }
  }, [events]);

  const uniqueLocations = useMemo(() => {
    try {
      const locations = allEvents
        .map(e => {
          if (typeof e.location === 'string') return e.location;
          return e.location?.address || "";
        })
        .filter(Boolean);
      return ["all", ...new Set(locations)];
    } catch (e) {
      return ["all"];
    }
  }, [allEvents]);

  const uniqueRooms = useMemo(() => {
    try {
      const rooms = allEvents.map(e => e.room).filter(Boolean);
      return ["all", ...new Set(rooms)];
    } catch (e) {
      return ["all"];
    }
  }, [allEvents]);

  // Stats Calculation
  const totalWorks = allEvents.length;
  const undeterminedCount = allEvents.filter(
    (e) => e.status === "ยังไม่ได้กำหนด",
  ).length;

  const overlappingCount = useMemo(() => {
    try {
      const dateMap = {};
      allEvents.forEach((e) => {
        const dateKey = (e.event_date || e.date) ? new Date(e.event_date || e.date).toDateString() : "";
        if (dateKey) dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
      });
      return Object.values(dateMap).filter((count) => count > 1).length;
    } catch (e) {
      return 0;
    }
  }, [allEvents]);

  const statusCounts = {
    all: totalWorks,
    "กำลังจัดเตรียม": allEvents.filter((e) => e.status === "กำลังจัดเตรียม").length,
    "กำลังดำเนินการ": allEvents.filter((e) => e.status === "กำลังดำเนินการ").length,
    "เสร็จสิ้น": allEvents.filter((e) => e.status === "เสร็จสิ้น").length,
    "ยังไม่ได้กำหนด": allEvents.filter((e) => e.status === "ยังไม่ได้กำหนด").length,
  };

  const filteredEvents = useMemo(() => {
    return allEvents.filter((e) => {
      const matchStatus = activeTab === "all" || e.status === activeTab;
      
      const eventLocation = e.location?.address || (typeof e.location === 'string' ? e.location : "");
      const matchLocation = locationFilter === "all" || eventLocation === locationFilter;
      
      const matchRoom = roomFilter === "all" || e.room === roomFilter;
      
      return matchStatus && matchLocation && matchRoom;
    });
  }, [allEvents, activeTab, locationFilter, roomFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "กำลังจัดเตรียม":
        return "status-preparing";
      case "กำลังดำเนินการ":
        return "status-inprogress";
      case "เสร็จสิ้น":
        return "status-completed";
      case "ยังไม่ได้กำหนด":
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
      location: { lon: 100.5383, lat: 13.7649, address: "" },
      room: "",
      date: "",
      budget: "",
      participants: "",
      status: "กำลังจัดเตรียม",
    });
    setSelectedDate(null);
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

  const handleSaveWork = async () => {
    if (!newWork.title || !newWork.category) {
      alert("กรุณากรอกชื่องานและประเภทงาน");
      return;
    }

    const eventPayload = {
      ...newWork,
      date: selectedDate ? selectedDate.toISOString().split("T")[0] : null,
    };

    await addEvent(eventPayload);
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
        <div className="brand-text">{user?.username}</div>
        <div className="brand-sub">{user?.email}</div>

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
          <Link to="/design3d" className="nav-item">
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
            className={`tab-btn ${activeTab === "กำลังจัดเตรียม" ? "active" : ""}`}
            onClick={() => setActiveTab("กำลังจัดเตรียม")}
          >
            กำลังจัดเตรียม ({statusCounts["กำลังจัดเตรียม"]})
          </button>
          <button
            className={`tab-btn ${activeTab === "กำลังดำเนินการ" ? "active" : ""}`}
            onClick={() => setActiveTab("กำลังดำเนินการ")}
          >
            กำลังดำเนินการ ({statusCounts["กำลังดำเนินการ"]})
          </button>
          <button
            className={`tab-btn ${activeTab === "เสร็จสิ้น" ? "active" : ""}`}
            onClick={() => setActiveTab("เสร็จสิ้น")}
          >
            เสร็จสิ้น ({statusCounts["เสร็จสิ้น"]})
          </button>
          <button
            className={`tab-btn ${activeTab === "ยังไม่ได้กำหนด" ? "active" : ""}`}
            onClick={() => setActiveTab("ยังไม่ได้กำหนด")}
          >
            ยังไม่ได้กำหนด ({statusCounts["ยังไม่ได้กำหนด"]})
          </button>
        </section>

        {/* Works Table */}
        <div className="works-table-container">
          <table className="works-table">
            <thead>
              <tr>
                <th>ชื่องาน</th>
                <th>วันที่</th>
                <th>
                  <div className="filter-dropdown-container">
                    <span>สถานที่</span>
                    <div style={{ position: "relative" }}>
                      <button 
                        className="filter-select-btn"
                        onClick={() => {
                          setIsLocationOpen(!isLocationOpen);
                          setIsRoomOpen(false);
                        }}
                      >
                        สถานที่ <IconChevronDown />
                      </button>
                      {isLocationOpen && (
                        <div className="filter-menu">
                          {uniqueLocations.map((loc) => (
                            <div
                              key={loc}
                              className={`filter-item ${locationFilter === loc ? "active" : ""}`}
                              onClick={() => {
                                setLocationFilter(loc);
                                setIsLocationOpen(false);
                              }}
                            >
                              {loc === "all" ? "ทั้งหมด" : loc}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </th>
                <th>
                  <div className="filter-dropdown-container">
                    <span>ห้อง</span>
                    <div style={{ position: "relative" }}>
                      <button 
                        className="filter-select-btn"
                        onClick={() => {
                          setIsRoomOpen(!isRoomOpen);
                          setIsLocationOpen(false);
                        }}
                      >
                        ห้อง <IconChevronDown />
                      </button>
                      {isRoomOpen && (
                        <div className="filter-menu">
                          {uniqueRooms.map((room) => (
                            <div
                              key={room}
                              className={`filter-item ${roomFilter === room ? "active" : ""}`}
                              onClick={() => {
                                setRoomFilter(room);
                                setIsRoomOpen(false);
                              }}
                            >
                              {room === "all" ? "ทั้งหมด" : room}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </th>
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
                  <td className="col-date">{formatEventDate(event.event_date || event.date)}</td>
                  <td className="col-location">
                    <LocationName location={event.location} />
                  </td>
                  <td className="col-room">
                    {event.room || "-"}
                  </td>
                  <td className="col-status">
                    <div className="status-dropdown-wrapper">
                      <select
                        className={`status-select ${getStatusColor(event.status)}`}
                        value={event.status}
                        onChange={(e) =>
                          updateEventStatus(event.id, e.target.value)
                        }
                      >
                        <option value="ยังไม่ได้กำหนด">ยังไม่ได้กำหนด</option>
                        <option value="กำลังจัดเตรียม">กำลังจัดเตรียม</option>
                        <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                        <option value="เสร็จสิ้น">เสร็จสิ้น</option>
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
                        navigate(`/workrecord/detail/${event.id}`);
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
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <LocationMap
                    ref={mapRef}
                    onLocationChange={handleLocationChange}
                    initialLocation={newWork.location}
                  />
                  <div className="address-input-wrapper" style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: "12px", color: "#6b7280" }}>📍</span>
                    <input
                      type="text"
                      placeholder="พิมพ์ชื่อสถานที่แล้วกด Enter เพื่อค้นหา"
                      value={newWork.location?.address || ""}
                      onChange={handleAddressChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddressSearch();
                        }
                      }}
                      className="form-input"
                      style={{ paddingLeft: "36px", fontSize: "14px" }}
                    />
                  </div>
                </div>
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
                    <option value="ยังไม่ได้กำหนด">ยังไม่ได้กำหนด</option>
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
