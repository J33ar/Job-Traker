import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { db } from '../../firebase'
import {
  collection, addDoc, getDocs, query, where, orderBy, serverTimestamp,
  updateDoc, deleteDoc, doc
} from 'firebase/firestore'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  lastFilter: 'all',
}

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async ({ userid, company, position, status }, { rejectWithValue }) => {
    try {
      const col = collection(db, 'jobApplications')
      const payload = { userid, company, position, status, createdAt: serverTimestamp() }
      const ref = await addDoc(col, payload)
      return { id: ref.id, ...payload }
    } catch (err) { return rejectWithValue(err.message) }
  }
)

export const fetchAllJobsAdmin = createAsyncThunk(
  'jobs/fetchAllJobsAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const col = collection(db, 'jobApplications')
      const snap = await getDocs(query(col, orderBy('createdAt', 'desc')))
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      return items
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async ({ userid, statusFilter = 'all' }, { rejectWithValue }) => {
    try {
      const col = collection(db, 'jobApplications')
      let q
      if (statusFilter && statusFilter !== 'all') {
        q = query(col, where('userid', '==', userid), where('status', '==', statusFilter), orderBy('createdAt', 'desc'))
      } else {
        q = query(col, where('userid', '==', userid), orderBy('createdAt', 'desc'))
      }
      const snap = await getDocs(q)
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      return { items, statusFilter }
    } catch (err) { return rejectWithValue(err.message) }
  }
)

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, updates }, { rejectWithValue }) => {
    try { await updateDoc(doc(db, 'jobApplications', id), updates); return { id, updates } }
    catch (err) { return rejectWithValue(err.message) }
  }
)

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, { rejectWithValue }) => {
    try { await deleteDoc(doc(db, 'jobApplications', id)); return id }
    catch (err) { return rejectWithValue(err.message) }
  }
)

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(createJob.fulfilled, (s,a)=>{ s.items.unshift(a.payload) })
     .addCase(fetchJobs.pending, (s)=>{ s.status='loading'; s.error=null })
     .addCase(fetchJobs.fulfilled, (s,a)=>{ s.status='succeeded'; s.items=a.payload.items; s.lastFilter=a.payload.statusFilter })
     .addCase(fetchJobs.rejected, (s,a)=>{ s.status='failed'; s.error=a.payload })
     .addCase(updateJob.fulfilled, (s,a)=>{
        const i = s.items.findIndex(x=>x.id===a.payload.id)
        if (i>=0) s.items[i] = { ...s.items[i], ...a.payload.updates }
      })
     .addCase(deleteJob.fulfilled, (s,a)=>{ s.items = s.items.filter(x=>x.id!==a.payload) })
  }
})

export default jobsSlice.reducer
