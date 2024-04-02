import {Alert, AlertProps, Box} from "@mui/material";
import React from "react";

interface FloatingAlertProps extends AlertProps {
    show: boolean;
}

function FloatingAlert(props: FloatingAlertProps) {
    return (
        <Box
            sx={{
                zIndex: 1000,
                position: "fixed",
                top: 20, left: 0, right: 0,
                display: "flex",
                justifyContent: "center",
            }}
        >
            {props.show && <Alert {...props}/>}
        </Box>
    );
}

export default FloatingAlert;