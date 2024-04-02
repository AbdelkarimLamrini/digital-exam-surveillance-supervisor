import React, {useEffect, useRef, useState} from "react";
import {StudentParticipation,} from "../../models/StudentParticipation";
import {Box, Breadcrumbs, Button, Container, Grid, ToggleButton, ToggleButtonGroup, Typography,} from "@mui/material";
import {Cached, RadioButtonChecked} from "@mui/icons-material";
import {useGetStudentParticipations} from "../../hooks/useStudentParticipation";
import {useParams} from "react-router-dom";
import ReactPlayer from "react-player";
import {useStartRecording, useStopRecording} from "../../hooks/useRecording";
import {Client} from "@stomp/stompjs";
import SuperviseSidebar from "./SuperviseSidebar";
import VideoPlayer from "./VideoPlayer";
import {useGetExamSessionDetails} from "../../hooks/useExamSession";
import FloatingAlert from "../../components/FloatingAlert";
import LinkRouter from "../../components/LinkRouter";
import RecordingTable from "./RecordingTable";
import {FraudDetection} from "../../models/FraudDetection";
import {StreamLog, StreamLogDto} from "../../models/StreamLog";

function Supervise() {
    const {sessionId} = useParams();
    const {mutateStartRecording, isLoadingStartingRecording} = useStartRecording();
    const {mutateStopRecording, isLoadingStoppingRecording} = useStopRecording();
    const {examSession, statusGettingExamSessionDetails} = useGetExamSessionDetails(sessionId);
    const {students: qStudents, statusGettingStudents} = useGetStudentParticipations(sessionId);
    const [students, setStudents] = useState<StudentParticipation[]>();
    const [focusedStudent, setFocusedStudent] = useState<StudentParticipation>();
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [intervalMs, setIntervalMs] = useState<string | null>();
    const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
    const [manualMode, setManualMode] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const playerRef = useRef<ReactPlayer>(null);

    const handleClickStudent = (student: StudentParticipation) => {
        setShowAlert(false);
        setFocusedStudent(student);
        setManualMode(true);
        setIntervalMs(null);
    };

    const handleToggleMode = () => {
        setManualMode(!manualMode);
        if (!manualMode) setIntervalMs("10000");
    };

    const handleReload = () => {
        if (!focusedStudent) return;
        playerRef.current?.getInternalPlayer("hls").loadSource(focusedStudent.hlsStreamUrl);
    };

    const updateRecordingStatus = (isRecording: boolean) => {
        if (!focusedStudent) return;
        setFocusedStudent((currentFocused) => {
            if (!currentFocused) return;
            return {...currentFocused, recording: isRecording};
        });
        setStudents((oldStudents) => {
            if (!oldStudents) return [];
            return oldStudents.map((student) => {
                if (student.id === focusedStudent.id) return {...student, recording: isRecording};
                return student;
            });
        })
    };

    const handleStartRecording = () => {
        if (!focusedStudent) return;
        mutateStartRecording(focusedStudent.id, {
            onSuccess: () => updateRecordingStatus(true)
        });
    };

    const handleStopRecording = () => {
        if (!focusedStudent) return;
        mutateStopRecording(focusedStudent.id, {
            onSuccess: () => updateRecordingStatus(false)
        });
    }

    const handleSetIntervalMs = (_: any, newIntervalMs: string | null) => {
        if (!newIntervalMs || isNaN(+newIntervalMs)) return;
        setIntervalMs(newIntervalMs);
        setManualMode(false);
    };

    useEffect(() => {
        setManualMode(false);
        setIntervalMs("10000");
    }, []);

    useEffect(() => {
        if (intervalId) clearInterval(intervalId);
        if (!intervalMs) return;
        setIntervalId(
            setInterval(() => {
                if (!students?.length) return;
                const index = Math.floor(Math.random() * students.length);
                setFocusedStudent(students[index]);
            }, +intervalMs)
        );

        return () => clearInterval(intervalId);
    }, [intervalMs]);

    useEffect(() => {
        const client = new Client({
            brokerURL: process.env.REACT_APP_WS_URL,
            onConnect: () => {
                client.subscribe(`/topic/exam-sessions/${sessionId}/logs`, (message) => {
                    // Update the status of each participant in the sidebar
                    const logs: StreamLog[] = JSON.parse(message.body).map((log: StreamLogDto) => new StreamLog(log))
                    if (!logs || !logs.length) return;
                    setStudents((oldStudents) => {
                        if (!oldStudents?.length) return [];
                        return oldStudents.map((student) => {
                            const log = logs.find((log) => log.participationId === student.id);
                            if (log) return {...student, status: log.status};
                            return student;
                        });
                    });
                });
                client.subscribe(
                    `/topic/exam-sessions/${sessionId}/participations`,
                    (message) => {
                        // Add a new participant to the sidebar
                        const newStudent = new StudentParticipation(JSON.parse(message.body));
                        setStudents((oldStudents) => {
                            if (!oldStudents?.length) {
                                setFocusedStudent(newStudent);
                                return [newStudent];
                            }
                            const oldStudent = oldStudents.find((student) => student.id === newStudent.id);
                            if (oldStudent) {
                                return oldStudents?.map((student) => {
                                    if (student.id === newStudent.id) return newStudent;
                                    return student;
                                });
                            }
                            return [...oldStudents, newStudent];
                        });
                    }
                );
                client.subscribe(
                    `/topic/exam-sessions/${sessionId}/fraud-detections`,
                    (message) => {
                        // Update the status of each participant in the sidebar
                        const fraudDetection = new FraudDetection(JSON.parse(message.body));
                        console.log("[WS] FraudDetection received:");
                        console.log(fraudDetection);
                    }
                );
            },
            onStompError: (frame) => {
                console.log("[WS] Message broker reported error: " + frame.headers["message"]);
                console.log("[WS] Additional details: " + frame.body);
            },
        });

        client.activate();
        return () => {
            client.deactivate().then();
        };
    }, [sessionId]);

    if (statusGettingStudents === 'loading' || statusGettingStudents === 'error' || !qStudents) {
        if (!refresh) setRefresh(true);
    } else if (statusGettingStudents === 'success' && refresh) {
        if (qStudents.length > 0) setFocusedStudent(qStudents[0]);
        setRefresh(false);
        setStudents(qStudents);
    }

    return (
        <Container maxWidth="xl">
            <Typography hidden>{refresh}</Typography>
            <FloatingAlert severity="warning" show={showAlert}
                           onClose={() => setShowAlert(false)}>
                There was an error loading the live stream. Please try again.
            </FloatingAlert>
            <Breadcrumbs sx={{my: 1}}>
                <LinkRouter to={'/exams'}>Exams</LinkRouter>
                <LinkRouter to={`/exams/${examSession?.examId}`}>{examSession?.examName}</LinkRouter>
                <Typography>{examSession?.classRoomId}</Typography>
            </Breadcrumbs>
            <Grid container spacing={2}>
                <Grid item xs={9} sx={{display: 'flex', flexDirection: 'column', gap: '1em'}}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <Typography variant="h5">
                            {statusGettingExamSessionDetails === "loading"
                                ? "Loading exam info..."
                                : examSession
                                    ? `${examSession.examName} in ${examSession.classRoomId}`
                                    : "Exam Info Not Found"}
                        </Typography>

                        <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                            <Box sx={{display: "flex", alignItems: "center", gap: 1}}
                                 onClick={handleToggleMode}
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
                            setShowAlert(true);
                        }}
                    />
                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Box>
                            {focusedStudent && (
                                <>
                                    <Typography
                                        variant="caption">{focusedStudent.studentId} - {focusedStudent.email}</Typography>
                                    <Typography variant="h6">{focusedStudent.fullName}</Typography>
                                </>
                            )}
                        </Box>
                        <Box sx={{display: 'flex', gap: 1}}>
                            <Button
                                variant="contained"
                                startIcon={<Cached/>}
                                onClick={handleReload}
                            >
                                Reload Stream
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<RadioButtonChecked/>}
                                onClick={focusedStudent?.recording ? handleStopRecording : handleStartRecording}
                                disabled={isLoadingStartingRecording || isLoadingStoppingRecording || !focusedStudent}
                            >
                                {isLoadingStartingRecording
                                    ? "Starting..."
                                    : isLoadingStoppingRecording
                                        ? "Stopping..."
                                        : focusedStudent?.recording
                                            ? "Stop Recording"
                                            : "Start Recording"}
                            </Button>
                        </Box>
                    </Box>
                    {focusedStudent && <RecordingTable participationId={focusedStudent.id}/>}
                </Grid>
                <Grid item xs={3}>
                    <SuperviseSidebar
                        students={students}
                        focusedStudent={focusedStudent}
                        statusGettingStudents={statusGettingStudents}
                        onClick={handleClickStudent}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}

export default Supervise;