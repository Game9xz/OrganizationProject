import express from "express";
import {
  createActivity,
  getActivitiesByEvent,
  updateActivity,
  deleteActivity,
} from "../controllers/activityController.js";

const router = express.Router();

router.post("/", createActivity);
router.get("/event/:event_id", getActivitiesByEvent);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);

export default router;
