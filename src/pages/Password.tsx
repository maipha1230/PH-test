import React, { useState } from "react";
import { Box, Container, Typography, useTheme, TextField, Button, useMediaQuery } from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import { LoginUserModel } from "../models/LoginUser.model";
import { TextFields } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { successAlert, waringAlert } from "../sweetAlert/sweetAlert";
import axios from "axios";

type PasswordModel = {
    old_pass: string,
    new_pass: string,
    new_pass2: string
}

const initialPasswordForm = {
    old_pass: "",
    new_pass: "",
    new_pass2: ""
};

const passwordSchema = yup.object().shape({
    old_pass: yup.string().min(8, "กรุณากรอกอย่างน้อย 8 ตัวอักษร").required("กรุณากรอกรหัสผ่านเดิม"),
    new_pass: yup.string().min(8, "กรุณากรอกอย่างน้อย 8 ตัวอักษร").required("กรุณากรอกรหัสผ่านใหม่"),
    new_pass2: yup.string().min(8, "กรุณากรอกอย่างน้อย 8 ตัวอักษร").required("กรุณากรอกยืนยันรหัสผ่านใหม่"),
});


export default function Password() {
    const theme = useTheme();
    const navigate = useNavigate();

    const onSubmitPassword = (values: PasswordModel) => {
        if (values.new_pass != values.new_pass2) {
            waringAlert("รหัสผ่านใหม่ไม่ตรงกัน")
        } else if (values.new_pass == values.old_pass) {
            waringAlert("รหัสผ่านเดิมและรหัสผ่านใหม่ไม่ควรซ้ำกัน")
        } else {
            axios.put("/auth/change-password", {
                old_pass: values.old_pass,
                new_pass: values.new_pass
            }).then((res) => {
                if (res.status == 200) {
                    successAlert(res.data).then(() => window.location.href = "/password")

                }
            })
        }
    }

    return (
        <Box display={"flex"} flexDirection={"column"} p={2} gap={2} width={useMediaQuery(theme.breakpoints.up("lg")) ? "50%" : "100%"} >
            <Typography variant="h5" fontWeight={"bold"} sx={{ color: "#2e5596" }}>
                แก้ไขรหัสผ่าน
            </Typography>
            <Formik
                onSubmit={onSubmitPassword}
                initialValues={initialPasswordForm}
                validationSchema={passwordSchema}
                enableReinitialize
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isValid,
                }) => (
                    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <Box
                            display={"flex"}
                            flexDirection="column"
                            gap={"1rem"}
                            sx={{ width: "100%", }}
                        >
                            <TextField
                                fullWidth
                                variant="outlined"
                                type={"password"}
                                label="รหัสผ่านเดิม"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.old_pass}
                                name="old_pass"
                                error={!!touched.old_pass && !!errors.old_pass}
                                helperText={touched.old_pass && errors.old_pass}
                            ></TextField>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type={"password"}
                                label="รหัสผ่านใหม่"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.new_pass}
                                name="new_pass"
                                error={!!touched.new_pass && !!errors.new_pass}
                                helperText={touched.new_pass && errors.new_pass}
                            ></TextField>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type={"password"}
                                label="ยืนยันรหัสผ่านใหม่"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.new_pass2}
                                name="new_pass2"
                                error={!!touched.new_pass2 && !!errors.new_pass2}
                                helperText={touched.new_pass2 && errors.new_pass2}
                            ></TextField>
                            <Button type="submit" color="primary" variant="contained" disabled={(!isValid)}>
                                แก้ไขรหัสผ่าน
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>

    );
}
