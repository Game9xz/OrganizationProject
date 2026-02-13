import React, { createContext, useState, useContext } from "react";

const WorkContext = createContext();

export const useWorkContext = () => useContext(WorkContext);

export const WorkProvider = ({ children }) => {
  const [weddingEvents, setWeddingEvents] = useState([
    {
      id: 1,
      title: "งานแต่ง คุณกาญจนา",
      desc: "งานแต่งสุดอบอุ่น ณ สวนสวรรค์ รีสอร์ท พร้อมบรรยากาศโรแมนติก โรงแรมตึก",
      date: "21 มกราคม 2568",
      location: "คณะวิศวกรรมศาสตร์, ศรีราชา",
      room: "ห้องประชุมใหญ่",
      category: "งานแต่ง",
      people: "200 คน",
      budget: "500,000 บาท",
      isTarget: true,
      status: "preparing", // กำลังจัดเตรียม
    },
    {
      id: 2,
      title: "งานแต่ง คุณเอ & คุณบี",
      desc: "งานแต่งสุดอบอุ่น ณ สวนสวรรค์ รีสอร์ท พร้อมบรรยากาศโรแมนติก โรงแรมตึก",
      date: "14 กุมภาพันธ์ 2568",
      location: "สวนสวรรค์ รีสอร์ท, เชียงใหม่",
      room: "สวนกลางแจ้ง",
      category: "งานแต่ง",
      people: "200 คน",
      budget: "500,000 บาท",
      status: "completed", // เสร็จสิ้น
    },
    {
      id: 3,
      title: "งานแต่ง คุณเจ้านาย",
      desc: "งานแต่งสุดอบอุ่น ณ ชายหาด รีสอร์ท พร้อมบรรยากาศ โรงแรมตึกแสนหวาน",
      date: "30 มกราคม 2568",
      location: "ชายหาดลับพัทยา, ชลบุรี",
      room: "ริมทะเล",
      category: "งานแต่ง",
      people: "150 คน",
      budget: "250,000 บาท",
      status: "preparing",
    },
    {
      id: 4,
      title: "งานแต่ง คุณเจได",
      desc: "งานแต่งสุดอบอุ่น ณ สวนผึ้ง รีสอร์ท พร้อมบรรยากาศ โรงแรมตึก",
      date: "28 กุมภาพันธ์ 2568",
      location: "สวนผึ้ง, ราชบุรี",
      room: "ลานกิจกรรม",
      category: "งานแต่ง",
      people: "200 คน",
      budget: "500,000 บาท",
      status: "preparing",
    },
  ]);

  const [partyEvents, setPartyEvents] = useState([
    {
      id: 5,
      title: "งานวันเกิดสุดพิเศษ",
      desc: "ปาร์ตี้วันเกิดริมสระน้ำ พร้อมการแสดงสด",
      date: "5 มกราคม 2568",
      location: "บ้านพักริมทะเล, พัทยา",
      room: "Pool Side",
      category: "ปาร์ตี้",
      people: "80 คน",
      budget: "150,000 บาท",
      status: "undetermined", // ยังไม่ได้กำหนด? Let's say undetermined for now based on the image
    },
    {
      id: 6,
      title: "สัมมนาผู้นำองค์กร 2024",
      desc: "งานสัมมนาประจำปีสำหรับผู้บริหารระดับสูง พร้อม Workshop",
      date: "20 มกราคม 2568",
      location: "โรงแรมแกรนด์ไฮแอท, กรุงเทพฯ",
      room: "Grand Ballroom",
      category: "สัมมนา",
      people: "150 คน",
      budget: "800,000 บาท",
      status: "in_progress", // กำลังดำเนินการ
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

  const value = {
    weddingEvents,
    setWeddingEvents,
    partyEvents,
    setPartyEvents,
    updateEventStatus,
    deleteEvent,
    addEvent,
  };

  return <WorkContext.Provider value={value}>{children}</WorkContext.Provider>;
};
