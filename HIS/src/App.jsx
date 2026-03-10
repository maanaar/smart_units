import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import PatientInfo from './features/agial/pages/PatientInfo';
import ReceptionPage from './features/agial/pages/ReceptionPage';
import useAuthStore from './features/auth/store';

// function Protected({ children }) {
//   const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
//   return isLoggedIn ? children : <Navigate to="/login" replace />;
// }

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/agial/patients" element={<PatientInfo />} />
        <Route path="/agial/patients/:id" element={<PatientInfo />} />
            <Route path="/agial/ReceptionPage" element={<ReceptionPage />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
