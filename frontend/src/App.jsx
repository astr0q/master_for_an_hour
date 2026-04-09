import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import Navbar from './components/navbar';
import ProtectedRoute from './components/protectedRoute';
import Login from './pages/login';
import Register from './pages/register';
import NewRequest from './pages/newRequest';
import MyRequests from './pages/myRequests';
import AllRequests from './pages/allRequest';

// placeholder pages — replace later with real ones
function Home() { return <h2>Home</h2>; }
function NewRequest() { return <h2>New Request</h2>; }
function MyRequests() { return <h2>My Requests</h2>; }
function AllRequests() { return <h2>All Requests</h2>; }
function Assign() { return <h2>Assign Masters</h2>; }
function Reports() { return <h2>Reports</h2>; }
function MyJobs() { return <h2>My Jobs</h2>; }
function Availability() { return <h2>Availability</h2>; }

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ padding: '24px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* customer routes */}
            <Route path="/new-request" element={
              <ProtectedRoute roles={['customer']}><NewRequest /></ProtectedRoute>
            }/>
            <Route path="/my-requests" element={
              <ProtectedRoute roles={['customer']}><MyRequests /></ProtectedRoute>
            }/>

            {/* operator routes */}
            <Route path="/all-requests" element={
              <ProtectedRoute roles={['operator']}><AllRequests /></ProtectedRoute>
            }/>
            <Route path="/assign" element={
              <ProtectedRoute roles={['operator']}><Assign /></ProtectedRoute>
            }/>
            <Route path="/reports" element={
              <ProtectedRoute roles={['operator']}><Reports /></ProtectedRoute>
            }/>

            {/* master routes */}
            <Route path="/my-jobs" element={
              <ProtectedRoute roles={['master']}><MyJobs /></ProtectedRoute>
            }/>
            <Route path="/availability" element={
              <ProtectedRoute roles={['master']}><Availability /></ProtectedRoute>
            }/>

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}