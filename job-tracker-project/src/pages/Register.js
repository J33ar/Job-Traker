import React, { useState } from 'react'
import { TextField, Button, Paper, Typography, Stack, Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector(s => s.auth)

  const onSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!name || !email || !password) return setFormError('All fields are required')
    const res = await dispatch(registerUser({ name, email, password }))
    if (registerUser.fulfilled.match(res)) navigate('/dashboard')
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Register</Typography>
      <Stack component="form" onSubmit={onSubmit} spacing={2}>
        {formError && <Alert severity="error">{formError}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Name" value={name} onChange={e=>setName(e.target.value)} fullWidth required />
        <TextField label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} fullWidth required />
        <TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} fullWidth required />
        <Button type="submit" variant="contained" disabled={status==='loading'}>Create Account</Button>
      </Stack>
    </Paper>
  )
}
