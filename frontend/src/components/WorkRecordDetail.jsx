import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import './WorkRecordDetail.css';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const BASE_API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Helper: format date for display
const formatEventDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    // Check if it's already a Buddhist year string like "2568-01-01"
    const parts = String(dateStr).split('-');
    let dateObj;
    if (parts.length === 3 && parseInt(parts[0]) > 2400) {
      // It's likely a Buddhist year, convert to AD for JS Date
      dateObj = new Date(parseInt(parts[0]) - 543, parseInt(parts[1]) - 1, parseInt(parts[2]));
    } else {
      dateObj = new Date(dateStr);
    }

    if (isNaN(dateObj.getTime())) return String(dateStr);
    
    const year = dateObj.getFullYear() + 543;
    const dayMonth = format(dateObj, "d MMMM", { locale: th });
    return `${dayMonth} ${year}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return String(dateStr);
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

  if (!Array.isArray(activities)) return slots;

  activities.forEach((act) => {
    if (!act) return;
    const startTime = String(act.start_time || '');
    const endTime = String(act.end_time || '');
    const startHour = parseInt(startTime.split(':')[0], 10);

    let slotIndex = 0;
    if (isNaN(startHour)) slotIndex = 0;
    else if (startHour >= 6 && startHour < 9) slotIndex = 0;
    else if (startHour >= 9 && startHour < 12) slotIndex = 1;
    else if (startHour >= 12 && startHour < 15) slotIndex = 2;
    else if (startHour >= 15 && startHour < 18) slotIndex = 3;
    else if (startHour >= 18) slotIndex = 4;
    else slotIndex = 0;

    slots[slotIndex].items.push({
      id: act.id,
      title: act.title || 'กิจกรรมไม่มีชื่อ',
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
  const location = useLocation();
  const { id: eventId } = useParams();

  const [eventData, setEventData] = useState(location.state?.event || null);
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

  const [activities, setActivities] = useState([]);

  // Helper: get storage key for activities
  const getStorageKey = (id) => `activities_event_${id}`;

  const fetchActivities = async (currentEventData) => {
    if (!eventId) return;
    
    const storageKey = getStorageKey(eventId);
    const savedMockData = localStorage.getItem(storageKey);

    try {
      // res might be undefined if fetch fails, wrap in try-catch properly
      let data = [];
      try {
        const res = await fetch(`${BASE_API}/activities/event/${eventId}`);
        if (res && res.ok) {
          data = await res.json();
        }
      } catch (e) {
        console.warn("API fetch activities failed, using local/mock data");
      }
      
      const targetTitle = (currentEventData?.title || eventData?.title || "").replace(/\s+/g, ' ');
      const targetCategory = currentEventData?.category || eventData?.category || "";
      
      // Force refresh logic or use saved data
      if (savedMockData) {
        data = JSON.parse(savedMockData);
      } else if (!data || data.length <= 0) {
        // Mock data logic
        if (targetCategory === "งานแต่ง" || targetTitle.includes("งานแต่ง") || targetTitle.includes("คุณ")) {
          // ... (existing mock data)
          data = [
            { id: 201, title: "พิธีเช้าตักบาตร", start_time: "07:30:00", end_time: "08:00:00", description: "" },
            { id: 202, title: "พิธีทำบุญ", start_time: "08:00:00", end_time: "09:00:00", description: "" },
            { id: 203, title: "พิธีแห่ขันหมาก", start_time: "09:00:00", end_time: "10:30:00", description: "" },
            { id: 204, title: "พิธีการสู่ขอ และนับสินสอด", start_time: "10:30:00", end_time: "11:00:00", description: "" },
            { id: 205, title: "พิธีหลั่งน้ำพระพุทธมนต์", start_time: "11:30:00", end_time: "12:00:00", description: "" },
            { id: 206, title: "พักผ่อน", start_time: "12:00:00", end_time: "13:00:00", description: "" },
            { id: 207, title: "รับประทานอาหาร (โต๊ะจีน)", start_time: "13:00:00", end_time: "16:30:00", description: "" },
            { id: 208, title: "พิธีตัดเค้ก และ โยนช่อดอกไม้", start_time: "16:30:00", end_time: "20:00:00", description: "" },
          ];
        } else if (targetCategory === "สัมมนา" || targetTitle.includes("สัมมนา") || targetTitle.includes("ประชุม")) {
          data = [
            { id: 401, title: "ลงทะเบียนและรับประทานอาหารว่าง", start_time: "08:00:00", end_time: "09:00:00", description: "" },
            { id: 402, title: "พิธีเปิดงานและกล่าวต้อนรับ", start_time: "09:00:00", end_time: "09:30:00", description: "" },
            { id: 403, title: "บรรยายพิเศษช่วงเช้า", start_time: "09:30:00", end_time: "12:00:00", description: "" },
            { id: 404, title: "พักรับประทานอาหารกลางวัน", start_time: "12:00:00", end_time: "13:00:00", description: "" },
            { id: 405, title: "Workshop / เสวนา", start_time: "13:00:00", end_time: "16:00:00", description: "" },
            { id: 406, title: "สรุปผลและปิดงาน", start_time: "16:00:00", end_time: "16:30:00", description: "" },
          ];
        } else if (targetCategory === "ปาร์ตี้" || targetTitle.includes("งานวันเกิด") || targetTitle.includes("เลี้ยง")) {
          data = [
            { id: 501, title: "เตรียมสถานที่และของว่าง", start_time: "15:00:00", end_time: "17:00:00", description: "" },
            { id: 502, title: "ต้อนรับแขกและถ่ายรูป", start_time: "18:00:00", end_time: "19:00:00", description: "" },
            { id: 503, title: "รับประทานอาหารและกิจกรรมหลัก", start_time: "19:00:00", end_time: "21:00:00", description: "" },
            { id: 504, title: "พิธีการสำคัญ (เป่าเค้ก/มอบรางวัล)", start_time: "21:00:00", end_time: "22:00:00", description: "" },
            { id: 505, title: "After Party", start_time: "22:00:00", end_time: "23:59:00", description: "" },
          ];
        } else {
          data = [
            { id: 601, title: "เริ่มเตรียมงาน", start_time: "08:00:00", end_time: "10:00:00", description: "" },
            { id: 602, title: "ดำเนินกิจกรรมหลัก", start_time: "10:00:00", end_time: "12:00:00", description: "" },
            { id: 603, title: "พักเบรค", start_time: "12:00:00", end_time: "13:00:00", description: "" },
            { id: 604, title: "ดำเนินกิจกรรมช่วงบ่าย", start_time: "13:00:00", end_time: "16:00:00", description: "" },
            { id: 605, title: "สรุปผลและปิดงาน", start_time: "16:00:00", end_time: "17:00:00", description: "" },
          ];
        }
        localStorage.setItem(storageKey, JSON.stringify(data));
      }

      setActivities(data || []);
      const timeline = activitiesToTimeline(data || []);
      setTimelineEvents(updateEventTypesForOverlaps(timeline));
      setUndeterminedCount((data || []).filter(act => !act.start_time || !act.end_time).length);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setActivities([]);
    }
  };

  useEffect(() => {
    const timeline = activitiesToTimeline(activities);
    setTimelineEvents(updateEventTypesForOverlaps(timeline));
  }, [activities]);

  // Fetch event data
  useEffect(() => {
    if (!eventId) return;
    
    // Clear current activities state before fetching new ones
    setActivities([]);
    // Only clear event data if we didn't get it from location state
    if (!location.state?.event) {
      setEventData(null);
    }

    const fetchEvent = async () => {
      try {
        const res = await fetch(`${BASE_API}/events/${eventId}`);
        if (res.ok) {
          const data = await res.json();
          setEventData(data);
          // Fetch activities right after we have event data to ensure mock logic works
          fetchActivities(data);
        } else {
          // If we already have data from location.state, just fetch activities for it
          if (location.state?.event) {
            fetchActivities(location.state.event);
            return;
          }

          // Fallback for UI testing if API fails
          let mockTitle = "งานแต่งคุณกาญจนา";
          let mockDate = "2025-10-31";
          
          // Detect event based on ID from the list (Mocking logic)
          // Based on the order in the image provided by user
          if (eventId === '2') {
            mockTitle = "งานแต่ง คุณเอ & คุณบี";
            mockDate = "2568-02-14";
          } else if (eventId === '3') {
            mockTitle = "งานแต่ง คุณเจ้านาย";
            mockDate = "2568-01-30";
          } else if (eventId === '4') {
            mockTitle = "งานแต่ง คุณเจได";
            mockDate = "2568-02-28";
          } else if (eventId === '5') {
            mockTitle = "งานวันเกิดสุดพิเศษ";
            mockDate = "2568-01-05";
          } else if (eventId === '6') {
            mockTitle = "สัมมนาผู้นำองค์กร 2024";
            mockDate = "2568-01-20";
          }

          const mockEvent = { title: mockTitle, event_date: mockDate, location: "สถานที่จัดงาน" };
          setEventData(mockEvent);
          fetchActivities(mockEvent);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        // If we already have data from location.state, just fetch activities for it
        if (location.state?.event) {
          fetchActivities(location.state.event);
          return;
        }

        // Fallback for UI testing
        let mockTitle = "งานแต่งคุณกาญจนา";
        if (eventId === '2') mockTitle = "งานแต่ง คุณเอ & คุณบี";
        else if (eventId === '3') mockTitle = "งานแต่ง คุณเจ้านาย";
        else if (eventId === '4') mockTitle = "งานแต่ง คุณเจได";
        else if (eventId === '5') mockTitle = "งานวันเกิดสุดพิเศษ";
        else if (eventId === '6') mockTitle = "สัมมนาผู้นำองค์กร 2024";

        const mockEvent = { title: mockTitle, event_date: "2025-10-31", location: "สถานที่จัดงาน" };
        setEventData(mockEvent);
        fetchActivities(mockEvent);
      }
    };
    fetchEvent();
  }, [eventId, location.state]);

  const [undeterminedCount, setUndeterminedCount] = useState(0);

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
        // Fallback for mock data or API error
        const mockNewActivity = {
          id: Date.now(), // Unique ID for mock
          title: newEvent.title,
          start_time: newEvent.startTime,
          end_time: newEvent.endTime,
          description: newEvent.details || ''
        };
        const updatedActivities = [...activities, mockNewActivity];
        setActivities(updatedActivities);
        localStorage.setItem(getStorageKey(eventId), JSON.stringify(updatedActivities));
        setIsModalOpen(false);
        setNewEvent({ title: '', startTime: '', endTime: '', details: '' });
      }
    } catch (err) {
      console.error("Error creating activity:", err);
      // Fallback for UI testing
      const mockNewActivity = {
        id: Date.now(),
        title: newEvent.title,
        start_time: newEvent.startTime,
        end_time: newEvent.endTime,
        description: newEvent.details || ''
      };
      const updatedActivities = [...activities, mockNewActivity];
      setActivities(updatedActivities);
      localStorage.setItem(getStorageKey(eventId), JSON.stringify(updatedActivities));
      setIsModalOpen(false);
      setNewEvent({ title: '', startTime: '', endTime: '', details: '' });
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

      // Check if it's a mock ID (starts with 2xx or is a timestamp)
      if (String(activityId).startsWith('2') || activityId > 1000000000000) {
        // Update mock data in state
        const updatedActivities = activities.map(act => 
          act.id === activityId 
            ? { ...act, title: data.title, start_time: data.startTime, end_time: data.endTime, description: data.details }
            : act
        );
        setActivities(updatedActivities);
        localStorage.setItem(getStorageKey(eventId), JSON.stringify(updatedActivities));
        
        setEditModal({
          isOpen: false,
          activityId: null,
          data: { title: '', startTime: '', endTime: '', details: '' }
        });
        return;
      }

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
      // Fallback: update state anyway for UI responsiveness
      setActivities(prev => prev.map(act => 
        act.id === activityId 
          ? { ...act, title: data.title, start_time: data.startTime, end_time: data.endTime, description: data.details }
          : act
      ));
      setEditModal({
        isOpen: false,
        activityId: null,
        data: { title: '', startTime: '', endTime: '', details: '' }
      });
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
      // Check if it's a mock ID
      if (String(activityId).startsWith('2') || activityId > 1000000000000) {
        const updatedActivities = activities.filter(act => act.id !== activityId);
        setActivities(updatedActivities);
        localStorage.setItem(getStorageKey(eventId), JSON.stringify(updatedActivities));
        setDeleteModal({ isOpen: false, activityId: null });
        return;
      }

      const res = await fetch(`${BASE_API}/activities/${activityId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchActivities();
      }
    } catch (err) {
      console.error("Error deleting activity:", err);
      // Fallback: delete from state
      const updatedActivities = activities.filter(act => act.id !== activityId);
      setActivities(updatedActivities);
      localStorage.setItem(getStorageKey(eventId), JSON.stringify(updatedActivities));
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
      if (!match) return 60;
      const [_, start, end] = match;
      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      const startMin = startH * 60 + startM;
      let endMin = endH * 60 + endM;
      if (endMin < startMin) endMin += 24 * 60;
      return Math.max(30, endMin - startMin);
    } catch (e) {
      return 60;
    }
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
        // Only count as overlap if the interval is positive (not just touching)
        // Check if [start1, end1] overlaps with [start2, end2]
        // Condition: max(start1, start2) < min(end1, end2)
        const overlapStart = Math.max(ev1.startMin, ev2.startMin);
        const overlapEnd = Math.min(ev1.endMin, ev2.endMin);

        if (overlapStart < overlapEnd) {
          overlappingList.push({ event1: ev1, event2: ev2 });
        }
      }
    }
    return overlappingList;
  };

  const getOverlappingEventsCount = () => {
    const allEvents = [];
    timelineEvents.forEach((slot, slotIndex) => {
      slot.items.forEach((item, itemIndex) => {
        if (item.type === 'warning') allEvents.push(item.id);
      });
    });
    return allEvents.length;
  };

  const handleOpenOverlapModal = () => {
    const overlaps = getOverlappingEvents();
    setOverlapModal({ isOpen: true, overlappingEvents: overlaps });
  };

  const updateEventTypesForOverlaps = (timeline) => {
    if (!Array.isArray(timeline)) return [];

    const allEvents = [];
    timeline.forEach((slot, slotIndex) => {
      if (!slot?.items) return;
      slot.items.forEach((item, itemIndex) => {
        try {
          if (!item?.timeRange) return;
          const match = item.timeRange.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
          if (match) {
            const [_, start, end] = match;
            const [startH, startM] = start.split(':').map(Number);
            const [endH, endM] = end.split(':').map(Number);
            const startMin = startH * 60 + startM;
            let endMin = endH * 60 + endM;
            if (endMin < startMin) endMin += 24 * 60;
            allEvents.push({ slotIndex, itemIndex, startMin, endMin });
          }
        } catch (e) { /* skip */ }
      });
    });

    const overlappingIndices = new Set();
    for (let i = 0; i < allEvents.length; i++) {
      for (let j = i + 1; j < allEvents.length; j++) {
        const ev1 = allEvents[i];
        const ev2 = allEvents[j];
        const overlapStart = Math.max(ev1.startMin, ev2.startMin);
        const overlapEnd = Math.min(ev1.endMin, ev2.endMin);

        if (overlapStart < overlapEnd) {
          overlappingIndices.add(`${ev1.slotIndex}-${ev1.itemIndex}`);
          overlappingIndices.add(`${ev2.slotIndex}-${ev2.itemIndex}`);
        }
      }
    }

    return timeline.map((slot, sIdx) => ({
      ...slot,
      items: (slot.items || []).map((item, iIdx) => {
        const isOverlapping = overlappingIndices.has(`${sIdx}-${iIdx}`);
        return { ...item, type: isOverlapping ? 'warning' : 'normal' };
      })
    }));
  };

  const eventTitle = eventData?.title || 'กำลังโหลด...';
  const eventDate = formatEventDate(eventData?.event_date || eventData?.date);
  
  // Handle location rendering (could be string or object)
  const renderLocation = () => {
    if (!eventData?.location) return null;
    if (typeof eventData.location === 'string') return eventData.location;
    if (typeof eventData.location === 'object' && eventData.location !== null) {
      return eventData.location.address || `พิกัด: ${eventData.location.lat || '-'}, ${eventData.location.lon || '-'}`;
    }
    return null;
  };

  const eventLocation = renderLocation();

  if (!eventId) {
    return (
      <div className="layout dark-layout">
        <div className="loading-container">
          <p>ไม่พบรหัสงาน</p>
          <button onClick={() => navigate('/workrecord')}>กลับไปหน้าบันทึกงาน</button>
        </div>
      </div>
    );
  }

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
          <div className="stat-pill grey">
            จำนวนงานที่ยังไม่ได้กำหนด : {undeterminedCount}
          </div>
          <div className="overlap-stat-container">
            <button
              className="stat-pill red"
              onClick={handleOpenOverlapModal}
              style={{ cursor: 'pointer', border: 'none', fontSize: '14px' }}
            >
              จำนวนงานที่ซ้อนกัน : {getOverlappingEventsCount()}
            </button>
            {getOverlappingEventsCount() > 0 && (
              <div className="fix-icon-wrapper" title="มีงานซ้อนกัน กรุณาแก้ไข">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span className="fix-text">แก้ไข</span>
              </div>
            )}
          </div>
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

        {/* Create Activity Sidebar (Slide-out) */}
        <div className={`activity-sidebar-overlay ${isModalOpen ? 'open' : ''}`} onClick={() => setIsModalOpen(false)}>
          <div className="activity-sidebar" onClick={(e) => e.stopPropagation()}>
            <header className="activity-sidebar-header">
              <h2 className="activity-sidebar-title">สร้างกิจกรรมใหม่</h2>
              <button className="close-sidebar-btn" onClick={() => setIsModalOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </header>

            <div className="activity-sidebar-content">
              <div className="modal-form">
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
                    rows="6"
                    value={newEvent.details}
                    onChange={(e) => setNewEvent({ ...newEvent, details: e.target.value })}
                  ></textarea>
                </div>
              </div>
            </div>

            <footer className="activity-sidebar-footer">
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                ยกเลิก
              </button>
              <button className="btn-save" onClick={handleSaveEvent}>
                บันทึกกิจกรรม
              </button>
            </footer>
          </div>
        </div>

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

      </main>

      {/* Edit Activity Sidebar (Slide-out) */}
      <div className={`activity-sidebar-overlay ${editModal.isOpen ? 'open' : ''}`} onClick={() => setEditModal({ ...editModal, isOpen: false })}>
        <div className="activity-sidebar" onClick={(e) => e.stopPropagation()}>
          <header className="activity-sidebar-header">
            <h2 className="activity-sidebar-title">แก้ไขกิจกรรม</h2>
            <button className="close-sidebar-btn" onClick={() => setEditModal({ ...editModal, isOpen: false })}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </header>

          <div className="activity-sidebar-content">
            <div className="modal-form">
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
                  rows="6"
                  value={editModal.data.details}
                  onChange={(e) => setEditModal({
                    ...editModal,
                    data: { ...editModal.data, details: e.target.value }
                  })}
                ></textarea>
              </div>
            </div>
          </div>

          <footer className="activity-sidebar-footer">
            <button className="btn-cancel" onClick={() => setEditModal({ ...editModal, isOpen: false })}>
              ยกเลิก
            </button>
            <button className="btn-save" onClick={handleUpdateEvent}>
              บันทึกการแก้ไข
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
