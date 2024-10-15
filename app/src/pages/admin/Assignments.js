import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CloudDownload as DownloadIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/assignments/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to fetch assignments. Please try again later.');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDownload = (assignmentId, fileName) => {
    // Implement file download logic here
    console.log(`Downloading file ${fileName} for assignment ${assignmentId}`);
  };

  const handleUploadClick = (assignment) => {
    setSelectedAssignment(assignment);
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setSelectedAssignment(null);
    setUploadFile(null);
    setUploadProgress(0);
  };

  const handleFileChange = (event) => {
    setUploadFile(event.target.files[0]);
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile || !selectedAssignment) return;

    const formData = new FormData();
    formData.append('files', uploadFile);
    // Add other necessary fields
    formData.append('name', selectedAssignment.name);
    formData.append('email', selectedAssignment.userId.email);
    formData.append('studentId', selectedAssignment.studentId);
    formData.append('programme', selectedAssignment.programme);
    formData.append('course', selectedAssignment.course);
    formData.append('deadline', selectedAssignment.deadline);
    formData.append('description', selectedAssignment.description);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/api/assignments/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      // Refresh assignments after successful upload
      fetchAssignments();
      handleCloseUploadDialog();
    } catch (err) {
      console.error('Error uploading file:', err);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const renderAssignmentTable = (status) => {
    const filteredAssignments = assignments.filter(ass => ass.status === status);

    return (
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>User</TableCell>
              {!isSmallScreen && <TableCell>Course</TableCell>}
              <TableCell>Deadline</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.map((assignment) => (
              <TableRow key={assignment._id}>
                <TableCell>{assignment.name}</TableCell>
                <TableCell>{assignment.userId.name}</TableCell>
                {!isSmallScreen && <TableCell>{assignment.course}</TableCell>}
                <TableCell>{format(new Date(assignment.deadline), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {assignment.status === 'pending' && (
                      <Tooltip title="Upload Assignment">
                        <IconButton onClick={() => handleUploadClick(assignment)} color="primary">
                          <UploadIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Download Files">
                      <IconButton onClick={() => handleDownload(assignment._id, assignment.files[0])} color="secondary">
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
        All Assignments
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="assignment tabs">
          <Tab label="Pending" />
          <Tab label="In Progress" />
          <Tab label="Submitted" />
        </Tabs>
      </Box>

      {tabValue === 0 && renderAssignmentTable('pending')}
      {tabValue === 1 && renderAssignmentTable('in_progress')}
      {tabValue === 2 && renderAssignmentTable('submitted')}

      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog}>
        <DialogTitle>Upload Assignment</DialogTitle>
        <DialogContent>
          <TextField
            type="file"
            onChange={handleFileChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          {uploadProgress > 0 && (
            <Box sx={{ mt: 2 }}>
              <CircularProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="text.secondary">{`${uploadProgress}%`}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Cancel</Button>
          <Button onClick={handleUploadSubmit} color="primary">Upload</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Assignments;