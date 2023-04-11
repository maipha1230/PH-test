import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField, Button, Box, Switch, Typography } from "@mui/material"
import * as yup from "yup";
import { Formik } from "formik";
import { axiosInstance } from '../axios/axiosInstance';
import { UserModel } from '../models/User.model';
import { successAlert } from '../sweetAlert/sweetAlert';



const userSchema = yup.object().shape({
    user_code: yup.string().required("กรุณากรอกรหัสผู้ใช้งาน"),
    user_firstname_th: yup.string().required("กรุณากรอกชื่อไทยผู้ใช้งาน"),
    user_lastname_th: yup.string().required("กรุณากรอกนามสกุลไทยผู้ใช้งาน"),
    user_firstname_en: yup.string().required("กรุณากรอกชื่ออังกฤษผู้ใช้งาน"),
    user_lastname_en: yup.string().required("กรุณากรอกนามสกุลอังกฤษผู้ใช้งาน"),
});

type dialogInput = {
    open: boolean,
    handleDialogClose: () => void,
    userId: number | null
}

export default function UserDialog({ open, handleDialogClose, userId = null }: dialogInput) {
    const [initialUserForm, setInitialUserForm] = useState<UserModel>({
        user_code: "",
        user_firstname_th: "",
        user_lastname_th: "",
        user_firstname_en: "",
        user_lastname_en: "",
    })

    const [userStatus, setUserStatus] = useState<number | null>(null)

    useEffect(() => {
        checkInputForm()
    }, [open, handleDialogClose])

    const closeModal = () => {
        resetFormUser()
        handleDialogClose()
    }

    const resetFormUser = () => {
        setInitialUserForm({
            user_code: "",
            user_firstname_th: "",
            user_lastname_th: "",
            user_firstname_en: "",
            user_lastname_en: "",
        })
    }

    const checkInputForm = async () => {
        if (userId) {
            const res = await axiosInstance.get(`/users/get-user/${userId}`)
            if (res.status == 200) {
                setInitialUserForm({
                    user_code: res.data.user_code,
                    user_firstname_th: res.data.user_firstname_th,
                    user_lastname_th: res.data.user_lastname_th,
                    user_firstname_en: res.data.user_firstname_en,
                    user_lastname_en: res.data.user_lastname_en,
                })
                setUserStatus(res.data.user_status)
            }
        }
    }

    const onsubmitUserForm = async (values: UserModel) => {
        if (userId) {
            const res = await axiosInstance.put(`/users/update-user/${userId}`, {
                user_code: values.user_code,
                user_firstname_th: values.user_firstname_th,
                user_lastname_th: values.user_lastname_th,
                user_firstname_en: values.user_firstname_en,
                user_lastname_en: values.user_lastname_en,
            })
            if (res.status == 201) {
                successAlert(res.data).then(() => {
                    closeModal()
                })
            }
        } else {
            const res = await axiosInstance.post('/users/create-user', {
                user_code: values.user_code,
                user_firstname_th: values.user_firstname_th,
                user_lastname_th: values.user_lastname_th,
                user_firstname_en: values.user_firstname_en,
                user_lastname_en: values.user_lastname_en,
            })
            if (res.status == 201) {
                successAlert(res.data).then(() => {
                    closeModal()
                })
            }
        }
    }

    const handleUserStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setUserStatus(1)
        } else {
            setUserStatus(0)
        }

        changeUserStatus()
    }

    const changeUserStatus = () => {
        if (userId) {
            axiosInstance.put(`/users/change-user-status/${userId}`, {}).then((res) => {
                if (res.status == 200) {
                    successAlert(res.data)
                }
            })
        }
    }

    return (
        <Dialog open={open} onClose={closeModal} fullWidth >
            <DialogTitle>{userId ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งาน"}</DialogTitle>
            <DialogContent>
                <Box display={"flex"} gap={1.5} alignItems={"center"}>
                    <Typography variant='body1'>สถานะผู้ใช้งาน:</Typography>
                    <Switch
                        checked={userStatus == 1 ? true : false}
                        onChange={handleUserStatusChange}
                        inputProps={{ 'aria-label': 'สถานะผู้ใช้งาน' }}
                        disabled={!userId}
                        color={userStatus == 1 ? 'success' : 'primary'}
                    />
                    {userId && <Typography variant='body1' style={{ color: userStatus == 1 ? 'green' : 'gray' }} >{userStatus == 1 ? 'อนุมัติแล้ว' : 'ยังไม่อนุมัติ'}</Typography>}
                </Box>

                <Formik
                    onSubmit={onsubmitUserForm}
                    initialValues={initialUserForm}
                    validationSchema={userSchema}
                    enableReinitialize>
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isValid,
                        dirty
                    }) => (
                        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "1rem" }}>
                            <Box
                                display={"flex"}
                                flexDirection="column"
                                gap={"1rem"}
                                sx={{ width: "100%", }}
                            >
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type={"text"}
                                    label="รหัสผู้ใช้งาน"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.user_code}
                                    name="user_code"
                                    error={!!touched.user_code && !!errors.user_code}
                                    helperText={touched.user_code && errors.user_code}
                                ></TextField>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type={"text"}
                                    label="ชื่อ(ไทย)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.user_firstname_th}
                                    name="user_firstname_th"
                                    error={!!touched.user_firstname_th && !!errors.user_firstname_th}
                                    helperText={touched.user_firstname_th && errors.user_firstname_th}
                                ></TextField>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type={"text"}
                                    label="นามสกุล(ไทย)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.user_lastname_th}
                                    name="user_lastname_th"
                                    error={!!touched.user_lastname_th && !!errors.user_lastname_th}
                                    helperText={touched.user_lastname_th && errors.user_lastname_th}
                                ></TextField>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type={"text"}
                                    label="ชื่อ(อังกฤษ)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.user_firstname_en}
                                    name="user_firstname_en"
                                    error={!!touched.user_firstname_en && !!errors.user_firstname_en}
                                    helperText={touched.user_firstname_en && errors.user_firstname_en}
                                ></TextField>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type={"text"}
                                    label="นามสกุล(อังกฤษ)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.user_lastname_en}
                                    name="user_lastname_en"
                                    error={!!touched.user_lastname_en && !!errors.user_lastname_en}
                                    helperText={touched.user_lastname_en && errors.user_lastname_en}
                                ></TextField>
                                <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"} gap={2}>
                                    <Button type="submit" color="success" variant="contained" disabled={!isValid || !dirty}>
                                        บันทัก
                                    </Button>
                                    <Button color="inherit" variant="contained" onClick={closeModal}>
                                        ยกเลิก
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
