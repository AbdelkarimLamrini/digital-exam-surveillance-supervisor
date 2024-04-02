import {Box, Card, CardContent, CardHeader, Chip} from "@mui/material";
import {
    RadioButtonCheckedSharp,
    SignalCellular2BarRounded,
    SignalCellular4BarRounded,
    SignalCellularNodataRounded,
    SignalCellularOffRounded
} from "@mui/icons-material";
import React, {ReactElement} from "react";
import {ConnectionStatus, StudentParticipation} from "../../models/StudentParticipationDto";


type ConnectionStatusColor = "success" | "error" | "warning";
const connectionStatusColor: Record<ConnectionStatus, ConnectionStatusColor> = {
    [ConnectionStatus.CONNECTED]: "success",
    [ConnectionStatus.DISCONNECTED]: "error",
    [ConnectionStatus.CONNECTING]: "warning",
    [ConnectionStatus.TERMINATED]: "error",
};
const connectionStatusIcon: Record<ConnectionStatus, ReactElement> = {
    [ConnectionStatus.CONNECTED]: <SignalCellular4BarRounded style={{fontSize: 15}}/>,
    [ConnectionStatus.DISCONNECTED]: <SignalCellularOffRounded style={{fontSize: 15}}/>,
    [ConnectionStatus.CONNECTING]: <SignalCellular2BarRounded style={{fontSize: 15}}/>,
    [ConnectionStatus.TERMINATED]: <SignalCellularNodataRounded style={{fontSize: 15}}/>,
};

interface StudentCardProps {
    student: StudentParticipation;
    onClick: () => void;
    selected: boolean;
}

function StudentCard({student, onClick, selected}: StudentCardProps) {

    return (
        <Card
            sx={{mb: 1, py: 1, border: selected ? '1px solid' : '1px solid transparent'}}
            onClick={onClick}
            variant="outlined"
        >
            <CardContent sx={{p: 0}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Chip
                        sx={{px: 0.5, ml: 1, fontSize: '0.6rem'}}
                        variant="outlined"
                        size="small"
                        label={student.status}
                        color={connectionStatusColor[student.status]}
                        icon={connectionStatusIcon[student.status]}
                    />
                    {student.recording &&
                        <RadioButtonCheckedSharp
                            className="animate-pulse"
                            color={"error"}
                            sx={{mr: 1, fontSize: '1.3rem'}}/>
                    }
                </Box>
            </CardContent>
            <CardHeader sx={{px: 0, py: 0.5, ml: 2}}
                        className="flex justify-between truncate"
                        titleTypographyProps={{variant: 'h5'}}
                        title={student.fullName}
            />
        </Card>
    );
}

export default StudentCard;