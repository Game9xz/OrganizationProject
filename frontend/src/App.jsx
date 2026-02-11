import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./auth/LoginForm";
import SignUpForm from "./auth/SignUpForm";
import Home from "./components/Home";
import Workrecord from "./components/Workrecord";
import WorkrecordDetail from "./components/WorkRecordDetail";
import WorkStatus from "./components/WorkStatus";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<SignUpForm />} />
      <Route path="/home" element={<Home />} />
      <Route path="/workrecord" element={<Workrecord />} />
      <Route path="/workrecord/detail/:id" element={<WorkrecordDetail />} />
      <Route path="/workrecord/status" element={<WorkStatus />} />
    </Routes>
  );
}

export default App;
