import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
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
    fontFamily: "Kanit, sans-serif",
  },
});

export const colors = () => ({
    grey: {
      100: "#141414",
      200: "#292929",
      300: "#3d3d3d",
      400: "#525252",
      500: "#666666",
      600: "#858585",
      700: "#a3a3a3",
      800: "#c2c2c2",
      900: "#e0e0e0",
    },
    primary: {
        main: "#2e5596"
    },
    greenAccent: {
      100: "#0f2922",
      200: "#1e5245",
      300: "#2e7c67",
      400: "#3da58a",
      500: "#4cceac",
      600: "#70d8bd",
      700: "#94e2cd",
      800: "#b7ebde",
      900: "#dbf5ee",
    },
    redAccent: {
      100: "#2c100f",
      200: "#58201e",
      300: "#832f2c",
      400: "#af3f3b",
      500: "#db4f4a",
      600: "#e2726e",
      700: "#e99592",
      800: "#f1b9b7",
      900: "#f8dcdb",
    },
    blueAccent: {
      100: "#151632",
      200: "#2a2d64",
      300: "#3e4396",
      400: "#535ac8",
      500: "#6870fa",
      600: "#868dfb",
      700: "#a4a9fc",
      800: "#c3c6fd",
      900: "#e1e2fe",
    },
});
