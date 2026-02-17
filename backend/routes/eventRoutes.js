import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  updateStatus,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.patch("/:id/status", updateStatus);

export default router;
