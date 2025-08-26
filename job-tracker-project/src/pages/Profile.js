import React from 'react'
import { useSelector } from 'react-redux'
import { Paper, Typography, Stack } from '@mui/material'

export default function Profile() {
  const user = useSelector(s => s.auth.user)
  if (!user) return null
  return (
    <Paper sx={{ p: 4, maxWidth: 640, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Profile</Typography>
      <Stack spacing={1}>
        <Typography><b>Name:</b> {user.name}</Typography>
        <Typography><b>Email:</b> {user.email}</Typography>
        <Typography><b>Role:</b> {user.role}</Typography>
      </Stack>
    </Paper>
  )
}
