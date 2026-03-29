import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import useAuthStore from './features/auth/store';

const Login = lazy(() => import('./features/auth/pages/Login'));
const PatientInfo = lazy(() => import('./features/unit/pages/PatientInfo'));
const CalendarPage = lazy(() => import('./features/unit/pages/CalendarPage'));
const ReceptionPage = lazy(() => import('./features/unit/pages/ReceptionPage'));
const AppointmentsListPage = lazy(() => import('./features/unit/pages/AppointmentsListPage'));
const DoctorScreen = lazy(() => import('./features/unit/pages/Doctor'));
const AgialDashboard = lazy(() => import('./features/centcom/pages/AgialDashboard'));
const UnitDashboard = lazy(() => import('./features/centcom/pages/UnitDashboard'));
const CentComPage = lazy(() => import('./features/centcom/pages/CentComPage'));
const NursingPage = lazy(() => import('./features/unit/pages/NursingPage'));
const LabTestsAR = lazy(() => import('./features/unit/pages/LabTests'));
const RadTestsAR = lazy(() => import('./features/unit/pages/RadTests'));
const PatientsDashboard = lazy(() => import('./features/dashboards/pages/PatientsDashboard'));
const OperationsDashboard = lazy(() => import('./features/dashboards/pages/OperationsDashboard'));
const PharmacyDashboard = lazy(() => import('./features/dashboards/pages/PharmacyDashboard'));
const OperationInternal = lazy(() => import('./features/unit/pages/OperationInternal'));
const EmergencyPage = lazy(() => import('./features/unit/pages/EmergencyPage'));
const ExternalServicesPage = lazy(() => import('./features/unit/pages/ExternalServicesPage'));

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
      <Suspense fallback={<div className="flex h-screen items-center justify-center text-gray-400">جاري التحميل...</div>}>
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
      </Suspense>
    </BrowserRouter>
  );
}
