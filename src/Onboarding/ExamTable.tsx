import * as React from 'react';
import {useState} from 'react';
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ExamDetailDialog from './ExamDetailDialog';
import {GetAllExamsDto} from '../Api/dto/Exam';
import {useDeleteExam} from '../Hooks/useExam';
import moment from "moment";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ExamTable({ rows }: { rows: any[] }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState<GetAllExamsDto | null>(null);
  const { mutateDeleteExam } = useDeleteExam(); 
  

  const handleOpenDialog = (exam: GetAllExamsDto) => {
    setSelectedExam(exam);
    setOpenDialog(true);
    console.log(exam.creationTime);
  };

  const handleDeleteExam = (id: string) => {
    mutateDeleteExam(id); 
  };

  if (rows.length === 0) {
    return <Typography>No exams created yet.</Typography>;
  }

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

  return (
    <>
    <TableContainer component={Paper}>
      <Table aria-label="Exam Table">
        <TableHead>
          <TableRow>
          <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell align="left">Name</StyledTableCell>
            <StyledTableCell align="left">Creator Name</StyledTableCell>
            <StyledTableCell align="left">Creation Time</StyledTableCell>
            <StyledTableCell align="left">Start Time</StyledTableCell>
            <StyledTableCell align="left">End Time</StyledTableCell>
            <StyledTableCell align="center">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.id}
              </StyledTableCell>        
              <StyledTableCell align="left">{row.name}</StyledTableCell>
              <StyledTableCell align="left">{row.creatorName}</StyledTableCell>
              <StyledTableCell align="left">{formatDate(row.creationTime)}</StyledTableCell>
              <StyledTableCell align="left">{formatDate(row.startTime)}</StyledTableCell>
              <StyledTableCell align="left">{formatDate(row.endTime)}</StyledTableCell>
              <StyledTableCell align="center">
              <IconButton onClick={() => handleOpenDialog(row)}>
                  <ModeEditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteExam(row.id)}> 
                    <DeleteIcon />
                  </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <ExamDetailDialog open={openDialog} onClose={() => setOpenDialog(false)} exam={selectedExam} />
    </>
  );
}




