import React, { lazy } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import AdminLayout from '../layout/AdminLayout'
const Dashboard = lazy(() => import("../pages/Dashboard"))
const Hospital = lazy(() => import("../pages/Hospital"))
const User = lazy(() => import("../pages/User"))
const LoginPage = lazy(() => import("../pages/LoginPage"))
const Bank = lazy(() => import("../pages/Bank"))
const Password = lazy(() => import("../pages/Password"))
const NotFound = lazy(() => import("../pages/NotFound"))

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
                    path: "/banks",
                    element: <Bank />
                },
                {
                    path: "/password",
                    element: <Password />
                },
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
                    path: "/", element: <Navigate to="/login" />
                }
            ]
        },
        {
            path: "*", element: <NotFound />
        }
    ])

    return element;
}
