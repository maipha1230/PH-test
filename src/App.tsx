import { ThemeProvider } from '@emotion/react'
import { Suspense, useState } from 'react'
import { theme } from './theme'
import {  CssBaseline } from '@mui/material'
import Routes from './routes/Routes'
import Loader from './components/Loader'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app" style={{ minWidth: "100vh", height: "100%", width: "100%" }}>
        <Suspense
          fallback={
            <Loader />
          }
        >
          <Routes />
        </Suspense>
      </div>
    </ThemeProvider>

  )
}

export default App
