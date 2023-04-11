import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  zIndex: {
    modal: 1050
  },
  palette: {
    primary: {
      main: "#2e5596",
      light: "#10254a",
    },
    secondary: {
      main: "#23c6c8",
      dark: "#1FB2B4",
      contrastText: "#fff",
    },
    info: {
      main: "#1C84C6",
      dark: "#416393",
      contrastText: "#fff",
    },
    success: {
      main: "#6fbf73",
      dark: "#3e8e46",
      contrastText: "#fff",
    },
    warning: {
      main: "#f8AC59",
      dark: "#ffa000",
      contrastText: "#fff",
    },
    // danger: {
    //     main: "#ED5565",
    //     dark: "#D54C5A",
    //     contrastText: "#fff"
    // }
  },
  typography: {
    fontFamily: 'Chakra Petch , sans-serif'
  },
});
