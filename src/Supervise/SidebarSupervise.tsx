import {ConnectionStatus, StudentParticipation} from "../Api/dto/StudentParticipation";
import React, {ReactElement, useState} from "react";
import {
    RadioButtonCheckedSharp,
    SignalCellular2BarRounded,
    SignalCellular4BarRounded,
    SignalCellularNodataRounded,
    SignalCellularOffRounded
} from "@mui/icons-material";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Box, Card, CardContent, CardHeader, Chip, Tab, useMediaQuery} from "@mui/material";
import Typography from "@mui/material/Typography";

type ConnectionStatusColor = "success" | "error" | "warning";
const connectionStatusColor: Record<ConnectionStatus, ConnectionStatusColor> = {
    [ConnectionStatus.CONNECTED]: "success",
    [ConnectionStatus.DISCONNECTED]: "error",
    [ConnectionStatus.CONNECTING]: "warning",
    [ConnectionStatus.TERMINATED]: "error",
};
const connectionStatusIcon: Record<ConnectionStatus, ReactElement> = {
    [ConnectionStatus.CONNECTED]: <SignalCellular4BarRounded style={{ fontSize: 15 }}/>,
    [ConnectionStatus.DISCONNECTED]: <SignalCellularOffRounded style={{ fontSize: 15 }}/>,
    [ConnectionStatus.CONNECTING]: <SignalCellular2BarRounded style={{ fontSize: 15 }}/>,
    [ConnectionStatus.TERMINATED]: <SignalCellularNodataRounded style={{ fontSize: 15 }}/>,
};

interface StudentCardProps {
    student: StudentParticipation;
    onClick: () => void;
    selected: boolean;
}

interface NotificationCardProps {
    studentName: string;
    message: string;
}


function StudentCard({student, onClick, selected}: StudentCardProps) {
    const isSmallScreen = useMediaQuery('(max-width:820px)');
    
    return (
        <Card
            sx={{mb: 1}}
            onClick={onClick}
            elevation={selected ? 4 : 1}
        >

            <CardContent style={{padding: 1}}>
                <div className="flex flex-row justify-between pt-1 ">
                    <Chip
                        sx={{ p: 0, ml: 1, fontSize: '0.7rem', ...(isSmallScreen && { fontSize: '0.6rem', px: 0})}}
                        variant="outlined"
                        size={"small"}
                        label={student.status}
                        color={connectionStatusColor[student.status]}
                        icon={connectionStatusIcon[student.status]}
                    />
                    {
                        student.recording &&
                        <RadioButtonCheckedSharp 
                            className="animate-pulse"
                            color={"error"}
                            sx={{mr: 1, fontSize: '1.2rem'}}
                        />
                    }
                </div>
            </CardContent>

            <CardHeader 
                    sx={{px: 0, py: 0.3, ml: 2}}
                    className="flex justify-between truncate" 
                    titleTypographyProps={{variant:'h5' }}
                    title={student.fullName}
            />
        </Card>
    );
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

interface SideBarProps {
    students: StudentParticipation[];
    onClick: (student: StudentParticipation) => void;
    focusedStudent: StudentParticipation | undefined
}


function SidebarSupervise({students, onClick, focusedStudent}: SideBarProps) {
    const [value, setValue] = useState("students");
    const [notifications, setNotifications] = useState<NotificationCardProps[]>([]);

    const showNotification = (studentName: string, message: string) => {
        setNotifications([...notifications, {studentName: studentName, message: message}]);
    };


    return (
        <TabContext value={value}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <TabList onChange={(_, newValue) => setValue(newValue)} aria-label="lab API tabs example">
                    <Tab label="Students" value="students"/>
                    {/*<Tab label="Notifications" value="notifications"/>*/}
                </TabList>
            </Box>
            <TabPanel sx={{px: 0, py: 1}} value="students">
                {students.map((student: StudentParticipation) => (
                    <StudentCard
                        key={student.id}
                        student={student}
                        onClick={() => onClick(student)}
                        selected={focusedStudent?.id === student.id}
                    />
                ))}
            </TabPanel>
            {/*<TabPanel sx={{px: 0, py: 1}} value="notifications">
                {notifications.map((notification, index) => (
                    <NotificationCard studentName={notification.studentName}
                                      message={notification.message}
                                      key={index}
                    />
                ))}
                </TabPanel>*/}
        </TabContext>
    );
}

export default SidebarSupervise;