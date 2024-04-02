import {StudentParticipation} from "../../models/StudentParticipation";
import React, {useState} from "react";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Box, Skeleton, Tab} from "@mui/material";
import StudentCard from "./StudentCard";

interface SideBarProps {
    students: StudentParticipation[] | undefined;
    focusedStudent: StudentParticipation | undefined;
    statusGettingStudents: "idle" | "loading" | "error" | "success";
    onClick: (student: StudentParticipation) => void;
}

function SuperviseSidebar({students, focusedStudent, statusGettingStudents, onClick}: SideBarProps) {
    const [value, setValue] = useState("students");

    let content;

    if (statusGettingStudents === "error" || !students) {
        content = <p>Error loading students</p>;
    } else if (statusGettingStudents === 'loading' || students.length === 0) {
        content = [...Array(5)].map(() => (
            <Skeleton variant="rectangular" width="100%" height={100} sx={{mb: 1}}/>
        ));
    } else {
        content = students.map((student) => (
            <StudentCard
                key={student.id}
                student={student}
                onClick={() => onClick(student)}
                selected={focusedStudent?.id === student.id}
            />
        ));
    }


    return (
        <TabContext value={value}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <TabList onChange={(_, newValue) => setValue(newValue)}>
                    <Tab label="Students" value="students"/>
                </TabList>
            </Box>
            <TabPanel sx={{px: 0, py: 2}} value="students">
                {content}
            </TabPanel>
        </TabContext>
    );
}

export default SuperviseSidebar;