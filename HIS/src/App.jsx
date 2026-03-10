import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import PatientInfo from './features/agial/pages/PatientInfo';
import Sidebar from './components/layout/Sidebar';
import useAuthStore from './features/auth/store';

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
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
