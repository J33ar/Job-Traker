import React, { useState, useEffect } from 'react'
import { Paper, Stack, TextField, MenuItem, Button, Typography } from '@mui/material'

const statuses = ['applied', 'interview', 'rejected', 'hired']

export default function JobForm({ onSubmit, initial }) {
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [status, setStatus] = useState('applied')

  useEffect(() => {
    if (initial) {
      setCompany(initial.company || '')
      setPosition(initial.position || '')
      setStatus(initial.status || 'applied')
    }
  }, [initial])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ company, position, status })
    if (!initial) { setCompany(''); setPosition(''); setStatus('applied') }
  }

  return (
    <Paper sx={{ p: 2 }} component="form" onSubmit={handleSubmit}>
      <Typography variant="subtitle1" gutterBottom>{initial ? 'Edit application' : 'New application'}</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Company" value={company} onChange={e=>setCompany(e.target.value)} required fullWidth />
        <TextField label="Position" value={position} onChange={e=>setPosition(e.target.value)} required fullWidth />
        <TextField select label="Status" value={status} onChange={e=>setStatus(e.target.value)} required sx={{ minWidth: 160 }}>
          {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <Button type="submit" variant="contained">{initial ? 'Save' : 'Add'}</Button>
      </Stack>
    </Paper>
  )
}
