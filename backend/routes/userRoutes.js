import express from "express";
import {
  registerUser,
  loginUser,
  getUserById,
} from "../controllers/userController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUserById);

router.get("/admin-only", verifyToken, requireRole("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

export default router;
