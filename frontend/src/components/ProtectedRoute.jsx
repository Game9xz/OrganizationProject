import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // เช็คว่าลง library นี้หรือยัง

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    return <Navigate replace to="/login" />;
  }

  let decoded = null;
  try {
    decoded = jwtDecode(token);
  } catch (error) {
    console.error("Token decode error:", error);
    return <Navigate replace to="/login" />;
  }

  // เช็ค Role (ถ้ามีการส่ง allowedRoles มา)
  if (allowedRoles && !allowedRoles.includes(decoded.role)) {
    return <Navigate replace to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
