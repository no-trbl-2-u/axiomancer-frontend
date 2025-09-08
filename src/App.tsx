import LandingPage from "./Pages/LandingPage/LandingPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import LoadingPage from "./Pages/LoadingPage/LoadingPage";
import CharacterPage from "./Pages/CharacterPage/CharacterPage";
import CharacterCreatePage from "./Pages/CharacterCreatePage/CharacterCreatePage";
import CharacterSelectPage from "./Pages/CharacterSelectPage/CharacterSelectPage";
import ExplorationPage from "./Pages/ExplorationPage/ExplorationPage";
import CombatPage from "./Pages/CombatPage/CombatPage";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CharacterProvider } from "./context/CharacterContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CharacterProvider>
        <Routes>
          {/* Public routes - no authentication required */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          
          {/* Protected routes - authentication required */}
          <Route path="/character-create" element={
            <ProtectedRoute>
              <CharacterCreatePage 
                onCharacterCreated={(character) => window.location.href = '/exploration'} 
              />
            </ProtectedRoute>
          } />
          <Route path="/character-select" element={
            <ProtectedRoute>
              <CharacterSelectPage 
                onCharacterSelected={(character) => window.location.href = '/character'}
                onCreateNewCharacter={() => window.location.href = '/character-create'}
              />
            </ProtectedRoute>
          } />
          
          {/* Protected routes - authentication AND character required */}
          <Route path="/character" element={
            <ProtectedRoute requireCharacter={true}>
              <CharacterPage />
            </ProtectedRoute>
          } />
          <Route path="/exploration" element={
            <ProtectedRoute requireCharacter={true}>
              <ExplorationPage />
            </ProtectedRoute>
          } />
          <Route path="/combat" element={
            <ProtectedRoute requireCharacter={true}>
              <CombatPage />
            </ProtectedRoute>
          } />
        </Routes>
      </CharacterProvider>
    </AuthProvider>
  );
}

export default App;
