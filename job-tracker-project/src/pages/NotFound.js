import React from 'react'
import { Paper, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>404</Typography>
      <Typography variant="h6" gutterBottom>Page not found</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>Go Home</Button>
    </Paper>
  )
}
