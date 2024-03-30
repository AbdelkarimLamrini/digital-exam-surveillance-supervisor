import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import {GetAllExamsDto} from "../Api/dto/Exam";
import {useUpdateExam} from "../Hooks/useExam";
import {useCreateExamSession, useGetAllExamSessions,} from "../Hooks/useExamSession";
import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import {getAllExamSessions} from "../Api/ExamSessionService";
import {useQueryClient} from "react-query";
import {useNavigate} from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';

interface ExamDetailDialogProps {
  open: boolean;
  onClose: () => void;
  exam: GetAllExamsDto | null;
}

const ExamDetailDialog = ({ open, onClose, exam }: ExamDetailDialogProps) => {
  const [examData, setExamData] = useState<GetAllExamsDto | null>(exam);
  const [addSessionPopupOpen, setAddSessionPopupOpen] =
    useState<boolean>(false);
  const [classRoomId, setClassRoomId] = useState<string>("");
  const [supervisorName, setSupervisorName] = useState<string>("");
  const { data: examSessions, isLoading: isLoadingGettingAllExamSessions } =
    useGetAllExamSessions(examData?.id || "");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateCreateExamSession } = useCreateExamSession();
  const {
    mutateCreateExam: updateExam
  } = useUpdateExam();

  useEffect(() => {
    setExamData(exam);
    console.log("Exam data set:", exam);
  }, [exam]);

  useEffect(() => {
    if (!examData?.id) {
      console.log("Waiting for examId...");
      return;
    }

    const fetchExamSessions = async () => {
      try {
        const sessions = await getAllExamSessions(examData.id);
        console.log("Fetched sessions:", sessions);
      } catch (error) {
        console.error("Error fetching exam sessions:", error);
      }
    };

    fetchExamSessions();
  }, [examData?.id]);

  const handleNavigateToSupervise = (sessionId: any) => {
    navigate(`/exam/${examData?.id}/session/${sessionId}/supervise`);
  };

  const parseDate = (dateStr: string) => {
    const [datePart, timePart] = dateStr.split(", ");
    const [day, month, year] = datePart.split("/");
    const formattedDateStr = `${year}-${month}-${day}T${timePart}`;
    return new Date(formattedDateStr).toISOString();
  };
  const handleAddSession = () => {
    if (exam && exam.id) {
      mutateCreateExamSession(
        {
          examId: exam.id,
          data: { classRoomId, supervisorName },
        },
        {
          onSuccess: () => {
            setAddSessionPopupOpen(false);
            setClassRoomId("");
            setSupervisorName("");
            // Invalidate and refetch the exam sessions query
            queryClient.invalidateQueries(["getAllExamSessions", exam.id]);
          },
        }
      );
    }
  };

  const handleUpdateExam = () => {
    if (examData) {
      try {
        const updatedExamData = {
          ...examData,
          creationTime: examData.creationTime
            ? parseDate(examData.creationTime)
            : undefined,
          startTime: examData.startTime
            ? parseDate(examData.startTime)
            : undefined,
          endTime: examData.endTime ? parseDate(examData.endTime) : undefined,
        };

        console.log("Updating exam with data:", updatedExamData);

        updateExam(
          {
            id: examData.id,
            data: {
              ...updatedExamData,
              creationTime: updatedExamData.creationTime || "",
              startTime: updatedExamData.startTime || "",
              endTime: updatedExamData.endTime || "",
            },
          },
          {
            onSuccess: () => {
              onClose();
            },
          }
        );
      } catch (error) {
        console.error("Error parsing dates:", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExamData(
      (prevData) =>
        ({
          ...prevData,
          [name]: value,
        } as GetAllExamsDto)
    );
  };

  if (!examData) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Exam Detail</DialogTitle>
        <DialogContent>
          <TextField
            name="id"
            margin="dense"
            label="ID"
            fullWidth
            variant="outlined"
            value={examData.id}
            InputProps={{ readOnly: true }}
          />
          <TextField
            name="name"
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={examData.name}
            onChange={handleChange}
          />
          <TextField
            name="creatorName"
            margin="dense"
            label="Creator Name"
            fullWidth
            variant="outlined"
            value={examData.creatorName}
            onChange={handleChange}
          />
          <TextField
            name="creationTime"
            margin="dense"
            label="Creation Time"
            fullWidth
            variant="outlined"
            value={examData.creationTime}
            onChange={handleChange}
          />
          <TextField
            name="startTime"
            margin="dense"
            label="Start Time"
            fullWidth
            variant="outlined"
            value={examData.startTime}
            onChange={handleChange}
          />
          <TextField
            name="endTime"
            margin="dense"
            label="End Time"
            fullWidth
            variant="outlined"
            value={examData.endTime}
            onChange={handleChange}
          />

          {/* Exam Sessions Table */}
          {isLoadingGettingAllExamSessions ? (
            <Typography>Loading exam sessions...</Typography>
          ) : examSessions && examSessions.length > 0 ? (
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
              <Table aria-label="Exam Sessions Table">
                <TableHead>
                  <TableRow>
                    <TableCell>ClassRoom ID</TableCell>
                    <TableCell>Supervisor Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {examSessions.map(
                    (session: {
                      id: React.Key | null | undefined;
                      classRoomId:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | null
                        | undefined;
                      supervisorName:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | null
                        | undefined;
                    }) => (
                      <TableRow key={session.id}>
                      <TableCell>{session.classRoomId}</TableCell>
                      <TableCell>{session.supervisorName}</TableCell>
                      <TableCell>
                          <IconButton
                              onClick={() => handleNavigateToSupervise(session.id)}
                              aria-label="supervise"
                              color="primary" //blue
                          >
                              <VisibilityIcon />
                          </IconButton>
                      </TableCell>
                  </TableRow>
                  
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No exam sessions added.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateExam}>Save</Button>
          <Button onClick={() => setAddSessionPopupOpen(true)}>
            Add ExamSession
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={addSessionPopupOpen}
        onClose={() => setAddSessionPopupOpen(false)}
      >
        <DialogTitle>Add ExamSession</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="ClassRoom ID"
            fullWidth
            variant="outlined"
            value={classRoomId}
            onChange={(e) => setClassRoomId(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Supervisor Name"
            fullWidth
            variant="outlined"
            value={supervisorName}
            onChange={(e) => setSupervisorName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddSessionPopupOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSession}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExamDetailDialog;
