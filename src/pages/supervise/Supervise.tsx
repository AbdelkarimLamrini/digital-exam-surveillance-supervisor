import React, {useEffect, useRef, useState} from "react";
import {ConnectionStatus, StudentParticipation,} from "../../models/StudentParticipation";
import {
    Box, Breadcrumbs,
    Button,
    Container,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import {Cached, RadioButtonChecked} from "@mui/icons-material";

import {useGetStudentParticipations} from "../../hooks/useStudentParticipation";
import {useParams} from "react-router-dom";
import ReactPlayer from "react-player";
import {useStartRecording, useStopRecording} from "../../hooks/useRecording";
import {Client} from "@stomp/stompjs";
import SidebarSupervise from "./SidebarSupervise";
import VideoPlayer from "./VideoPlayer";
import moment from "moment";
import MovieIcon from "@mui/icons-material/Movie";
import Link from "@mui/material/Link";
import {useGetExamSessionDetails} from "../../hooks/useExamSession";
import FloatingAlert from "../../components/FloatingAlert";
import LinkRouter from "../../components/LinkRouter";

interface RecordingDetails {
    id: number;
    studentParticipationId: number;
    studentId: string;
    recordingUrl: string;
    startTime: string;
    endTime: string;
}

interface StreamLog {
    participationId: number;
    timestamp: Date;
    status: ConnectionStatus;
}

interface FraudDetection {
    id: number;
    participationId: number;
    studentId: string;
    timestamp: Date;
    fraudScore: number;
}

function Supervise() {
    const {sessionId} = useParams();
    const {studentParticipations, statusGettingStudentParticipations} = useGetStudentParticipations(sessionId);
    const {startRecordingMutate, isLoadingStartingRecording} =
        useStartRecording();
    const [focusedStudent, setFocusedStudent] = useState<StudentParticipation>();
    const playerRef = useRef<ReactPlayer>(null);
    const [students, setStudents] = useState<StudentParticipation[]>([]);
    const [refresh, setRefresh] = useState<boolean>(true);
    const [showVideoAlert, setShowVideoAlert] = useState<boolean>(false);
    const [enableReload, setEnableReload] = useState<boolean>(false);
    const [intervalMs, setIntervalMs] = useState<string | null>();
    const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
    const [manualMode, setManualMode] = useState(false);
    const {stopRecordingMutate} = useStopRecording();
    const [recordings, setRecordings] = useState<RecordingDetails[]>([]);
    const {examSession, statusGettingExamSessionDetails} = useGetExamSessionDetails(sessionId);

    const formatDate = (dateStr: string) => {
        if (!dateStr) {
            console.error("Date string is null, undefined, or empty:", dateStr);
            return "N/A";
        }

        const date = moment(dateStr);
        if (date.isValid()) {
            return date.format("LLL");
        } else {
            console.error("Failed to parse date:", dateStr);
            return "Invalid Date";
        }
    };

    const handleClickStudent = (student: StudentParticipation) => {
        setEnableReload(false);
        setShowVideoAlert(false);
        setFocusedStudent(student);
        setManualMode(true);
        setIntervalMs(null);
    };
    const handleToggleButtonGroupClick = () => {
        setManualMode(!manualMode);
        if (!manualMode) {
            setIntervalMs("10000");
        }
    };

    const handleClickRefresh = () => {
        setEnableReload(false);
        playerRef.current
            ?.getInternalPlayer("hls")
            .loadSource(focusedStudent?.hlsStreamUrl ?? "");
    };

    const handleStartRecordingClick = () => {
        if (!focusedStudent || !focusedStudent.id) return;

        const updateStudentRecordingStatus = (newRecordingStatus: boolean) => {
            setFocusedStudent((currentFocused) => {
                if (currentFocused) {
                    return {
                        ...currentFocused,
                        recording: newRecordingStatus,
                        id: currentFocused.id || 0,
                    };
                }
                return currentFocused;
            });
            setStudents((currentStudents) => {
                return currentStudents.map((student) => {
                    if (student.id === focusedStudent?.id) {
                        return {
                            ...student,
                            recording: newRecordingStatus,
                            id: student.id || 0,
                        };
                    }
                    return student;
                });
            });
        };

        if (focusedStudent.recording) {
            stopRecordingMutate(String(focusedStudent.id), {
                onSuccess: (data) => {
                    console.log(
                        `Recording stopped successfully for student ID ${focusedStudent.id}. DTO received:`,
                        data
                    );
                    setRecordings((prev) => [...prev, data]);
                    updateStudentRecordingStatus(false);
                },
            });
        } else {
            startRecordingMutate(String(focusedStudent.id), {
                onSuccess: () => {
                    console.log(
                        `Recording started successfully for student ID ${focusedStudent.id}.`
                    );
                    updateStudentRecordingStatus(true);
                },
            });
        }
    };

    const renderRecordingsTable = () => {
        if (recordings.length === 0) {
            return null;
        }

        return (
            <Box>
                <Typography variant="h6" sx={{marginTop: 2}}>
                    Recordings
                </Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Recording URL</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {recordings.map((record, index) => (
                            <TableRow key={index}>
                                <TableCell>{formatDate(record.startTime)}</TableCell>
                                <TableCell>{formatDate(record.endTime)}</TableCell>
                                <TableCell>
                                    <IconButton
                                        component={Link}
                                        href={record.recordingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="view recording"
                                    >
                                        <MovieIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        );
    };

    const handleSetIntervalMs = (
        _: React.MouseEvent<HTMLElement>,
        newIntervalMs: string | null
    ) => {
        if (newIntervalMs && !isNaN(+newIntervalMs) && +newIntervalMs >= 10) {
            setIntervalMs(newIntervalMs);
            setManualMode(false);
        }
    };

    useEffect(() => {
        setManualMode(false);
        setIntervalMs("10000");
    }, []);

    useEffect(() => {
        const client = new Client({
            brokerURL: process.env.REACT_APP_WS_URL,
            onConnect: () => {
                console.log("[WS] Connected to the websocket message broker");
                client.subscribe(`/topic/exam-session/${sessionId}/log`, (message) => {
                    // Update the status of each participant in the sidebar
                    const logs = JSON.parse(message.body) as StreamLog[];
                    if (!logs || logs.length === 0) return;
                    console.log("[WS] StreamLog received:");
                    console.log(logs);
                    setStudents((oldStudents) => {
                        if (!oldStudents.length) return [];
                        return oldStudents.map((student) => {
                            const log = logs.find(
                                (log) => +log.participationId === +student.id
                            );
                            if (log) return {...student, status: log.status};
                            return student;
                        });
                    });
                });
                client.subscribe(
                    `/topic/exam-session/${sessionId}/participation`,
                    (message) => {
                        // Add a new participant to the sidebar
                        const newStudent = JSON.parse(message.body) as StudentParticipation;
                        console.log("[WS] StudentParticipation received:");
                        console.log(newStudent);
                        setStudents((oldStudents) => {
                            const oldStudent = oldStudents.find(
                                (student) => +student.id === +newStudent.id
                            );
                            if (oldStudent) {
                                return oldStudents.map((student) => {
                                    if (+student.id === +newStudent.id) return newStudent;
                                    return student;
                                });
                            }
                            if (oldStudents) return [...oldStudents, newStudent];
                            setFocusedStudent(newStudent);
                            return [newStudent];
                        });
                    }
                );
                client.subscribe(
                    `/topic/exam-session/${sessionId}/fraud`,
                    (message) => {
                        // Update the status of each participant in the sidebar
                        const fraudDetection = JSON.parse(message.body) as FraudDetection;
                        console.log("[WS] FraudDetection received:");
                        console.log(fraudDetection);
                    }
                );
            },
            onStompError: (frame) => {
                console.log(
                    "[WS] Message broker reported error: " + frame.headers["message"]
                );
                console.log("[WS] Additional details: " + frame.body);
            },
        });

        client.activate();
        return () => {
            client
                .deactivate()
                .then(() =>
                    console.log("[WS] Disconnected from the websocket message broker")
                );
        };
    }, [sessionId]);

    useEffect(() => {
        if (!intervalMs) {
            if (intervalId) clearInterval(intervalId);
            return;
        }
        if (intervalId) clearInterval(intervalId);
        setIntervalId(
            setInterval(() => {
                console.log("Random student selection interval triggered");
                console.log(students);
                if (students.length === 0) return;
                const index = Math.floor(Math.random() * students.length);
                setFocusedStudent(students[index]);
            }, +intervalMs)
        );

        return () => clearInterval(intervalId);
    }, [intervalMs]);

    if (statusGettingStudentParticipations === 'loading' || !studentParticipations) {
        if (!refresh) setRefresh(true);
        return <Typography>Loading...</Typography>;
    } else if (statusGettingStudentParticipations === 'error') {
        if (!refresh) setRefresh(true);
        return <Typography>Error loading students</Typography>;
    } else if (statusGettingStudentParticipations === 'success' && refresh) {
        if (refresh) setRefresh(false);
        setStudents(studentParticipations);
        if (studentParticipations.length > 0) setFocusedStudent(studentParticipations[0]);
    }

    return (
        <Container maxWidth="xl">
            <FloatingAlert severity="warning" show={showVideoAlert}
                           onClose={() => setShowVideoAlert(false)}>
                There was an error loading the live stream. Please try again.
            </FloatingAlert>
            <Breadcrumbs sx={{my:1}}>
                <LinkRouter to={'/exams'}>Exams</LinkRouter>
                <LinkRouter to={`/exams/${examSession?.examId}`}>{examSession?.examName}</LinkRouter>
                <Typography>{examSession?.classRoomId}</Typography>
            </Breadcrumbs>
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            my: 1,
                        }}
                    >
                        <Typography variant="h5">
                            {statusGettingExamSessionDetails === "loading"
                                ? "Loading exam info..."
                                : examSession
                                    ? `${examSession.examName} in ${examSession.classRoomId}`
                                    : "Exam Info Not Found"}
                        </Typography>

                        <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                            <Box sx={{display: "flex", alignItems: "center", gap: 1}}
                                 onClick={handleToggleButtonGroupClick}
                            >
                                <Typography variant="body1">
                                    {manualMode ? "Manual mode" : "Carousel mode"}
                                </Typography>
                            </Box>

                            <ToggleButtonGroup
                                value={intervalMs}
                                exclusive
                                onChange={handleSetIntervalMs}
                                aria-label="Interval for random student selection"
                            >
                                <ToggleButton value="120000" aria-label="2 minute">
                                    2 &nbsp;min
                                </ToggleButton>
                                <ToggleButton value="60000" aria-label="1 minute">
                                    1 &nbsp;min
                                </ToggleButton>
                                <ToggleButton value="30000" aria-label="30 seconds">
                                    30 sec
                                </ToggleButton>
                                <ToggleButton value="10000" aria-label="10 seconds">
                                    10 sec
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Box>
                    <VideoPlayer
                        playerRef={playerRef}
                        focusedStudent={focusedStudent}
                        onError={() => {
                            console.error(
                                "Error loading stream: ",
                                focusedStudent?.hlsStreamUrl
                            );
                            setShowVideoAlert(true);
                            setEnableReload(true);
                        }}
                    />
                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Box>
                            <Typography variant="caption">
                                {focusedStudent?.studentId} - {focusedStudent?.email}
                            </Typography>
                            <Typography variant="h6">{focusedStudent?.fullName}</Typography>
                        </Box>
                        <Box>
                            <Button
                                variant="contained"
                                color="info"
                                startIcon={<Cached/>}
                                onClick={handleClickRefresh}
                                // disabled={!enableReload}
                            >
                                "Reload Stream"
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<RadioButtonChecked/>}
                                onClick={handleStartRecordingClick}
                                disabled={isLoadingStartingRecording || !focusedStudent}
                            >
                                {isLoadingStartingRecording
                                    ? "Starting..."
                                    : focusedStudent?.recording
                                        ? "Stop Recording"
                                        : "Start Recording"}
                            </Button>
                        </Box>
                    </Box>
                    {renderRecordingsTable()}
                </Grid>
                <Grid item xs={3}>
                    <SidebarSupervise
                        students={students}
                        onClick={handleClickStudent}
                        focusedStudent={focusedStudent}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}

export default Supervise;