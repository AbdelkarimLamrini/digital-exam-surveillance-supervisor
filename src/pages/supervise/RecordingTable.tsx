import React from "react";
import {Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import Link from "@mui/material/Link";
import {Download} from "@mui/icons-material";
import {useGetRecordings} from "../../hooks/useRecording";
import {shortTime} from "../../utils/date";

interface RecordingTableProps {
    participationId: number;
}

function RecordingTable({participationId}: RecordingTableProps) {
    const {recordings, statusGettingRecordings} = useGetRecordings(participationId);

    let tableContent;
    if (statusGettingRecordings === 'loading') {
        tableContent = (
            <TableRow>
                <TableCell colSpan={4}>
                    Loading recordings...
                </TableCell>
            </TableRow>
        );
    } else if (statusGettingRecordings === 'error' || !recordings) {
        tableContent = (
            <TableRow>
                <TableCell colSpan={4}>
                    There was an error loading the recordings
                </TableCell>
            </TableRow>
        );
    } else if (recordings.length === 0) {
        tableContent = (
            <TableRow>
                <TableCell colSpan={4}>
                    No recordings found
                </TableCell>
            </TableRow>
        );
    } else {
        tableContent = recordings?.map((recording, index) => (
            <TableRow key={index}>
                <TableCell>{shortTime(recording.startTime)}</TableCell>
                <TableCell>{shortTime(recording.endTime)}</TableCell>
                <TableCell>
                    <Link href={recording.url}
                          target="_blank"
                          rel="noreferrer"
                          download={recording.url.split('/').pop()}
                    >
                        {recording.url}
                    </Link>
                </TableCell>
                <TableCell>
                    <IconButton
                        component={Link}
                        href={recording.url}
                        target="_blank"
                        rel="noreferrer"
                        download={recording.url.split('/').pop()}
                    >
                        <Download/>
                    </IconButton>
                </TableCell>
            </TableRow>
        ))
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
                        <TableCell>URL</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableContent}
                </TableBody>
            </Table>
        </Box>
    );
}

export default RecordingTable;