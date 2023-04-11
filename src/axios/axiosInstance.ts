import axios from "axios";
import { waringAlert } from "../sweetAlert/sweetAlert";
export const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
});

axiosInstance.interceptors.request.use(
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

axiosInstance.interceptors.response.use(
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
