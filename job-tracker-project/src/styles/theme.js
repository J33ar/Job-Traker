import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6dd3fb' },
    secondary: { main: '#a78bfa' },
    background: { default: '#0b1020', paper: 'rgba(20,26,48,0.8)' }
  },
  shape: { borderRadius: 16 }
})

export default theme
