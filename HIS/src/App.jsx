import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import PatientInfo from './features/agial/pages/PatientInfo';
import CalendarPage from './features/agial/pages/CalendarPage';
import ReceptionPage from './features/agial/pages/ReceptionPage';
import DoctorScreen from './features/agial/pages/Doctor';
import Sidebar from './components/layout/Sidebar';
import useAuthStore from './features/auth/store';
import NursingPage from './features/agial/pages/NursingPage';

function Protected() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />


        <Route element={<Protected />}>
          <Route path="/agial/patients"     element={<PatientInfo />} />
          <Route path="/agial/patients/:id" element={<PatientInfo />} />
          <Route path="/agial/calendar"      element={<CalendarPage />} />
           <Route path="/agial/nursing"      element={<NursingPage/>} />
          <Route path="/agial/ReceptionPage" element={<ReceptionPage />} />
           <Route path="/agial/doctorscreen" element={<DoctorScreen />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
