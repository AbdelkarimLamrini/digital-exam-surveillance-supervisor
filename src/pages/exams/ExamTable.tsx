import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import {Exam} from '../../models/Exam';
import {useDeleteExam} from '../../hooks/useExam';
import {TableCell} from "@mui/material";
import {shortPrettyDate, shortTime} from "../../utils/date";
import {useNavigate} from "react-router-dom";
import {Delete, Description, Edit} from "@mui/icons-material";

interface ExamTableProps {
    exams: Exam[] | undefined;
    queryStatus: "idle" | "error" | "loading" | "success";
}

function ExamTable({exams, queryStatus}: ExamTableProps) {
    const {mutateDeleteExam} = useDeleteExam();
    const navigate = useNavigate();

    const handleDeleteExam = (exam: Exam) => {
        mutateDeleteExam(exam.id);
    };
    const handleEditExam = (exam: Exam) => {
        navigate(`/exams/${exam.id}/edit`);
    };
    const handleShowExam = (exam: Exam) => {
        navigate(`/exams/${exam.id}`);
    };

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
                <TableCell align="left">{shortPrettyDate(exam.startTime)}</TableCell>
                <TableCell align="left">{shortTime(exam.startTime)}</TableCell>
                <TableCell align="left">{shortTime(exam.endTime)}</TableCell>
                <TableCell align="left">
                    <IconButton onClick={() => handleShowExam(exam)}>
                        <Description/>
                    </IconButton>
                    <IconButton onClick={() => handleEditExam(exam)}>
                        <Edit/>
                    </IconButton>
                    <IconButton onClick={() => handleDeleteExam(exam)}>
                        <Delete/>
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
                        <TableCell align="left">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableContent}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ExamTable;