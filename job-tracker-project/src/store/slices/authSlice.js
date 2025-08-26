import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { auth, db } from '../../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const initialState = {
  user: null,
  status: 'idle',
  error: null
}

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      const uid = cred.user.uid
      const userData = { name, email, role: 'user', createdAt: Date.now() }
      await setDoc(doc(db, 'users', uid), userData)
      return { uid, ...userData }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const uid = cred.user.uid
      const snap = await getDoc(doc(db, 'users', uid))
      const profile = snap.exists() ? snap.data() : { name: '', email: cred.user.email, role: 'user' }
      return { uid, ...profile }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await signOut(auth); return true
})

export const listenToAuth = () => (dispatch) => {
  const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) { dispatch(authSlice.actions.setUser(null)); return }
    const uid = firebaseUser.uid
    const snap = await getDoc(doc(db, 'users', uid))
    const profile = snap.exists() ? snap.data() : { name: '', email: firebaseUser.email, role: 'user' }
    dispatch(authSlice.actions.setUser({ uid, ...profile }))
  })
  return unsub
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { setUser(state, action) { state.user = action.payload } },
  extraReducers: (b) => {
    b.addCase(registerUser.pending, (s)=>{s.status='loading'; s.error=null})
     .addCase(registerUser.fulfilled, (s,a)=>{s.status='succeeded'; s.user=a.payload})
     .addCase(registerUser.rejected, (s,a)=>{s.status='failed'; s.error=a.payload})
     .addCase(loginUser.pending, (s)=>{s.status='loading'; s.error=null})
     .addCase(loginUser.fulfilled, (s,a)=>{s.status='succeeded'; s.user=a.payload})
     .addCase(loginUser.rejected, (s,a)=>{s.status='failed'; s.error=a.payload})
     .addCase(logoutUser.fulfilled, (s)=>{s.user=null; s.status='idle'; s.error=null})
  }
})

export default authSlice.reducer
