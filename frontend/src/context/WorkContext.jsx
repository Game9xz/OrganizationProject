import React, { useState, useEffect, useCallback } from "react";
import { WorkContext } from "./WorkContextBase";

const BASE_API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const WorkProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // ดึง user_id จาก localStorage/sessionStorage
  const getUserId = () => {
    let storedUser = localStorage.getItem("user");
    if (!storedUser) storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.id || user.user_id;
    }
    return null;
  };

  // =====================
  // FETCH all events
  // =====================
  const fetchEvents = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_API}/events?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // =====================
  // CREATE event
  // =====================
  const addEvent = async (newEvent) => {
    console.log("DATA SEND:", newEvent);
    const userId = getUserId();
    if (!userId) return;

    try {
      const payload = {
        user_id: userId,
        title: newEvent.title,
        category: newEvent.category || null,
        location: newEvent.location || null,
        room: newEvent.room || null,
        event_date: newEvent.event_date
          ? String(newEvent.event_date).split("T")[0]
          : null,
        people_count: parseFloat(String(newEvent.participants ?? newEvent.people_count ?? 0).replace(/,/g, "")) || 0,
        budget: parseFloat(String(newEvent.budget ?? 0).replace(/,/g, "")) || 0,
        staff_cost: parseFloat(String(newEvent.staff_cost ?? 0).replace(/,/g, "")) || 0,
        venue_cost: parseFloat(String(newEvent.venue_cost ?? 0).replace(/,/g, "")) || 0,
        status: newEvent.status || "ยังไม่ได้กำหนด",
      };

      console.log("PAYLOAD SENT:", payload);

      const res = await fetch(`${BASE_API}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchEvents(); // refetch
      } else {
        const data = await res.json();
        alert(data.message || "ไม่สามารถสร้างงานได้");
      }
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  // =====================
  // DELETE event
  // =====================
  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`${BASE_API}/events/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.event_id !== id));
      }
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  // =====================
  // UPDATE status
  // =====================
  const updateEventStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${BASE_API}/events/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.event_id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch (err) {
      console.error("Error updating event status:", err);
    }
  };

  // =====================
  // UPDATE full event
  // =====================
  const updateEvent = async (id, updatedData) => {
    try {
      // Normalize event_date: prefer event_date, fallback to date, strip time component
      const rawDate = updatedData.event_date || updatedData.date || null;
      const eventDate = rawDate ? String(rawDate).split("T")[0] : null;

      const payload = {
        title: updatedData.title,
        category: updatedData.category || null,
        location: updatedData.location || null,
        room: updatedData.room || null,
        event_date: eventDate,
        people_count: parseFloat(String(updatedData.participants ?? updatedData.people_count ?? 0).replace(/,/g, "")) || 0,
        budget: parseFloat(String(updatedData.budget ?? 0).replace(/,/g, "")) || 0,
        staff_cost: parseFloat(String(updatedData.staff_cost ?? 0).replace(/,/g, "")) || 0,
        venue_cost: parseFloat(String(updatedData.venue_cost ?? 0).replace(/,/g, "")) || 0,
        status: updatedData.status || "ยังไม่ได้กำหนด",
      };

      console.log("UPDATE PAYLOAD:", payload);

      const res = await fetch(`${BASE_API}/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchEvents();
      } else {
        const data = await res.json();
        alert(data.message || "ไม่สามารถแก้ไขงานได้");
      }
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  // backward compat: provide weddingEvents/partyEvents as computed
  const weddingEvents = events.filter((e) => e.category === "งานแต่ง");
  const partyEvents = events.filter((e) => e.category !== "งานแต่ง");

  const value = {
    events,
    weddingEvents,
    partyEvents,
    loading,
    fetchEvents,
    addEvent,
    deleteEvent,
    updateEvent,
    updateEventStatus,
  };

  return <WorkContext.Provider value={value}>{children}</WorkContext.Provider>;
};
