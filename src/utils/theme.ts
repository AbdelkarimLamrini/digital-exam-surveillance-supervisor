import {createTheme} from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
    },
    shape: {
        borderRadius: 0,
    },
    spacing: 8,
});