import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Header from './components/Header'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import ProtectedRoute from './routes/ProtectedRoute'
import { useSelector } from 'react-redux'
import ResumeHelper from "./components/ResumeHelper";
import JobAnalyzer from "./components/JobAnalyzer";
import Chatbot from "./components/Chatbot";

export default function App() {
  const user = useSelector(s => s.auth.user)

  return (
    <Box sx={{ pb: 6 }}>
      <Header />
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <Routes>
          {/* توجيه البداية */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />

          {/* عامة */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* محمية للمستخدمين */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resume" element={<ResumeHelper />} />
            <Route path="/analyzer" element={<JobAnalyzer />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Route>

          {/* محمية للإدمن */}
          <Route element={<ProtectedRoute requireRole="admin" />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </Box>
  )
}
