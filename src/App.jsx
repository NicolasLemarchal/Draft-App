import { Routes, Route } from "react-router-dom";
import DraftPage from "./pages/DraftPage";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DraftPage />} />
    </Routes>
  );
}
