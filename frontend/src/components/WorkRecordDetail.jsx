import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './WorkRecordDetail.css';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const BASE_API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

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

// Helper: convert activities from DB to timeline slots
const activitiesToTimeline = (activities) => {
  const slots = [
    { time: '06.00 น.', items: [] },
    { time: '09.00 น.', items: [] },
    { time: '12.00 น.', items: [] },
    { time: '15.00 น.', items: [] },
    { time: '18.00 น.', items: [] },
  ];

  activities.forEach((act) => {
    const startTime = act.start_time || '';
    const endTime = act.end_time || '';
    const startHour = parseInt(startTime.split(':')[0], 10);

    let slotIndex = 0;
    if (startHour >= 6 && startHour < 9) slotIndex = 0;
    else if (startHour >= 9 && startHour < 12) slotIndex = 1;
    else if (startHour >= 12 && startHour < 15) slotIndex = 2;
    else if (startHour >= 15 && startHour < 18) slotIndex = 3;
    else if (startHour >= 18) slotIndex = 4;
    else slotIndex = 0;

    slots[slotIndex].items.push({
      id: act.id,
      title: act.title,
      timeRange: `เริ่มต้น ${startTime.substring(0, 5)} - ${endTime.substring(0, 5)} น.`,
      type: 'normal',
      details: act.description || '',
      start_time: startTime,
      end_time: endTime,
    });
  });

  // Sort items within each slot
  slots.forEach((slot) => {
    slot.items.sort((a, b) => {
      const timeA = a.timeRange.match(/(\d{2}:\d{2})/);
      const timeB = b.timeRange.match(/(\d{2}:\d{2})/);
      if (timeA && timeB) return timeA[1].localeCompare(timeB[1]);
      return 0;
    });
  });

  return slots;
};

