import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {  Box, Chip } from "@mui/material"
import { ensureAddUserHospital, ensureRemoveUserHospital, successAlert } from '../sweetAlert/sweetAlert';
import { HospitalModel } from '../models/Hospital.model';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type dialogInput = {
    open: boolean,
    handleDialogClose: () => void,
    userId: number | null
}

type UserHospitalModel = {
    hospital_id?: number,
    hospital_name_th?: string,
    hospital_name_en?: string,
    isWorking?: boolean
}



export default function UserHospitalDialog({ open, handleDialogClose, userId = null }: dialogInput) {

    const [userHospital, setUserHospital] = useState<UserHospitalModel[] | null>([])
    const navigate = useNavigate();

    useEffect(() => {
        getUserHospital();
    }, [open, handleDialogClose])

    const getUserHospital = async () => {
        if (userId) {
            const res = await axios.get(`/users/get-user-hospital/${userId}`)
            if (res.status == 200) {
                const user_hospital = res.data.user_hospital
                const hospitals: HospitalModel[] = res.data.hospitals
                let temp: UserHospitalModel[] = []
                for (let hospital of hospitals) {
                    temp.push({
                        hospital_id: hospital.hospital_id,
                        hospital_name_th: hospital.hospital_name_th,
                        hospital_name_en: hospital.hospital_name_en,
                        isWorking: false
                    })
                }
                for (let t of temp) {
                    for (let uh of user_hospital) {
                        if (t.hospital_id == uh.hospital_id) {
                            t.isWorking = true
                        }
                    }
                }
                setUserHospital(temp)
            }
        }
    }

    const closeModal = () => {
        userId = null
        handleDialogClose()
        navigate("/users")
    }

    const onHospitalClick = (isWorking: boolean, hospital_id?: number) => {
        if (isWorking == true) {
            ensureAddUserHospital().then((check) => {
                if (check.isConfirmed) {
                    axios.post(`/users/add-remove-user-hospital/${userId}/${hospital_id}`, {
                        isWorking: isWorking
                    }).then((res) => {
                        if (res.status == 200) {
                            successAlert(res.data).then(() => {
                                getUserHospital()
                            })
                        }
                    })
                }
            })
        } else {
            ensureRemoveUserHospital().then((check) => {
                if (check.isConfirmed) {
                    axios.post(`/users/add-remove-user-hospital/${userId}/${hospital_id}`, {
                        isWorking: isWorking
                    }).then((res) => {
                        if (res.status == 200) {
                            successAlert(res.data).then(() => {
                                getUserHospital()
                            })
                        }
                    })
                }
            })
        }


    }

    return (
        <Dialog open={open} onClose={closeModal} fullWidth >
            <DialogTitle>{"โรงพยาบาลที่ผู้ใช้งานบรรจุ"}</DialogTitle>
            <DialogContent>
                <Box display={"flex"} flexDirection={"column"} p={1.5} gap={1} justifyContent={"center"}>
                    {userHospital?.map((item, index) => (
                        <Chip key={index}
                            label={`${item.hospital_name_th} | ${item.hospital_name_en}`}
                            variant={item.isWorking ? 'filled' : "outlined"}
                            color='primary'
                            sx={{ cursor: "pointer" }}
                            onClick={() => onHospitalClick(!item.isWorking, item.hospital_id)}
                        ></Chip>
                    ))}
                </Box>
            </DialogContent>
        </Dialog>
    )
}
