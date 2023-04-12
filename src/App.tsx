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
  const loadingModalRef = useRef<any>(null);
  axios.defaults.baseURL = "http://localhost:3001/api"
  axios.interceptors.request.use(
    (config) => {
      loadingModalRef.current.setOpen(true)
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
      loadingModalRef.current.setOpen(false)
      return response;
    },
    async function (error) {
      loadingModalRef.current.setOpen(false)
      if (error.response.status === 401) {
        localStorage.removeItem("access-token");
        waringAlert(error.response.data).then(() => {
          window.location.href = "/";
        });
      } else if (error.response.status === 400) {
        loadingModalRef.current.setOpen(false)
        waringAlert(error.response.data);
      }
    }
  );

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
        <LoadingModal ref={loadingModalRef} />
      </div>
    </ThemeProvider>

  )
}

export default App