export default function WorkRecordDetail() {
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  const [eventData, setEventData] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([
    { time: '06.00 น.', items: [] },
    { time: '09.00 น.', items: [] },
    { time: '12.00 น.', items: [] },
    { time: '15.00 น.', items: [] },
    { time: '18.00 น.', items: [] },
  ]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    let storedUser = localStorage.getItem("user");
    if (!storedUser) storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  // Fetch event data
  useEffect(() => {
    if (!eventId) return;
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${BASE_API}/events/${eventId}`);
        if (res.ok) {
          const data = await res.json();
          setEventData(data);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [eventId]);

  // Fetch activities
  const fetchActivities = async () => {
    if (!eventId) return;
    try {
      const res = await fetch(`${BASE_API}/activities/event/${eventId}`);
      if (res.ok) {
        const data = await res.json();
        const timeline = activitiesToTimeline(data);
        setTimelineEvents(updateEventTypesForOverlaps(timeline));
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [eventId]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: '',
    endTime: '',
    details: ''
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    activityId: null,
  });

  const [editModal, setEditModal] = useState({
    isOpen: false,
    activityId: null,
    data: {
      title: '',
      startTime: '',
      endTime: '',
      details: ''
    }
  });

  const [overlapModal, setOverlapModal] = useState({
    isOpen: false,
    overlappingEvents: []
  });

  // CREATE activity
  const handleSaveEvent = async () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      const payload = {
        event_id: Number(eventId),
        title: newEvent.title,
        description: newEvent.details || null,
        start_time: newEvent.startTime,
        end_time: newEvent.endTime,
      };

      const res = await fetch(`${BASE_API}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchActivities();
        setIsModalOpen(false);
        setNewEvent({ title: '', startTime: '', endTime: '', details: '' });
      } else {
        const data = await res.json();
        alert(data.message || 'ไม่สามารถสร้างกิจกรรมได้');
      }
    } catch (err) {
      console.error("Error creating activity:", err);
    }
  };

  // EDIT activity
  const handleEditClick = (slotIndex, itemIndex, item) => {
    let startTime = '';
    let endTime = '';
    try {
      const match = item.timeRange.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
      if (match) {
        startTime = match[1];
        endTime = match[2];
      }
    } catch (e) {
      console.error("Error parsing time for edit", e);
    }

    setEditModal({
      isOpen: true,
      activityId: item.id,
      data: {
        title: item.title,
        startTime,
        endTime,
        details: item.details || ''
      }
    });
  };

  const handleUpdateEvent = async () => {
    const { activityId, data } = editModal;
    if (!data.title || !data.startTime || !data.endTime) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      const payload = {
        title: data.title,
        description: data.details || null,
        start_time: data.startTime,
        end_time: data.endTime,
      };

      const res = await fetch(`${BASE_API}/activities/${activityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchActivities();
        setEditModal({
          isOpen: false,
          activityId: null,
          data: { title: '', startTime: '', endTime: '', details: '' }
        });
      }
    } catch (err) {
      console.error("Error updating activity:", err);
    }
  };

  // DELETE activity
  const handleDeleteClick = (slotIndex, itemIndex, item) => {
    setDeleteModal({
      isOpen: true,
      activityId: item.id,
    });
  };

  const confirmDelete = async () => {
    const { activityId } = deleteModal;
    if (!activityId) return;

    try {
      const res = await fetch(`${BASE_API}/activities/${activityId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchActivities();
      }
    } catch (err) {
      console.error("Error deleting activity:", err);
    }

    setDeleteModal({ isOpen: false, activityId: null });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, activityId: null });
  };

  // Duration & Overlap helpers
  const getEventDuration = (timeRange) => {
    try {
      const match = timeRange.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
      if (match) {
        const [_, start, end] = match;
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        const startMin = startH * 60 + startM;
        const endMin = endH * 60 + endM;
        let diff = endMin - startMin;
        if (diff < 0) diff += 24 * 60;
        return diff;
      }
    } catch (e) {
      console.error("Error parsing time range", e);
    }
    return 60;
  };

  const getOverlappingEvents = () => {
    const allEvents = [];
    timelineEvents.forEach((slot, slotIndex) => {
      slot.items.forEach((item, itemIndex) => {
        try {
          const match = item.timeRange.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
          if (match) {
            const [_, start, end] = match;
            const [startH, startM] = start.split(':').map(Number);
            const [endH, endM] = end.split(':').map(Number);
            const startMin = startH * 60 + startM;
            const endMin = endH * 60 + endM;
            let effectiveEndMin = endMin;
            if (endMin < startMin) effectiveEndMin += 24 * 60;
            allEvents.push({ slotIndex, itemIndex, startMin, endMin: effectiveEndMin, title: item.title, timeRange: item.timeRange });
          }
        } catch (e) { /* skip */ }
      });
    });

    const overlappingList = [];
    for (let i = 0; i < allEvents.length; i++) {
      for (let j = i + 1; j < allEvents.length; j++) {
        const ev1 = allEvents[i];
        const ev2 = allEvents[j];
        if (ev1.startMin < ev2.endMin && ev2.startMin < ev1.endMin) {
          overlappingList.push({ event1: ev1, event2: ev2 });
        }
      }
    }
    return overlappingList;
  };

  const handleOpenOverlapModal = () => {
    const overlaps = getOverlappingEvents();
    setOverlapModal({ isOpen: true, overlappingEvents: overlaps });
  };

  const updateEventTypesForOverlaps = (timeline) => {
    const allEvents = [];
    timeline.forEach((slot, slotIndex) => {
      slot.items.forEach((item, itemIndex) => {
        try {
          const match = item.timeRange.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
          if (match) {
            const [_, start, end] = match;
            const [startH, startM] = start.split(':').map(Number);
            const [endH, endM] = end.split(':').map(Number);
            const startMin = startH * 60 + startM;
            const endMin = endH * 60 + endM;
            let effectiveEndMin = endMin;
            if (endMin < startMin) effectiveEndMin += 24 * 60;
            allEvents.push({ slotIndex, itemIndex, startMin, endMin: effectiveEndMin });
          }
        } catch (e) { /* skip */ }
      });
    });

    const overlappingIndices = new Set();
    for (let i = 0; i < allEvents.length; i++) {
      for (let j = i + 1; j < allEvents.length; j++) {
        const ev1 = allEvents[i];
        const ev2 = allEvents[j];
        if (ev1.startMin < ev2.endMin && ev2.startMin < ev1.endMin) {
          overlappingIndices.add(`${ev1.slotIndex}-${ev1.itemIndex}`);
          overlappingIndices.add(`${ev2.slotIndex}-${ev2.itemIndex}`);
        }
      }
    }

    return timeline.map((slot, sIdx) => ({
      ...slot,
      items: slot.items.map((item, iIdx) => {
        const isOverlapping = overlappingIndices.has(`${sIdx}-${iIdx}`);
        return { ...item, type: isOverlapping ? 'warning' : 'normal' };
      })
    }));
  };

  const eventTitle = eventData?.title || 'กำลังโหลด...';
  const eventDate = formatEventDate(eventData?.event_date);
  const eventLocation = eventData?.location || '';

  return (
    <div className="layout dark-layout">
      <aside className="sidebar dark-sidebar">
        <div className="sb-header">
          <div className="brand-logo" aria-label="logo">
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
          <div className="avatar">{user?.username}</div>
          <div className="sb-email">{user?.email}</div>
        </div>
        <nav className="sb-menu">
          <Link to="/workrecord" className="sb-item">← ย้อนกลับ</Link>
          <Link to="/homepage" className="sb-item">หน้าแรก</Link>
          <Link to="/workrecord" className="sb-item active">บันทึกงาน</Link>
          <Link to="/workrecord/status" className="sb-item">สถานะงาน</Link>
          <Link to="#" className="sb-item">ออกแบบ</Link>
          <Link to="/inventory" className="sb-item">คลัง</Link>
          <Link to="/inventory/status" className="sb-item">สถานะคลัง</Link>
          <Link to="/budget" className="sb-item">งบประมาณ</Link>
        </nav>

        <button className="logout-btn-red" onClick={logout}>
          Log out
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </aside>

      <main className="content dark-content">
        <header className="record-header">
          <div>
            <h1 className="page-title">บันทึกงานวันนี้</h1>
            <div className="page-subtitle">{eventDate}</div>
            <div className="event-name">{eventTitle}</div>
            {eventLocation && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>📍 {eventLocation}</div>}
          </div>
          <button className="create-btn" onClick={() => setIsModalOpen(true)}>+ สร้างกิจกรรมใหม่</button>
        </header>

        <section className="stats-row">
          <div className="stat-pill grey">
            จำนวนกิจกรรมทั้งหมด : {timelineEvents.reduce((sum, slot) => sum + slot.items.length, 0)}
          </div>
          <div className="stat-pill grey">จำนวนงานที่ยังไม่ได้กำหนด : 0</div>
          <button
            className="stat-pill red"
            onClick={handleOpenOverlapModal}
            style={{ cursor: 'pointer', border: 'none', fontSize: '14px' }}
          >
            จำนวนงานที่ซ้อนกัน : {getOverlappingEvents().length}
          </button>
        </section>

        <section className="filters-row">
          <button className="filter-btn blue">สถานที่</button>
          <button className="filter-btn purple">ห้อง</button>
          <button className="filter-btn orange">ประเภท</button>
          <div className="search-wrapper">
            <input className="search-input" placeholder="ค้นหากิจกรรม" />
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </section>

        <section className="timeline-section">
          {timelineEvents.map((slot, index) => (
            <div key={index} className="timeline-row">
              <div className="time-label">{slot.time}</div>
              <div className="timeline-events">
                {slot.items.map((item, idx) => {
                  const duration = getEventDuration(item.timeRange);
                  const width = Math.max(200, duration * 4);

                  return (
                    <div
                      key={item.id || idx}
                      className={`event-card ${item.type}`}
                      style={{ minWidth: `${width}px`, flexBasis: `${width}px`, flexGrow: 0, flexShrink: 0, cursor: 'pointer' }}
                      onClick={() => handleEditClick(index, idx, item)}
                    >
                      <button
                        className="delete-card-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(index, idx, item);
                        }}
                        title="ลบกิจกรรม"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                      {item.type === 'warning' && (
                        <div className="warning-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                        </div>
                      )}
                      <div className="event-info">
                        <div className="event-title">{item.title}</div>
                        <div className="event-time">{item.timeRange}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Create Event Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">สร้างกิจกรรมใหม่</h2>

              <div className="modal-form-group">
                <label>ชื่อกิจกรรม</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="ใส่ชื่อกิจกรรม"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>

              <div className="modal-row">
                <div className="modal-form-group">
                  <label>เวลาเริ่มต้น</label>
                  <input
                    type="time"
                    className="modal-input time-input"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  />
                </div>
                <div className="modal-form-group">
                  <label>เวลาสิ้นสุด</label>
                  <input
                    type="time"
                    className="modal-input time-input"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-form-group">
                <label>รายละเอียด</label>
                <textarea
                  className="modal-textarea"
                  placeholder="ใส่รายละเอียด"
                  rows="4"
                  value={newEvent.details}
                  onChange={(e) => setNewEvent({ ...newEvent, details: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button className="btn-save" onClick={handleSaveEvent}>บันทึก</button>
                <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>ยกเลิก</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ textAlign: 'center', width: '400px' }}>
              <h2 className="modal-title">ยืนยันการลบ?</h2>
              <p style={{ color: '#d1d5db', marginBottom: '32px', fontSize: '16px' }}>
                คุณต้องการลบกิจกรรมนี้ใช่หรือไม่
              </p>
              <div className="modal-actions">
                <button className="btn-confirm-delete" onClick={confirmDelete}>ลบ</button>
                <button className="btn-cancel-grey" onClick={cancelDelete}>ยกเลิก</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Event Modal */}
        {editModal.isOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">แก้ไขกิจกรรม</h2>

              <div className="modal-form-group">
                <label>ชื่อกิจกรรม</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="ใส่ชื่อกิจกรรม"
                  value={editModal.data.title}
                  onChange={(e) => setEditModal({
                    ...editModal,
                    data: { ...editModal.data, title: e.target.value }
                  })}
                />
              </div>

              <div className="modal-row">
                <div className="modal-form-group">
                  <label>เวลาเริ่มต้น</label>
                  <input
                    type="time"
                    className="modal-input time-input"
                    value={editModal.data.startTime}
                    onChange={(e) => setEditModal({
                      ...editModal,
                      data: { ...editModal.data, startTime: e.target.value }
                    })}
                  />
                </div>
                <div className="modal-form-group">
                  <label>เวลาสิ้นสุด</label>
                  <input
                    type="time"
                    className="modal-input time-input"
                    value={editModal.data.endTime}
                    onChange={(e) => setEditModal({
                      ...editModal,
                      data: { ...editModal.data, endTime: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="modal-form-group">
                <label>รายละเอียด</label>
                <textarea
                  className="modal-textarea"
                  placeholder="ใส่รายละเอียด"
                  rows="4"
                  value={editModal.data.details}
                  onChange={(e) => setEditModal({
                    ...editModal,
                    data: { ...editModal.data, details: e.target.value }
                  })}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button className="btn-save" onClick={handleUpdateEvent}>บันทึก</button>
                <button className="btn-cancel" onClick={() => setEditModal({ ...editModal, isOpen: false })}>ยกเลิก</button>
              </div>
            </div>
          </div>
        )}

        {/* Overlap Events Modal */}
        {overlapModal.isOpen && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
              <h2 className="modal-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', display: 'inline' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                กิจกรรมที่ซ้อนกัน ({overlapModal.overlappingEvents.length})
              </h2>

              {overlapModal.overlappingEvents.length === 0 ? (
                <p style={{ color: '#d1d5db', fontSize: '16px', textAlign: 'center', padding: '24px' }}>
                  ไม่มีกิจกรรมที่ซ้อนกัน
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto' }}>
                  {overlapModal.overlappingEvents.map((overlap, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '16px',
                      backgroundColor: '#1a1a1a',
                      borderRadius: '8px',
                      border: '1px solid #4b5563'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ marginTop: '2px', flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '8px' }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                              {overlap.event1.title}
                            </div>
                            <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>
                              {overlap.event1.timeRange}
                            </div>
                          </div>
                          <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '500' }}>ซ้อนกับ</span>
                        </div>
                        <div style={{ paddingTop: '8px', borderTop: '1px solid #4b5563' }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                            {overlap.event2.title}
                          </div>
                          <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                            {overlap.event2.timeRange}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button
                  className="btn-cancel"
                  onClick={() => setOverlapModal({ isOpen: false, overlappingEvents: [] })}
                  style={{ width: '100%' }}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
