import React, { useState } from 'react'
import { TextField, Button, Paper, Typography, Stack, Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../store/slices/authSlice'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status, error } = useSelector(s => s.auth)

  const onSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!email || !password) return setFormError('All fields are required')
    const res = await dispatch(loginUser({ email, password }))
    if (loginUser.fulfilled.match(res)) {
      const dest = location.state?.from?.pathname || '/dashboard'
      navigate(dest)
    }
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <Stack component="form" onSubmit={onSubmit} spacing={2}>
        {formError && <Alert severity="error">{formError}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} fullWidth required />
        <TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} fullWidth required />
        <Button type="submit" variant="contained" disabled={status==='loading'}>Sign In</Button>
        <Typography variant="body2">No account? <Button component={Link} to="/register" size="small">Register</Button></Typography>
      </Stack>
    </Paper>
  )
}
