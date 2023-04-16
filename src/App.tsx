import { ThemeProvider } from '@emotion/react'
import { Suspense, useRef, useState } from 'react'
import { theme } from './theme'
import { CssBaseline } from '@mui/material'
import Routes from './routes/Routes'
import Loader from './components/Loader'
import { waringAlert } from './sweetAlert/sweetAlert'
import axios from 'axios'
import LoadingModal from './components/LoadingModalRef'

function App() {
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3001/api"
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      if (error.response.status === 401) {
        localStorage.removeItem("access-token");
        waringAlert(error.response.data).then(() => {
          window.location.href = "/";
        });
      } else if (error.response.status === 400) {
        waringAlert(error.response.data);
      }
    }
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app" style={{ maxWidth: "100vw", maxHeight: "100vh" }}>
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
