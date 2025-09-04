import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../store/slices/authSlice'

export default function Header() {
  const user = useSelector(s => s.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(6px)' }}>
      <Toolbar sx={{ display: 'flex', gap: 2 }}>
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
          <img src="/logo.svg" alt="logo" width="28" height="28" />
          <Typography variant="h6" color="white">Job Tracker</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {!user && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </Box>
        )}
        {user && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            {user.role === 'admin' && <Button color="inherit" component={Link} to="/admin">Admin</Button>}
            <Button component={Link} to="/resume">Resume</Button>
            <Button component={Link} to="/analyzer">Analyzer</Button>
            <Button component={Link} to="/chatbot">Chatbot</Button>
            <Button variant="outlined" color="secondary" onClick={handleLogout}>Logout</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
