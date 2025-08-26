import React, { useState } from 'react'
import {
  Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton,
  Chip, Stack, Typography, Dialog, DialogContent, DialogTitle, DialogActions, Button
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import JobForm from './JobForm'

const statusColor = (s) => ({
  applied: 'info',
  interview: 'warning',
  rejected: 'error',
  hired: 'success'
}[s] || 'default')

export default function JobList({ items, onEdit, onDelete }) {
  const [editing, setEditing] = useState(null)

  if (!items?.length) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">No applications yet.</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2, overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>Applications</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Company</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.company}</TableCell>
              <TableCell>{row.position}</TableCell>
              <TableCell><Chip label={row.status} color={statusColor(row.status)} /></TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <IconButton onClick={()=>setEditing(row)}><EditIcon /></IconButton>
                  <IconButton onClick={()=>onDelete(row.id)}><DeleteIcon /></IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!editing} onClose={()=>setEditing(null)} fullWidth maxWidth="md">
        <DialogTitle>Edit application</DialogTitle>
        <DialogContent>
          {editing && <JobForm initial={editing} onSubmit={(data)=>{ onEdit(editing.id, data); setEditing(null) }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setEditing(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
