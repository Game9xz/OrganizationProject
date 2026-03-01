import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./auth/LoginForm.jsx";
import SignUpForm from "./auth/SignUpForm";
import Home from "./components/Home";
import Workrecord from "./components/Workrecord";
import WorkrecordDetail from "./components/WorkRecordDetail";
import WorkStatus from "./components/WorkStatus";
import AStartPage from "./components/AStartPage";
import EventDetail from "./components/EventDetail.jsx";
import FuneralDetail from "./components/FuneralDetail.jsx";
import CocktailDetail from "./components/CocktailDetail";
import OrdinationDetail from "./components/OrdinationDetail";
import PreWeddingDetail from "./components/PreWeddingDetail";
import EngagementDetail from "./components/EngagementDetail";
import WeddingDetail from "./components/WeddingDetail";
import FuneralPackageDetail from "./components/FuneralPackageDetail";
import CocktailPackageDetail from "./components/CocktailPackageDetail";
import OrdinationPackageDetail from "./components/OrdinationPackageDetail";
import HomePage from "./components/HomePage.jsx";
import Inventory from "./components/Inventory.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/astartpage" />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<SignUpForm />} />
      <Route path="/home" element={<Home />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/workrecord" element={<Workrecord />} />
      <Route path="/workrecord/detail/:id" element={<WorkrecordDetail />} />
      <Route path="/workrecord/status" element={<WorkStatus />} />
      <Route path="/astartpage" element={<AStartPage />} />
      <Route path="/event/wedding" element={<EventDetail />} />
      <Route path="/event/funeral" element={<FuneralDetail />} />
      <Route path="/event/cocktail" element={<CocktailDetail />} />
      <Route path="/event/ordination" element={<OrdinationDetail />} />
      <Route path="/event/wedding/prewedding" element={<PreWeddingDetail />} />
      <Route path="/event/wedding/engagement" element={<EngagementDetail />} />
      <Route path="/event/wedding/weddingpackage" element={<WeddingDetail />} />
      <Route path="/event/funeral/package" element={<FuneralPackageDetail />} />
      <Route
        path="/event/cocktail/package"
        element={<CocktailPackageDetail />}
      />
      <Route
        path="/event/ordination/package"
        element={<OrdinationPackageDetail />}
      />
      <Route path="/inventory" element={<Inventory />} />
    </Routes>
  );
}

export default App;
