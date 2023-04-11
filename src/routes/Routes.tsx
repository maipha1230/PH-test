import React, { lazy } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import AdminLayout from '../layout/AdminLayout'
const Dashboard = lazy(() => import("../pages/Dashboard"))
const Hospital = lazy(() => import("../pages/Hospital"))
const User = lazy(() => import("../pages/User"))
const BankAccount = lazy(() => import("../pages/BankAccount"))
const LoginPage = lazy(() => import("../pages/LoginPage"))
const RegisterPage = lazy(() => import("../pages/RegisterPage"))
const Bank = lazy(() => import("../pages/Bank"))

const useAuth = () => {
    let token = localStorage.getItem("access-token")
    if (!token) {
        return false
    }
    return true
}

export default function Routes() {
    let isLoggedIn = useAuth();
    let element = useRoutes([
        {
            path: "/",
            element: isLoggedIn ? <AdminLayout /> : <Navigate to={"/login"} />,
            children: [
                {
                    path: "/",
                    element: <Navigate to={"/dashboard"} />
                },
                {
                    path: "dashboard",
                    element: <Dashboard />
                },
                {
                    path: "hospitals",
                    element: <Hospital />
                },
                {
                    path: "users",
                    element: <User />
                },
                {
                    path: "user-bank-account",
                    element: <BankAccount />
                },
                {
                    path: "/banks",
                    element: <Bank />
                }
            ]
        },
        {
            path: "/",
            element: !isLoggedIn ? <Outlet /> : <Navigate to={"/"} />,
            children: [
                {
                    path: "login", element: <LoginPage />,
                },
                {
                    path: "register", element: <RegisterPage />
                },
                {
                    path: "/", element: <Navigate to="/login" />
                }
            ]
        }
    ])

    return element;
}
