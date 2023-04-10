import axios from "axios";
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001/api'
})


axiosInstance.interceptors.request.use(
    config => {
        const token =  localStorage.getItem('access-token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}` 
        }
        return config;
    },
    error => {
        Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        if (error.response.status === 401) {
            localStorage.removeItem("access-token")
            // window.location.href = "/"
        }
    }
)