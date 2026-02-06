import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./auth/LoginForm";
import SignUpForm from "./auth/SignUpForm";
import Home from "./components/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<SignUpForm />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
