import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField, Button, Box, Switch, Typography, Chip, Stack, Grid, Paper, Pagination, Tooltip } from "@mui/material"
import * as yup from "yup";
import { Formik } from "formik";
import { UserModel } from '../models/User.model';
import { ensureAddUserHospital, ensureRemoveUserHospital, successAlert } from '../sweetAlert/sweetAlert';
import { HospitalModel } from '../models/Hospital.model';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

type dialogInput = {
    open: boolean,
    handleDialogClose: () => void,
    hospitalId: number | null
}

type UserHospitalModel = {
    hospital_id?: number,
    hospital_name_th?: string,
    hospital_name_en?: string,
}



export default function HospitalUserDialog({ open, handleDialogClose, hospitalId = null }: dialogInput) {
    const [userHospital, setUserHospital] = useState<UserModel[] | null>([])
    const [allPage, setAllPage] = useState<number | null>(null)
    const [page, setPage] = useState<number>(0)
    const limit = 12;
    const navigate = useNavigate();

    useEffect(() => {
        getUserInHospital();
    }, [open, handleDialogClose, page])

    const getUserInHospital = async () => {
        if (hospitalId) {
            const res = await axios.get(`/hospitals/get-user-in-hospital/${hospitalId}/${limit}/${page}`)
            if (res.status == 200) {
                const count = res.data.count
                setAllPage(count > limit ? Math.ceil(count / limit) : null)
                const user_hospital = res.data.user_hospital
                let temp: UserModel[] = []
                for (let uh of user_hospital) {
                    temp.push(uh.user)
                }
                setUserHospital(temp)
            }
        }
    }

    const closeModal = () => {
        hospitalId = null
        handleDialogClose()
    }

    const onPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage((value - 1) * limit)
    }


    const onUserClick = (user_id?: number) => {
        navigate(`/users?user_id=${user_id}`)
        handleDialogClose()
    }

    return (
        <Dialog open={open} onClose={closeModal} fullWidth maxWidth={"xl"} sx={{ height: "80vh" }} >
            <DialogTitle>{"พนักงานในโรงพยาบาล"}</DialogTitle>
            <DialogContent>
                <Box p={{xs: 0, md: 3}} display={"flex"} flexDirection={"column"} gap={3} justifyContent={"center"} alignItems={"center"}>
                    <Grid container spacing={2}>
                        {userHospital?.map((item, index) => (
                            <Grid key={index} item xs={12} md={6} lg={4}>
                                <Tooltip title="ไปยังโปรไฟล์ผู้ใช้">
                                    <Paper variant="outlined" 
                                        onClick={() => onUserClick(item.user_id)}    
                                        sx={{ display: "flex", flexDirection: "column", gap: 1, position: "relative", p: 2, "&:hover": { scale: "102%", cursor: "pointer", borderColor: "#23c6c8" } }}>
                                        <Typography>รหัสพนักงาน: {item.user_code}</Typography>
                                        <Typography>ชื่อ-นามสกุล(ไทย): {item.user_firstname_th} {item.user_lastname_th}</Typography>
                                        <Typography>ชื่อ-นามสกุล(อังกฤษ): {item.user_firstname_en} {item.user_lastname_en}</Typography>
                                    </Paper>
                                </Tooltip>

                            </Grid>
                        ))}
                    </Grid>
                    {allPage && <Pagination count={allPage} defaultPage={1} color="primary" onChange={onPageChange} />}
                </Box>
            </DialogContent>
        </Dialog>
    )
}
