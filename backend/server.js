import dns from "dns";
dns.setDefaultResultOrder("ipv4first"); // บังคับ IPv4 (Railway ไม่รองรับ IPv6)

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import resetRoutes from "./routes/resetRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import design3dRoutes from "./routes/design3dRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reset", resetRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/design3d", design3dRoutes);
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
