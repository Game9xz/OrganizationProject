import express from "express";
import {
  getAllBookings,
  getBookingById,
  createBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.delete("/:id", deleteBooking);

export default router;
