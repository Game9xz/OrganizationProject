import express from "express";
import {
    requestOTP,
    verifyOTP,
    resetPassword,
} from "../controllers/resetController.js";

const router = express.Router();

router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
