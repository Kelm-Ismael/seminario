import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import TurnosPage from "../pages/TurnosPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/turnos" element={<TurnosPage />} />
      </Routes>
    </BrowserRouter>
  );
}