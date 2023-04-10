import React from "react";
import { Box, Container, Typography, useTheme, TextField, Button } from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import { LoginUserModel } from "../models/LoginUser.model";
import { TextFields } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
export default function RegisterPage() {
    const theme = useTheme();
    const navigate = useNavigate();


    const initialLoginForm = {
        username: "",
        password: "",
    };

    const loginSchema = yup.object().shape({
        username: yup.string().required("username is required"),
        password: yup.string().required("password is requried"),
    });

    const onSubmitLogin = (values: LoginUserModel) => {
       console.log(values);
    }

    return (
        <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            minHeight={"100vh"}
            sx={{ background: "#e1e2fe" }}
        >
            <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                width={"450px"}
                py={"2rem"}
                px={"1.5rem"}
                borderRadius={"2rem"}
                bgcolor={"#ffff"}
                gap={"1.5rem"}
            >
                <Typography variant="h4" fontWeight={"bold"} sx={{ color: "#2e5596" }}>
                    Register
                </Typography>
                <Typography variant="h6" fontWeight={"bold"} sx={{ color: "#2e5596" }}>
                    Principal Healthcare User Management
                </Typography>
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
                                sx={{ width: "100%",  }}
                            >
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type={"text"}
                                    label="Username"
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
                                    label="Password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    name="password"
                                    error={!!touched.password && !!errors.password}
                                    helperText={touched.password && errors.password}
                                ></TextField>
                                <Box
                                    display={"flex"}
                                    justifyContent="center"
                                    alignItems={"center"}
                                    gap={"1rem"}
                                >
                                    <Button type="submit" color="primary" variant="contained" onClick={onSubmitLogin} >
                                        Register
                                    </Button>
                                    <Button type="submit" color="secondary"  variant="contained" onClick={() => navigate("/login")}>
                                        Login 
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
}
