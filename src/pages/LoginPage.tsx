import React from "react";
import { Box, Container, Typography, useTheme, TextField, Button } from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import { LoginUserModel } from "../models/LoginUser.model";
import { TextFields } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { successAlert } from "../sweetAlert/sweetAlert";
import axios from "axios";

export default function LoginPage() {
    const theme = useTheme();
    const navigate = useNavigate();


    const initialLoginForm = {
        username: "",
        password: "",
    };

    const loginSchema = yup.object().shape({
        username: yup.string().required("กรุณากรอกชื่อผู้ใช้งาน"),
        password: yup.string().min(8, "กรุณากรอกอย่างน้อย 8 ตัวอักษร").required("กรุณากรอกรหัสผ่าน"),
    });

    const onSubmitLogin = (values: LoginUserModel) => {
        axios.post("/auth/sign-in", {
            username: values.username,
            password: values.password
        }).then((res) => {
            if (res.status == 200) {
                localStorage.setItem("access-token", res.data.access_token)
                successAlert("เข้าสู่ระบบสำเร็จ").then(() => {
                    window.location.href = "/"
                })
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            minHeight={"100vh"}
            sx={{ background: "#e1e2fe" }}
            maxWidth={"100vw"}
        >
            <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                width={{ xs: "100vw", md: "450px" }}
                height={{ xs: "100vh", md: "auto" }}
                py={"2rem"}
                px={"1.5rem"}
                borderRadius={"2rem"}
                bgcolor={"#ffff"}
                gap={"1.5rem"}
                sx={{ backdropFilter: "blur(5px)" }}
            >
                <Typography variant="h4" fontWeight={"bold"} sx={{ color: "#2e5596" }}>
                    เข้าสู่ระบบ
                </Typography>
                <img src="/Untitled-1-01.png" width={"200px"} style={{ objectFit: "cover" }} />
                <Typography variant="h6" sx={{ color: "#2e5596", display: { xs: "none", md: "block" } }} >
                    ระบบจัดการผู้ใช้งาน Principal Healthcare
                </Typography>
                <Box display={{ xs: "flex", md: "none" }} flexDirection={"column"} gap={0.2} alignItems={"center"}>
                    <Typography variant="h6" sx={{ color: "#2e5596" }} >
                        ระบบจัดการผู้ใช้งาน
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#2e5596" }} >
                        Principal Healthcare
                    </Typography>
                </Box>
                <Formik
                    onSubmit={onSubmitLogin}
                    initialValues={initialLoginForm}
                    validationSchema={loginSchema}>
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
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
                                    type={"text"}
                                    label="ชื่อผู้ใช้งาน"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.username}
                                    name="username"
                                    error={!!touched.username && !!errors.username}
                                    helperText={touched.username && errors.username}
                                ></TextField>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type={"password"}
                                    label="รหัสผ่าน"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    name="password"
                                    error={!!touched.password && !!errors.password}
                                    helperText={touched.password && errors.password}
                                ></TextField>
                                <Button type="submit" color="primary" variant="contained">
                                    เข้าสู่ระบบ
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
}
