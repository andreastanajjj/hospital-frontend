import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import AdminPanel from "./pages/AdminPanel.jsx"
import DoctorDashboard from "./pages/DoctorDashboard.jsx"
import PatientDashboard from "./pages/PatientDashboard.jsx"
import NotFound from "./pages/NotFound.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import "./index.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Protected Doctor Routes */}
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Patient Routes */}
        <Route
          path="/patient/*"
          element={
            <ProtectedRoute role="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
