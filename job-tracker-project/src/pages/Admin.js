// src/pages/Admin.js
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Typography } from '@mui/material'
import JobList from '../components/JobList'
import { fetchAllJobsAdmin } from '../store/slices/jobsSlice' // هنضيف الثنك بالخطوة 2

export default function Admin() {
  const dispatch = useDispatch()
  const items = useSelector(s => s.jobs.items)

  useEffect(() => {
    dispatch(fetchAllJobsAdmin())
  }, [dispatch])

  return (
    <>
      <Typography variant="h5" gutterBottom>All Applications</Typography>
      <JobList items={items} onEdit={() => {}} onDelete={() => {}} />
    </>
  )
}
