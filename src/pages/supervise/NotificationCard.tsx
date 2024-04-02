import React, {useState} from "react";
import {Card, CardContent, CardHeader, Chip} from "@mui/material";
import Typography from "@mui/material/Typography";

interface NotificationCardProps {
    studentName: string;
    message: string;
}

function NotificationCard({studentName, message}: NotificationCardProps) {
    const [show, setShow] = useState(true);

    const handleClose = () => {
        setShow(false);
    };

    return (
        <Card
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
            }}
        >
            {show && (
                <>
                    <CardHeader title={studentName}/>
                    <CardContent>
                        <Typography variant={"body1"}>{message}</Typography>
                        <Chip
                            sx={{px: 1}}
                            variant="outlined"
                            size="small"
                            label="Close"
                            onClick={handleClose}
                        />
                    </CardContent>
                </>
            )}
        </Card>
    );
}

export default NotificationCard;