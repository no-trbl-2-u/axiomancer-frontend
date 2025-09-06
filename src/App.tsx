import LandingPage from "./Pages/LandingPage/LandingPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import LoadingPage from "./Pages/LoadingPage/LoadingPage";
import CharacterPage from "./Pages/CharacterPage/CharacterPage";
import ExplorationPage from "./Pages/ExplorationPage/ExplorationPage";
import CombatPage from "./Pages/CombatPage/CombatPage";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CharacterProvider } from "./context/CharacterContext";

function App() {
  return (
    <AuthProvider>
      <CharacterProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/character" element={<CharacterPage />} />
          <Route path="/exploration" element={<ExplorationPage />} />
          <Route path="/combat" element={<CombatPage />} />
        </Routes>
      </CharacterProvider>
    </AuthProvider>
  );
}

export default App;
