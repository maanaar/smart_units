import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import PatientInfo from './features/unit/pages/PatientInfo';
import CalendarPage from './features/unit/pages/CalendarPage';
import ReceptionPage from './features/unit/pages/ReceptionPage';
import AppointmentsListPage from './features/unit/pages/AppointmentsListPage';
import DoctorScreen from './features/unit/pages/Doctor';
import AgialDashboard from './features/centcom/pages/AgialDashboard';
import UnitDashboard from './features/centcom/pages/UnitDashboard';
import CentComPage from './features/centcom/pages/CentComPage';
import Sidebar from './components/layout/Sidebar';
import useAuthStore from './features/auth/store';
import NursingPage from './features/unit/pages/NursingPage';
import LabTestsAR from './features/unit/pages/LabTests';
import RadTestsAR from './features/unit/pages/RadTests';
import PatientsDashboard from './features/dashboards/pages/PatientsDashboard';
import OperationsDashboard from './features/dashboards/pages/OperationsDashboard';
import PharmacyDashboard from './features/dashboards/pages/PharmacyDashboard';
import OperationInternal from './features/unit/pages/OperationInternal';
import EmergencyPage from './features/unit/pages/EmergencyPage';
import ExternalServicesPage from './features/unit/pages/ExternalServicesPage';

function Protected() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return (
    <div className="flex h-screen overflow-hidden flex-row-reverse">
      <Sidebar />
      <main className="flex-1 overflow-hidden bg-gray-50">
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
          <Route index element={<Navigate to="/unit/centcom" replace />} />
          <Route path="/unit/patients"            element={<PatientInfo />} />
          <Route path="/unit/patients/:id"        element={<PatientInfo />} />
          <Route path="/unit/calendar"            element={<CalendarPage />} />
          <Route path="/unit/appointments"        element={<AppointmentsListPage />} />
          <Route path="/unit/nursing"             element={<NursingPage />} />
          <Route path="/unit/ReceptionPage"       element={<ReceptionPage />} />
          <Route path="/unit/doctorscreen"        element={<DoctorScreen />} />
          <Route path="/unit/unitcentcom"         element={<AgialDashboard />} />
          <Route path="/unit/centcom"             element={<UnitDashboard />} />
          <Route path="/unit/nationalcentcom"     element={<CentComPage />} />
          <Route path="/unit/labTests"            element={<LabTestsAR />} />
          <Route path="/unit/radTests"            element={<RadTestsAR />} />
          <Route path="/unit/patientdashboard"    element={<PatientsDashboard />} />
          <Route path="/unit/operationsdashboard" element={<OperationsDashboard />} />
          <Route path="/unit/pharmacydashboard"   element={<PharmacyDashboard />} />
          <Route path="/unit/operationinternal"   element={<OperationInternal />} />
          <Route path="/unit/emergency"            element={<EmergencyPage />} />
          <Route path="/unit/external"             element={<ExternalServicesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/unit/operationinternal" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
