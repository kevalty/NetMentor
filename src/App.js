import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import MainPage from './components/MainPage';
import DiagnosticoPage from './components/DiagnosticoPage';
import PruebaDiagnosticoPage from './components/PruebaDiagnosticoPage';
import ContenidoClasePage from './components/ContenidoClasePage';
import ExamenFinalPage from './components/ExamenFinalPage';
import ContenidosPage from './components/ContenidosPage';
import ClasePage from './components/ClasePage';
import TestPage from './components/TestPage';
import ResetPassPage from './components/ResetPassPage';
import ResultadoPage from './components/ResultadoPage'; 
import AdminHomePage from './components/admin/AdminHomePage';
import UserCruds from './components/admin/UserCruds';
import PruebasCruds from './components/admin/PruebaCruds';
import ContenidoCruds from './components/admin/ContenidoCruds';
import CalificacionCruds from './components/admin/CalificacionCruds';
import IntroduccionCruds from './components/admin/IntroduccionCruds';
import PreguntaCruds from './components/admin/PreguntaCruds';
import ResultadoCruds from './components/admin/ResultadoCruds';
import TestDetailsPage from './components/admin/TestDetailsPage'; // Importa el componente para la página de detalles del test
import EditIntro from './components/admin/EditIntro'; // Importa la página EditIntro
import CursoCruds from './components/admin/CursoCruds';
import Profile from './components/ProfilePage';
import Calificaciones from './components/CalificacionesPage';
import TestContent from './components/TestContent';
import Subcontents from './components/SubContentsPage';
import SubcontentCruds from './components/admin/subcontentCruds';
import SubcontentsCruds2 from './components/admin/SubCruds';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/main" element={<MainPage />} />
        {/* Agrega una ruta dinámica para la página de diagnóstico */}
        <Route path="/diagnostico/:id" element={<DiagnosticoPage />} />
        <Route path="/prueba-diagnostico/:id" element={<PruebaDiagnosticoPage />} />
        <Route path="/contenido_clase" element={<ContenidoClasePage />} />
        {/* Agrega una ruta dinámica para la página de examen final */}
        <Route path="/examen_final/:id" element={<ExamenFinalPage />} />
        <Route path="/contents" element={<ContenidosPage />} />
        <Route path="/clase/:contentId" element={<ClasePage />} />
        <Route path="/testfinal/:id" element={<TestPage />} />
        <Route path="/resetpass?" element={<ResetPassPage />} />
        <Route path="/resultado" element={<ResultadoPage />} />
        <Route path="/UserCruds" element={<UserCruds />} />
        <Route path="/PruebaCruds" element={<PruebasCruds />} />
        <Route path="/ContenidoCruds" element={<ContenidoCruds />} />
        <Route path="/subcontentCruds" element={<SubcontentCruds />} />
        <Route path="/subcontentsCruds2/:id" element={<SubcontentsCruds2 />} />
        <Route path="/CalificacionCruds" element={<CalificacionCruds />} />
        <Route path="/IntroduccionCruds" element={<IntroduccionCruds />} />
        <Route path="/PreguntaCruds" element={<PreguntaCruds />} />
        <Route path="/ResultadoCruds" element={<ResultadoCruds />} />
        <Route path="/CursoCruds" element={<CursoCruds />} />
        <Route path="/AdminHomePage" element={<AdminHomePage />} />
        {/* Agrega la ruta para la página de detalles del test con el parámetro de ruta dinámico */}
        <Route path="/test/:testId" element={<TestDetailsPage />} />
        {/* Agrega la ruta para la página EditIntro con el parámetro de ruta dinámico */}
        <Route path="/editintro/:id" element={<EditIntro />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/calificaciones" element={<Calificaciones />} />
        <Route path="/TestContent/:contentId/:testId" element={<TestContent />} />
        <Route path="/Subcontents/:contentId/:subcontentId" element={<Subcontents />} /> 

      </Routes>
    </Router>
  );
}

export default App;
