import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField, Button, Box, Switch, Typography, Chip, Stack, Paper, Select, MenuItem, FormHelperText } from "@mui/material"
import * as yup from "yup";
import { Formik } from "formik";
import { ensureRemoveUserBankAccount, successAlert } from '../sweetAlert/sweetAlert';
import axios from 'axios';
import { BankModel } from '../models/Bank.model';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';


const userBankSchema = yup.object().shape({
    bank_id: yup.number().required("กรุณาเลือกธนาคาร"),
    user_bank_code: yup.number().min(10, "กรุณากรอกอย่างน้อย 10 ตัว").required("กรุณากรอกเลขบัญชีธนาคาร"),
    user_bank_name: yup.string().required("กรุณากรอกชื่อบัญชีธนาคาร"),
});

const initalUserBankForm = {
    bank_id: 1,
    user_bank_code: "",
    user_bank_name: ""
}

type dialogInput = {
    open: boolean,
    handleDialogClose: () => void,
    userId: number | null
}

type UserBankInput = {
    bank_id: number,
    user_bank_code: string,
    user_bank_name: string
}

type UserBankModel = {
    user_bank_id?: number,
    bank_name_th?: string,
    bank_name_en?: string,
    user_bank_code?: string,
    user_bank_name?: string
}




export default function UserBankDialog({ open, handleDialogClose, userId = null }: dialogInput) {

    const [userBank, setUserBank] = useState<UserBankModel[] | null>([])
    const [addUserBank, setAddUserBank] = useState<boolean>(false)
    const [banks, setBanks] = useState<BankModel[]>([])
    useEffect(() => {
        getUserBanks()
        getBanks()
    }, [open, handleDialogClose])

    const getUserBanks = async () => {
        const res = await axios.get(`/users/get-user-bank-accounts/${userId}`)
        if (res.status == 200) {
            let user_bank = res.data
            let temp: UserBankModel[] = []

            for (let ub of user_bank) {
                temp.push({
                    user_bank_id: ub.user_bank_id,
                    user_bank_code: ub.user_bank_code,
                    user_bank_name: ub.user_bank_name,
                    bank_name_en: ub.bank.bank_name_en,
                    bank_name_th: ub.bank.bank_name_th,
                })
            }
            setUserBank(temp)
        }
    }

    const getBanks = async () => {
        const res = await axios.get("/banks/get-banks")
        if (res.status == 200) {
            setBanks(res.data)
        }
    }

    const onUserBankCodePress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const keyCode = event.which || event.keyCode;
        const keyValue = String.fromCharCode(keyCode);

        if (keyCode === 8 || keyCode === 46) { // allow backspace and delete keys
            return;
        }
        if (keyCode < 48 || keyCode > 57) { // allow only numeric keys
            event.preventDefault();
        }
    }

    const closeModal = () => {
        userId = null
        handleDialogClose()
    }

    const onAddUserBankClick = (state: boolean) => {
        setAddUserBank(!state)
    }

    const onSubmitUserBankForm = (values: UserBankInput) => {
        axios.post(`/users/create-user-bank-account/${userId}`, {
            bank_id: values.bank_id,
            user_bank_code: values.user_bank_code,
            user_bank_name: values.user_bank_name
        }).then((res) => {
            if (res.status == 201) {
                successAlert(res.data).then(() => {
                    getUserBanks()
                    setAddUserBank(false)
                })
            }
        })
    }

    const onRemoveUserBankClick = (user_bank_id?: number) => {
        ensureRemoveUserBankAccount().then((check) => {
            if (check.isConfirmed) {
                axios.delete(`/users/remove-user-bank-account/${user_bank_id}`).then((res) => {
                    if (res.status == 200) {
                        successAlert(res.data)
                        getUserBanks()
                    }
                })
            }
        })
    }

    return (
        <Dialog open={open} onClose={closeModal} fullWidth >
            <DialogTitle>{"สมุดบัญชีผู้ใช้งาน"}</DialogTitle>
            <DialogContent>
                <Box width={"100%"} display={"flex"} flexDirection={"column"} gap={2} justifyContent={"center"}>
                    {addUserBank == false && (
                        <Box width={"50%"}>
                            <Button variant='contained' color='success' onClick={() => onAddUserBankClick(addUserBank)}>เพิ่มสมุดบัญชีของผู้ใช้</Button>
                        </Box>)}
                    {addUserBank && (
                        <Box>
                            <Formik
                                onSubmit={onSubmitUserBankForm}
                                initialValues={initalUserBankForm}
                                validationSchema={userBankSchema}
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
                                            <Select
                                                fullWidth
                                                variant="outlined"
                                                label="ธนาคาร"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.bank_id}
                                                name="bank_id"
                                                error={!!touched.bank_id && !!errors.bank_id}
                                            >

                                                {banks.map((item, index) => (
                                                    <MenuItem key={index} value={item.bank_id}>{item.bank_name_th} {item.bank_name_en}</MenuItem>
                                                ))}
                                            </Select>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                type={"text"}
                                                onKeyDown={onUserBankCodePress}
                                                label="เลขบัญชี"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.user_bank_code}
                                                name="user_bank_code"
                                                error={!!touched.user_bank_code && !!errors.user_bank_code}
                                                helperText={touched.user_bank_code && errors.user_bank_code}
                                            ></TextField>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                type={"text"}
                                                label="ชื่อบัญชี"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.user_bank_name}
                                                name="user_bank_name"
                                                error={!!touched.user_bank_name && !!errors.user_bank_name}
                                                helperText={touched.user_bank_name && errors.user_bank_name}
                                            ></TextField>
                                            <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"} gap={2}>
                                                <Button type="submit" color="success" variant="contained" disabled={!isValid || !dirty}>
                                                    เพิ่มสมุดบัญชี
                                                </Button>
                                                <Button color="inherit" variant="contained" onClick={() => setAddUserBank(false)}>
                                                    ยกเลิก
                                                </Button>
                                            </Box>
                                        </Box>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    )}
                    <Stack direction={"column"} spacing={1}>
                        {userBank?.map((item, index) => (
                            <Paper key={index} elevation={2} sx={{ display: "flex", flexDirection: "column", p: 2, position: 'relative' }} >
                                <Tooltip title="ลบบัญชีนี้" sx={{ position: "absolute", top: 1, right: 1 }}>
                                    <IconButton onClick={() => onRemoveUserBankClick(item.user_bank_id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                                <Typography>ธนาคาร: {item.bank_name_th} {item.bank_name_en}</Typography>
                                <Typography>เลขบัญชี: {item.user_bank_code}</Typography>
                                <Typography>ชื่อบัญชี: {item.user_bank_name}</Typography>
                            </Paper>
                        ))
                        }
                    </Stack>
                </Box>

            </DialogContent>
        </Dialog >
    )
}
