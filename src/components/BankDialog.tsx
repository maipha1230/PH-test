import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField, Button, Box } from "@mui/material"
import { HospitalModel } from '../models/Hospital.model';
import * as yup from "yup";
import { Formik } from "formik";
import { successAlert } from '../sweetAlert/sweetAlert';
import { BankModel } from '../models/Bank.model';
import axios from 'axios';



const bankSchema = yup.object().shape({
    bank_name_th: yup.string().required("กรุณากรอกชื่อไทยของธนาคาร"),
    bank_name_en: yup.string().required("กรุณากรอกชื่ออังกฤษของธนาคาร"),
});

type dialogInput = {
    open: boolean,
    handleDialogClose: () => void,
    bankId: number | null
}

export default function BankDialog({ open, handleDialogClose, bankId = null }: dialogInput) {
    const [initialBankForm, setInitialBankForm] = useState<BankModel>({
        bank_name_th: "",
        bank_name_en: "",
    })

    useEffect(() => {
        checkInputForm()
    }, [open, handleDialogClose])

    const closeModal = () => {
        resetFormBank()
        handleDialogClose()
    }

    const resetFormBank = () => {
        setInitialBankForm({
            bank_name_th: "",
            bank_name_en: "",
        })
    }

    const checkInputForm = async () => {
        if (bankId) {
            const res = await axios.get(`/banks/get-bank/${bankId}`)
            if (res.status == 200) {
                setInitialBankForm({
                    bank_name_th: res.data.bank_name_th,
                    bank_name_en: res.data.bank_name_en,
                })
            }
        }
    }

    const onsubmitHospitalForm = async (values: BankModel) => {
        if (bankId) {
            const res = await axios.put(`/banks/update-bank/${bankId}`, {
                bank_name_th: values.bank_name_th,
                bank_name_en: values.bank_name_en,
            })
            if (res.status == 201) {
                successAlert(res.data).then(() => {
                    closeModal()
                })
            }
        } else {
            const res = await axios.post('/banks/create-bank', {
                bank_name_th: values.bank_name_th,
                bank_name_en: values.bank_name_en,
            })
            if (res.status == 201) {
                successAlert(res.data).then(() => {
                    closeModal()
                })
            }
        }
    }

    return (
        <Dialog open={open} onClose={closeModal} fullWidth >
            <DialogTitle>{bankId ? "แก้ไขธนาคาร" : "เพิ่มธนาคาร"}</DialogTitle>
            <DialogContent>
                <Formik
                    onSubmit={onsubmitHospitalForm}
                    initialValues={initialBankForm}
                    validationSchema={bankSchema}
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
                                    label="ชื่อธนาคาร(ไทย)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.bank_name_th}
                                    name="bank_name_th"
                                    error={!!touched.bank_name_th && !!errors.bank_name_th}
                                    helperText={touched.bank_name_th && errors.bank_name_th}
                                ></TextField>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type={"text"}
                                    label="ชื่อธนาคาร(อังกฤษ)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.bank_name_en}
                                    name="bank_name_en"
                                    error={!!touched.bank_name_en && !!errors.bank_name_en}
                                    helperText={touched.bank_name_en && errors.bank_name_en}
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
