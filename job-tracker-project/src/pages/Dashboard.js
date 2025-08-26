import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createJob, fetchJobs, updateJob, deleteJob } from '../store/slices/jobsSlice'
import { Paper, Stack, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material'
import JobForm from '../components/JobForm'
import JobList from '../components/JobList'

const filters = ['all', 'applied', 'interview', 'rejected', 'hired']

export default function Dashboard() {
  const user = useSelector(s => s.auth.user)
  const { items, status, lastFilter } = useSelector(s => s.jobs)
  const [filter, setFilter] = useState(lastFilter || 'all')
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchJobs({ userid: user.uid, statusFilter: filter }))
    }
  }, [dispatch, user, filter])

  const filteredItems = useMemo(() => {
    if (!items) return []
    if (filter === 'all') return items
    return items.filter(i => i.status === filter)
  }, [items, filter])

  const handleCreate = (data) => { if (user?.uid) dispatch(createJob({ userid: user.uid, ...data })) }
  const handleEdit = (id, updates) => dispatch(updateJob({ id, updates }))
  const handleDelete = (id) => dispatch(deleteJob(id))

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Dashboard</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Filter by status</Typography>
        <ToggleButtonGroup color="primary" exclusive value={filter} onChange={(_, v) => v && setFilter(v)}>
          {filters.map(f => <ToggleButton key={f} value={f} sx={{ textTransform: 'capitalize' }}>{f}</ToggleButton>)}
        </ToggleButtonGroup>
        <Typography variant="caption" sx={{ display:'block', mt:1 }} color="text.secondary">
          Results show instantly from cache while Firestore refetches for the selected filter.
        </Typography>
      </Paper>
      <JobForm onSubmit={handleCreate} />
      <JobList items={filteredItems} onEdit={handleEdit} onDelete={handleDelete} />
      {status === 'loading' && <Typography variant="body2">Loading...</Typography>}
    </Stack>
  )
}
