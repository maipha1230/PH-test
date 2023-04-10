import { axiosInstance } from "./axiosInstance";

// export const getHospitals = () => {
//     return axiosInstance.get("/get-hospitals")
// }

export default {
    getHospitals: () => {
        return axiosInstance.get("/get-hospitals")
    }
}