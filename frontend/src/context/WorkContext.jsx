import React, { useState, useContext } from "react";
import { WorkContext } from "./WorkContextBase";

export const WorkProvider = ({ children }) => {
  const [budgetItems, setBudgetItems] = useState({
    wedding: [],
    party: [],
    merit: [],
    funeral: [],
  });

  const addBudgetItem = (category, item) => {
    setBudgetItems((prev) => ({
      ...prev,
      [category]: [...prev[category], { ...item, id: Date.now() }],
    }));
  };

  const [weddingEvents, setWeddingEvents] = useState([
    {
      id: 1,
      title: "งานแต่ง คุณกาญจนา",
      desc: "งานแต่งสุดอบอุ่น ณ สวนสวรรค์ รีสอร์ท พร้อมบรรยากาศโรแมนติก โรงแรมตึก",
      date: "21 มกราคม 2568",
      location: { lon: 100.9927, lat: 13.1131 }, // Kasetsart Si Racha
      room: "ห้องประชุมใหญ่",
      category: "งานแต่ง",
      people: "200 คน",
      budget: "500,000",
      staff_cost: "35,000",
      venue_cost: "100,000",
      manager: "กาญจนศิริ",
      isTarget: true,
      status: "completed",
    },
    {
      id: 2,
      title: "งานแต่ง คุณเอ & คุณบี",
      desc: "งานแต่งสุดอบอุ่น ณ สวนสวรรค์ รีสอร์ท พร้อมบรรยากาศโรแมนติก โรงแรมตึก",
      date: "14 กุมภาพันธ์ 2568",
      location: { lon: 98.9633, lat: 18.8039 }, // Suan Sawan Resort, Chiang Mai
      room: "สวนกลางแจ้ง",
      category: "งานแต่ง",
      people: "200 คน",
      budget: "500,000",
      staff_cost: "35,000",
      venue_cost: "100,000",
      manager: "พีรณัฐ",
      status: "completed",
    },
    {
      id: 3,
      title: "งานแต่ง คุณเจ้านาย",
      desc: "งานแต่งสุดอบอุ่น ณ ชายหาด รีสอร์ท พร้อมบรรยากาศ โรงแรมตึกแสนหวาน",
      date: "30 มกราคม 2568",
      location: { lon: 100.8807, lat: 12.9278 }, // Pattaya Beach
      room: "ริมทะเล",
      category: "งานแต่ง",
      people: "150 คน",
      budget: "250,000",
      staff_cost: "20,000",
      venue_cost: "50,000",
      manager: "พัฒน์ธนันภู",
      status: "completed",
    },
    {
      id: 4,
      title: "งานแต่ง คุณเจได",
      desc: "งานแต่งสุดอบอุ่น ณ สวนผึ้ง รีสอร์ท พร้อมบรรยากาศ โรงแรมตึก",
      date: "28 กุมภาพันธ์ 2568",
      location: { lon: 99.3335, lat: 13.5325 }, // Suan Phueng, Ratchaburi
      room: "ลานกิจกรรม",
      category: "งานแต่ง",
      people: "200 คน",
      budget: "500,000",
      staff_cost: "35,000",
      venue_cost: "100,000",
      manager: "ศุภกร",
      status: "completed",
    },
  ]);

  const [partyEvents, setPartyEvents] = useState([
    {
      id: 5,
      title: "งานวันเกิดสุดพิเศษ",
      desc: "ปาร์ตี้วันเกิดริมสระน้ำ พร้อมการแสดงสด",
      date: "5 มกราคม 2568",
      location: { lon: 100.8619, lat: 12.9118 }, // Pattaya Pool Villa
      room: "Pool Side",
      category: "ปาร์ตี้",
      people: "80 คน",
      budget: "150,000",
      staff_cost: "10,000",
      venue_cost: "25,000",
      manager: "ธนภัทร",
      status: "completed",
    },
    {
      id: 6,
      title: "สัมมนาผู้นำองค์กร 2024",
      desc: "งานสัมมนาประจำปีสำหรับผู้บริหารระดับสูง พร้อม Workshop",
      date: "20 มกราคม 2568",
      location: { lon: 100.5601, lat: 13.7305 }, // Grand Hyatt Erawan Bangkok
      room: "Grand Ballroom",
      category: "สัมมนา",
      people: "150 คน",
      budget: "800,000",
      staff_cost: "50,000",
      venue_cost: "150,000",
      manager: "สิรินธร",
      status: "completed",
    },
  ]);

  const updateEventStatus = (id, newStatus) => {
    setWeddingEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)),
    );
    setPartyEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)),
    );
  };

  const deleteEvent = (id) => {
    setWeddingEvents((prev) => prev.filter((e) => e.id !== id));
    setPartyEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const addEvent = (newEvent) => {
    const eventToAdd = {
      ...newEvent,
      id: Date.now(),
      status: newEvent.status || "undetermined",
    };

    if (newEvent.category === "งานแต่ง") {
      setWeddingEvents((prev) => [...prev, eventToAdd]);
    } else {
      setPartyEvents((prev) => [...prev, eventToAdd]);
    }
  };

  const updateEvent = (id, updatedEvent) => {
    setWeddingEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedEvent } : e)),
    );
    setPartyEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedEvent } : e)),
    );
  };

  const value = {
    weddingEvents,
    setWeddingEvents,
    partyEvents,
    setPartyEvents,
    events: [...weddingEvents, ...partyEvents], // รวม events ทั้งหมด
    updateEventStatus,
    updateEvent, // เพิ่มฟังก์ชัน updateEvent
    deleteEvent,
    addEvent,
    budgetItems,
    addBudgetItem,
  };

  return <WorkContext.Provider value={value}>{children}</WorkContext.Provider>;
};
