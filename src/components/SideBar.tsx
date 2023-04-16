import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PasswordIcon from '@mui/icons-material/Password';
import { useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';

const drawerWidth = 220;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

// const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
//     ({ theme, open }) => ({
//         width: drawerWidth,
//         zIndex: 500,
//         flexShrink: 0,
//         whiteSpace: 'nowrap',
//         boxSizing: 'border-box',
//         ...(open && {
//             ...openedMixin(theme),
//             '& .MuiDrawer-paper': openedMixin(theme),
//         }),
//         ...(!open && {
//             ...closedMixin(theme),
//             '& .MuiDrawer-paper': closedMixin(theme),
//         }),
//     }),
// );



type MenuProps = {
    open: boolean;
    handleDrawerClose: () => void;
};

export default function SideBar({ open, handleDrawerClose }: MenuProps) {
    const theme = useTheme();
    const navigate = useNavigate();
    const menu = [
        {
            title: "แดชบอร์ด",
            to: "/dashboard",
            icon: <DashboardIcon />
        },
        {
            title: "โรงพยาบาล",
            to: "/hospitals",
            icon: <LocalHospitalIcon />
        },
        {
            title: "ผู้ใช้งาน",
            to: "/users",
            icon: <PeopleOutlinedIcon />
        },
        {
            title: "ธนาคาร",
            to: "/banks",
            icon: <AccountBalanceIcon />
        },
        {
            title: "แก้ไขรหัสผ่าน",
            to: "/password",
            icon: <PasswordIcon />
        }
    ]

    const drawer = (
        <List>
            {menu.map((m, index) => (
                <ListItem key={index} disablePadding sx={{ display: 'block' }} onClick={() => onMenuClick(m.to)}>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            {m.icon}
                        </ListItemIcon>
                        <ListItemText primary={m.title} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )

    const onMenuClick = (path: string) => {
        navigate(path)
    }

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            anchor="left"
            open={open}
            ModalProps={{
                keepMounted: true,// Better open performance on mobile.
                onBackdropClick: handleDrawerClose
            }}
           
        >
            <DrawerHeader>
                <img src="/PH-MAIN.png" width={"120px"} style={{ marginRight: "30px" }} />
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            {drawer}
            <Divider />
        </Drawer>

    );
}
