import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import {Exam} from '../../models/Exam';
import {useDeleteExam} from '../../hooks/useExam';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import {TableCell} from "@mui/material";
import {prettyDate, shortTime} from "../../utils/formatting";
import {useNavigate} from "react-router-dom";

interface ExamTableProps {
    exams: Exam[] | undefined;
    queryStatus: "idle" | "error" | "loading" | "success";
}

export default function ExamTable({exams, queryStatus}: ExamTableProps) {
    const {mutateDeleteExam} = useDeleteExam();
    const navigate = useNavigate();

    const handleDeleteExam = (exam: Exam) => {
        mutateDeleteExam(exam.id);
    };
    const handleEditExam = (exam: Exam) => {
        navigate(`/exams/${exam.id}/edit`);
    }

    let tableContent;
    if (queryStatus === 'loading') {
        tableContent = <TableRow><TableCell colSpan={6}>Loading exams...</TableCell></TableRow>;
    } else if (queryStatus === 'error') {
        tableContent = <TableRow><TableCell colSpan={6}>There was an error loading the exams</TableCell></TableRow>;
    } else if (!exams || exams.length === 0) {
        tableContent = <TableRow><TableCell colSpan={6}>No exams in sight</TableCell></TableRow>;
    } else {
        tableContent = exams.map((exam) => (
            <TableRow key={exam.id}>
                <TableCell component="th" scope="row">{exam.id}</TableCell>
                <TableCell align="left">{exam.name}</TableCell>
                <TableCell align="left">{prettyDate(exam.startTime)}</TableCell>
                <TableCell align="left">{shortTime(exam.startTime)}</TableCell>
                <TableCell align="left">{shortTime(exam.endTime)}</TableCell>
                <TableCell align="right">
                    <IconButton onClick={() => handleEditExam(exam)}>
                        <ModeEditIcon/>
                    </IconButton>
                    <IconButton onClick={() => handleDeleteExam(exam)}>
                        <DeleteIcon/>
                    </IconButton>
                </TableCell>
            </TableRow>
        ));
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="Exam Table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">ID</TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Date</TableCell>
                        <TableCell align="left">Start</TableCell>
                        <TableCell align="left">End</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableContent}
                </TableBody>
            </Table>
        </TableContainer>
    );
}