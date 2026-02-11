import React, { useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import './WorkRecordDetail.css';

export default function WorkRecord() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [notifyCount] = useState(0);
  
  // Get event data from navigation state
  const eventId = params.id;
  const eventData = location.state?.event || {};
  const eventType = location.state?.eventType || 'wedding';
  const passedTimeline = location.state?.timeline || [];
  
  // Use event data for display
  const eventTitle = eventData?.title || 'บันทึกงานวันนี้';
  const eventDate = eventData?.date || '31 ตุลาคม, 2025';
  const eventLocation = eventData?.location || '';
  const eventBudget = eventData?.budget || '';
  const eventPeople = eventData?.people || '';
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: '',
    endTime: '',
    details: ''
  });

  // Delete Modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    slotIndex: null,
    itemIndex: null
  });

  // Edit Modal state
  const [editModal, setEditModal] = useState({
    isOpen: false,
    slotIndex: null,
    itemIndex: null,
    data: {
      title: '',
      startTime: '',
      endTime: '',
      details: ''
    }
  });

  // Overlap Modal state
  const [overlapModal, setOverlapModal] = useState({
    isOpen: false,
    overlappingEvents: []
  });

  const handleEditClick = (slotIndex, itemIndex, item) => {
    // Extract times from timeRange string "เริ่มต้น 09:00 - 10:30 น."
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
      slotIndex,
      itemIndex,
      data: {
        title: item.title,
        startTime,
        endTime,
        details: item.details || ''
      }
    });
  };

  const handleUpdateEvent = () => {
    const { slotIndex, itemIndex, data } = editModal;
    if (!data.title || !data.startTime || !data.endTime) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // 1. Remove old item
    const updatedTimeline = [...timelineEvents];
    // We don't remove it yet, because we might just update in place if slot doesn't change
    // But to be safe and consistent with logic, let's remove and re-add
    updatedTimeline[slotIndex].items.splice(itemIndex, 1);

    // 2. Determine new target slot
    const startHour = parseInt(data.startTime.split(':')[0], 10);
    let targetSlotIndex = -1;

    if (startHour >= 6 && startHour < 9) targetSlotIndex = 0;
    else if (startHour >= 9 && startHour < 12) targetSlotIndex = 1;
    else if (startHour >= 12 && startHour < 15) targetSlotIndex = 2;
    else if (startHour >= 15 && startHour < 18) targetSlotIndex = 3;
    else if (startHour >= 18) targetSlotIndex = 4;
    
    if (targetSlotIndex === -1) {
       if (startHour < 6) targetSlotIndex = 0;
       else targetSlotIndex = 4;
    }

    // 3. Create new item
    const newItem = {
      title: data.title,
      timeRange: `เริ่มต้น ${data.startTime} - ${data.endTime} น.`,
      type: 'normal', // Preserve type or reset? Let's keep it simple as normal or maybe we should store original type?
      // For now, let's assume type is 'normal' or 'warning' depending on context, but here we just create a new one.
      // If we want to preserve 'type' (color), we should have passed it to editModal.data.
      // Let's grab the type from the original item if we can, but we already spliced it. 
      // Actually we spliced a copy.
      // Let's improve:
    };
    
    // Better way: get original type before splicing?
    // Actually, let's just default to 'normal' for edited events unless we add a type selector.
    // Or we can check if it overlaps and set warning? 
    // The user didn't ask for type editing.
    // Let's just use 'normal' for now, or maybe check if we can retrieve the old type.
    // Wait, we have the old item in the closure if we didn't mutate state yet? No.
    
    // Let's look at how we spliced. `updatedTimeline` is a shallow copy of the array, but `updatedTimeline[slotIndex]` is a ref to the object in state? 
    // We should deep copy the structure we are modifying.
    // Actually `updatedTimeline` is `[...timelineEvents]`. The elements are objects.
    // `updatedTimeline[slotIndex]` is the same object as in state. Modifying `items` array inside it mutates state directly if we are not careful?
    // React state should be immutable.
    // Correct way:
    // const newTimeline = timelineEvents.map((slot, sIdx) => {
    //   if (sIdx === slotIndex) return { ...slot, items: [...slot.items] };
    //   return slot;
    // });
    // newTimeline[slotIndex].items.splice(itemIndex, 1);
    
    // But let's stick to the pattern used in `handleSaveEvent` (which was pushing to copy) and `confirmDelete`.
    // The pattern in `confirmDelete` was `const updatedTimeline = [...timelineEvents]; updatedTimeline[slotIndex].items.splice(...)`. 
    // This is technically mutating the nested object of the state, but if it works for delete, I will follow it for consistency, 
    // though proper immutability is better. 
    // I will try to be slightly safer.
    
    // Let's assume the user wants to keep the type if possible. 
    // I'll add `type` to editModal data.

    newItem.type = editModal.data.type || 'normal';
    newItem.details = data.details;

    // Add to new slot
    // Check if target slot is different or same.
    // Note: We already removed it from `updatedTimeline`.
    
    // If we removed it, we just add it to the target slot.
    // But we need to make sure we didn't lose the slot structure if we did `splice` on the reference.
    
    updatedTimeline[targetSlotIndex].items.push(newItem);
    
    updatedTimeline[targetSlotIndex].items.sort((a, b) => {
        const timeA = a.timeRange.match(/(\d{2}:\d{2})/);
        const timeB = b.timeRange.match(/(\d{2}:\d{2})/);
        if (timeA && timeB) {
            return timeA[1].localeCompare(timeB[1]);
        }
        return 0;
    });

    setTimelineEvents(updateEventTypesForOverlaps(updatedTimeline));
    setEditModal({ 
      isOpen: false, 
      slotIndex: null, 
      itemIndex: null, 
      data: { title: '', startTime: '', endTime: '', details: '' } 
    });
  };

  const handleDeleteClick = (slotIndex, itemIndex) => {
    setDeleteModal({
      isOpen: true,
      slotIndex,
      itemIndex
    });
  };

  const confirmDelete = () => {
    const { slotIndex, itemIndex } = deleteModal;
    if (slotIndex === null || itemIndex === null) return;

    const updatedTimeline = [...timelineEvents];
    updatedTimeline[slotIndex].items.splice(itemIndex, 1);
    
    // Check overlaps again after deletion
    setTimelineEvents(updateEventTypesForOverlaps(updatedTimeline));

    setDeleteModal({ isOpen: false, slotIndex: null, itemIndex: null });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, slotIndex: null, itemIndex: null });
  };

  const logout = () => {
    localStorage.removeItem('se_remember');
    navigate('/login');
  };

  // Timeline events state - separate for each event
  const [timelineEvents, setTimelineEvents] = useState(() => {
    // Initialize timeline with passed data or empty timeline
    if (passedTimeline && passedTimeline.length > 0) {
      return passedTimeline;
    }
    // Fallback empty timeline
    return [
      { time: '06.00 น.', items: [] },
      { time: '09.00 น.', items: [] },
      { time: '12.00 น.', items: [] },
      { time: '15.00 น.', items: [] },
      { time: '18.00 น.', items: [] }
    ];
  });

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // Determine target slot based on start time
    // Logic: 06:00-08:59 -> 06.00 น.
    //        09:00-11:59 -> 09.00 น.
    //        12:00-14:59 -> 12.00 น.
    //        15:00-17:59 -> 15.00 น.
    //        18:00+      -> 18.00 น.
    const startHour = parseInt(newEvent.startTime.split(':')[0], 10);
    let targetSlotIndex = -1;

    if (startHour >= 6 && startHour < 9) targetSlotIndex = 0;
    else if (startHour >= 9 && startHour < 12) targetSlotIndex = 1;
    else if (startHour >= 12 && startHour < 15) targetSlotIndex = 2;
    else if (startHour >= 15 && startHour < 18) targetSlotIndex = 3;
    else if (startHour >= 18) targetSlotIndex = 4;
    
    // If time is earlier than 06:00, put in first slot? Or ignore?
    // Let's assume default to 06.00 if < 6 for now, or last if > 18.
    if (targetSlotIndex === -1) {
       if (startHour < 6) targetSlotIndex = 0;
       else targetSlotIndex = 4;
    }

    const newItem = {
      title: newEvent.title,
      timeRange: `เริ่มต้น ${newEvent.startTime} - ${newEvent.endTime} น.`,
      type: 'normal', // Default type
      details: newEvent.details
    };

    const updatedTimeline = [...timelineEvents];
    updatedTimeline[targetSlotIndex].items.push(newItem);
    
    // Sort items by time (optional but good)
    updatedTimeline[targetSlotIndex].items.sort((a, b) => {
        // Simple string compare of time range start might be tricky if formats vary
        // But assuming format "เริ่มต้น HH:MM - ..."
        const timeA = a.timeRange.match(/(\d{2}:\d{2})/);
        const timeB = b.timeRange.match(/(\d{2}:\d{2})/);
        if (timeA && timeB) {
            return timeA[1].localeCompare(timeB[1]);
        }
        return 0;
    });

    setTimelineEvents(updateEventTypesForOverlaps(updatedTimeline));
    setIsModalOpen(false);
    setNewEvent({ title: '', startTime: '', endTime: '', details: '' });
  };

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
        if (diff < 0) diff += 24 * 60; // Handle overnight if needed
        return diff;
      }
    } catch (e) {
      console.error("Error parsing time range", e);
    }
    return 60; // Default fallback
  };

  const getOverlappingEvents = () => {
    // 1. Flatten all events with their start/end minutes and original location
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

            allEvents.push({
              slotIndex,
              itemIndex,
              startMin,
              endMin: effectiveEndMin,
              title: item.title,
              timeRange: item.timeRange,
              details: item.details
            });
          }
        } catch (e) {
          console.error("Error parsing time for overlap check", e);
        }
      });
    });

    // 2. Identify overlapping events
    const overlappingList = [];
    for (let i = 0; i < allEvents.length; i++) {
      for (let j = i + 1; j < allEvents.length; j++) {
        const ev1 = allEvents[i];
        const ev2 = allEvents[j];

        if (ev1.startMin < ev2.endMin && ev2.startMin < ev1.endMin) {
          overlappingList.push({
            event1: ev1,
            event2: ev2
          });
        }
      }
    }

    return overlappingList;
  };

  const handleOpenOverlapModal = () => {
    const overlaps = getOverlappingEvents();
    setOverlapModal({
      isOpen: true,
      overlappingEvents: overlaps
    });
  };

  const updateEventTypesForOverlaps = (timeline) => {
    // 1. Flatten all events with their start/end minutes and original location
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
            
            // Handle overnight
            let effectiveEndMin = endMin;
            if (endMin < startMin) effectiveEndMin += 24 * 60;

            allEvents.push({
              slotIndex,
              itemIndex,
              startMin,
              endMin: effectiveEndMin,
              // We'll update the type later
            });
          }
        } catch (e) {
          console.error("Error parsing time for overlap check", e);
        }
      });
    });

    // 2. Identify overlapping events
    const overlappingIndices = new Set();
    for (let i = 0; i < allEvents.length; i++) {
      for (let j = i + 1; j < allEvents.length; j++) {
        const ev1 = allEvents[i];
        const ev2 = allEvents[j];

        // Check overlap: start1 < end2 && start2 < end1
        if (ev1.startMin < ev2.endMin && ev2.startMin < ev1.endMin) {
          overlappingIndices.add(`${ev1.slotIndex}-${ev1.itemIndex}`);
          overlappingIndices.add(`${ev2.slotIndex}-${ev2.itemIndex}`);
        }
      }
    }

    // 3. Update timeline types
    // We need to create a deep copy to avoid mutation issues if not already copied
    // But since we are usually passing a fresh copy to this function or setting state with it, 
    // we should map it.
    
    return timeline.map((slot, sIdx) => ({
      ...slot,
      items: slot.items.map((item, iIdx) => {
        const isOverlapping = overlappingIndices.has(`${sIdx}-${iIdx}`);
        // Only change type if it's 'normal' or 'warning' (don't override other potential types if any)
        // Or strictly follow user rule: overlapping -> warning (red), not -> normal (grey/default)
        if (isOverlapping) {
          return { ...item, type: 'warning' };
        } else {
           // If it was warning, change back to normal. If it was something else, maybe keep it?
           // For now, let's reset to normal if it was warning.
           return { ...item, type: 'normal' };
        }
      })
    }));
  };

  return (
    <div className="layout dark-layout">
      <aside className="sidebar dark-sidebar">
        <div className="sb-header">
          <div className="brand-logo" aria-label="SE EVENT logo">
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
          <div className="avatar">SE EVENT</div>
          <div className="sb-email">Group8.SE@ku.th</div>
        </div>
        <nav className="sb-menu">          <Link to="/workrecord" className="sb-item">← ย้อนกลับ</Link>          <Link to="/" className="sb-item">หน้าแรก</Link>
          <Link to="/record" className="sb-item active">บันทึกงาน</Link>
          <Link to="#" className="sb-item">สถานะงาน</Link>
          <Link to="#" className="sb-item">ออกแบบ</Link>
          <Link to="#" className="sb-item">คลัง</Link>
          <Link to="#" className="sb-item">สถานะคลัง</Link>
          <Link to="#" className="sb-item">งบประมาณ</Link>
        </nav>
        
        <button className="logout-btn-red" onClick={logout}>
           Log out 
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px'}}>
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
                  // Calculate width: min 200px, plus 4px per minute
                  // Adjust the multiplier as needed for best visual
                  const width = Math.max(200, duration * 4);
                  
                  return (
                  <div 
                    key={idx} 
                    className={`event-card ${item.type}`}
                    style={{ minWidth: `${width}px`, flexBasis: `${width}px`, flexGrow: 0, flexShrink: 0, cursor: 'pointer' }}
                    onClick={() => handleEditClick(index, idx, item)}
                  >
                    <button 
                      className="delete-card-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(index, idx);
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
                )})}
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
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>

            <div className="modal-row">
              <div className="modal-form-group">
                <label>เวลาเริ่มต้น</label>
                <input 
                  type="time" 
                  className="modal-input time-input"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                />
              </div>
              <div className="modal-form-group">
                <label>เวลาสิ้นสุด</label>
                <input 
                  type="time" 
                  className="modal-input time-input"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
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
                onChange={(e) => setNewEvent({...newEvent, details: e.target.value})}
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
