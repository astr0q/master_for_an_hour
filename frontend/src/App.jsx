import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import Navbar from './components/navbar';
import ProtectedRoute from './components/protectedRoute';
import Login from './pages/login';
import Register from './pages/register';
import NewRequest from './pages/newRequest';
import MyRequests from './pages/myRequest';
import AllRequests from './pages/allRequest';
import MyJobs from './pages/myJobs';
import Availability from './pages/availability';
import History from './pages/history';
import Stats from './pages/stats';
import Reports from './pages/reports';

function Assign() { return <h2>Assign Masters</h2>; }
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ padding: '24px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/new-request" element={
              <ProtectedRoute roles={['customer']}><NewRequest /></ProtectedRoute>
            }/>
            <Route path="/my-requests" element={
              <ProtectedRoute roles={['customer']}><MyRequests /></ProtectedRoute>
            }/>

            <Route path="/all-requests" element={
              <ProtectedRoute roles={['operator']}><AllRequests /></ProtectedRoute>
            }/>
            <Route path="/assign" element={
              <ProtectedRoute roles={['operator']}><Assign /></ProtectedRoute>
            }/>

            <Route path="/my-jobs" element={
              <ProtectedRoute roles={['master']}><MyJobs /></ProtectedRoute>
            }/>
            <Route path="/availability" element={
              <ProtectedRoute roles={['master']}><Availability /></ProtectedRoute>
            }/>
            <Route path="/history" element={
            <ProtectedRoute roles={['customer', 'operator']}><History /></ProtectedRoute>
            }/>
            <Route path="/stats" element={
            <ProtectedRoute roles={['operator']}><Stats /></ProtectedRoute>
            }/>
            <Route path="/reports" element={
            <ProtectedRoute roles={['operator']}><Reports /></ProtectedRoute>
            }/>

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}