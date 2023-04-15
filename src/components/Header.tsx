import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Tooltip } from '@mui/material';
import LogoutIcon from "@mui/icons-material/Logout";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useEffect, useState } from 'react';
import { logoutAlert } from '../sweetAlert/sweetAlert';

const drawerWidth = 220;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  // zIndex: theme.zIndex.drawer + 1,
  zIndex: 990,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth - 20,
    width: `calc(100% - ${drawerWidth}px)`,
    zIndex: 990,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


type HeaderProps = {
  open: boolean;
  handleDrawerOpen: () => void;
};

export default function Header({ open, handleDrawerOpen }: HeaderProps) {
  const theme = useTheme();
  const [date, setDate] = useState<Date>(new Date())

  useEffect(() => {
    setInterval(() => {
      setDate(new Date())
    }, 1000)
  }, [])

  const onLogoutClick = () => {
    logoutAlert().then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem("access-token")
        window.location.href = "/"
      }
    })
  }

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box display={"flex"} justifyContent="space-between" p={1} width={"100%"} sx={{ justifyContent: {xs: "flex-end", md: "space-between"} }} >
          <Box display={"flex"} gap="1.5rem" alignItems="center" sx={{ display: { xs: 'none', md: "flex" } }}>
            <CalendarMonthIcon />
            <Typography variant="subtitle1">
              {date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Typography>
            <AccessTimeIcon />
            <Typography variant="subtitle1">
              {date.toLocaleString("en-Us", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false,
              })}
            </Typography>
          </Box>
          <Box display={"flex"}>
            <Tooltip title="Log Out">
              <IconButton onClick={onLogoutClick}>
                <LogoutIcon sx={{ color: "#ffff" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
