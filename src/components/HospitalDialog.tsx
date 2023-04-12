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
import axios from 'axios';



const hospitalSchema = yup.object().shape({
    hospital_code: yup.string().required("กรุณากรอกรหัสโรงพยาบาล"),
    hospital_name_th: yup.string().required("กรุณากรอกชื่อไทยโรงพยาบาล"),
    hospital_name_en: yup.string().required("กรุณากรอกชื่ออังกฤษรหัสโรงพยาบาล"),
});

type dialogInput = {
    open: boolean,
    handleDialogClose: () => void,
    hospitalId: number | null
}

export default function HospitalDialog({ open, handleDialogClose, hospitalId = null }: dialogInput) {
    const [initialHospitalForm, setInitialHospitalForm] = useState<HospitalModel>({
        hospital_code: "",
        hospital_name_th: "",
        hospital_name_en: "",
    })

    useEffect(() => {
        checkInputForm()
    }, [open, handleDialogClose])

    const closeModal = () => {
        resetFormHospital()
        handleDialogClose()
    }

    const resetFormHospital = () => {
        setInitialHospitalForm({
            hospital_code: "",
            hospital_name_th: "",
            hospital_name_en: "",
        })
    }

    const checkInputForm = async () => {
        if (hospitalId) {
            const res = await axios.get(`/hospitals/get-hospital/${hospitalId}`)
            if (res.status == 200) {
                setInitialHospitalForm({
                    hospital_code: res.data.hospital_code,
                    hospital_name_th: res.data.hospital_name_th,
                    hospital_name_en: res.data.hospital_name_en,
                })
            }
        }
    }

    const onsubmitHospitalForm = async (values: HospitalModel) => {
        if (hospitalId) {
            const res = await axios.put(`/hospitals/update-hospital/${hospitalId}`, {
                hospital_code: values.hospital_code,
                hospital_name_th: values.hospital_name_th,
                hospital_name_en: values.hospital_name_en,
            })
            if (res.status == 201) {
                successAlert(res.data).then(() => {
                    closeModal()
                })
            }
        } else {
            const res = await axios.post('/hospitals/create-hospital', {
                hospital_code: values.hospital_code,
                hospital_name_th: values.hospital_name_th,
                hospital_name_en: values.hospital_name_en,
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
            <DialogTitle>{hospitalId ? "แก้ไขโรงพยาบาล" : "เพิ่มโรงพยาบาล"}</DialogTitle>
            <DialogContent>
                <Formik
                    onSubmit={onsubmitHospitalForm}
                    initialValues={initialHospitalForm}
                    validationSchema={hospitalSchema}
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
                                    label="รหัสโรงพยาบาล"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.hospital_code}
                                    name="hospital_code"
                                    error={!!touched.hospital_code && !!errors.hospital_code}
                                    helperText={touched.hospital_code && errors.hospital_code}
                                ></TextField>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type={"text"}
                                    label="ชื่อโรงพยาบาล(ไทย)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.hospital_name_th}
                                    name="hospital_name_th"
                                    error={!!touched.hospital_name_th && !!errors.hospital_name_th}
                                    helperText={touched.hospital_name_th && errors.hospital_name_th}
                                ></TextField>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type={"text"}
                                    label="ชื่อโรงพยาบาล(อังกฤษ)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.hospital_name_en}
                                    name="hospital_name_en"
                                    error={!!touched.hospital_name_en && !!errors.hospital_name_en}
                                    helperText={touched.hospital_name_en && errors.hospital_name_en}
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
