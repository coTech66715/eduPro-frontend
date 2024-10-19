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
  DialogContentText,
  TextField,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  Badge,
  Drawer,
  Alert,
  Rating,
  Snackbar,
  InputAdornment, 
  ListItemText
 
} from '@mui/material';
import {
  CloudDownload as DownloadIcon,
  CloudUpload as CompletedIcon,
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Group as GroupIcon,
  VpnKey as VpnKeyIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Description as DescriptionIcon,
  PlayArrow as InProgressIcon,
  AttachMoney as PaidIcon,
  MoneyOff as UnpaidIcon,
  Visibility as ViewFilesIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Styled components
const Sidebar = styled('div')(({ theme }) => ({
  width: '240px',
  height: '100vh',
  backgroundColor: '#f4f5f7',
  paddingTop: '20px',
  display: 'flex',
  flexDirection: 'column',
}));

const SidebarItem = styled(ListItem)(({ theme }) => ({
  padding: '12px 20px',
  color: '#555',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: '#dfe1e6',
    cursor: 'pointer',
  },
}));

const SidebarIcon = styled('span')(({ theme }) => ({
  marginRight: '12px',
  color: '#888',
}));

const MainContent = styled(Container)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  [theme.breakpoints.up('sm')]: {
    marginLeft: '240px',
    width: `calc(100% - 240px)`,
  },
}));

const TopBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
}));

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [descriptionDialog, setDescriptionDialog] = useState({
    open: false,
    description: '',
    title: '',
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const [completionDialog, setCompletionDialog] = useState({
    open: false,
    assignment: null
  });
  const [completionForm, setCompletionForm] = useState({
    feedback: '',
    fee: '',
    files: null
  });

  const [viewFilesDialog, setViewFilesDialog] = useState({
    open: false,
    files: [],
  });

  const handlePaymentStatus = async (assignmentId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:8080/api/assignments/${assignmentId}/payment-status`, 
        { paymentStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAssignments(prevAssignments =>
        prevAssignments.map(assignment => 
          assignment._id === assignmentId ? { ...assignment, paymentStatus: status} : assignment
        )
      )
      setSnackbar({
        open: true,
        message: `Assignment marked as ${status}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update payment status',
        severity: 'error'
      });
    }
  };

  

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleViewFiles = (files) => {
    if (!files || files.length === 0) {
        setSnackbar({
            open: true,
            message: 'No files available for this assignment',
            severity: 'info'
        });
        return;
    }
    
    
    const formattedFiles = files.map(file => ({
        name: file.originalName || file.name,
        size: file.size,
        id: file.name, 
    }));
    
    setViewFilesDialog({
        open: true,
        files: formattedFiles,
    });
};

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token retrieved from localStorage:', token);

      if (!token) {
        throw new Error('No token found in localStorage');
      }
      const response = await axios.get('http://localhost:8080/api/assignments/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('API Response:', response.data);
      setAssignments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError(err.response?.data?.message || 'Failed to fetch assignments. Please try again later.');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDownload = async(assignmentId, fileName) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `http://localhost:8080/api/assignments/download/${assignmentId}/${fileName}`,
            {
                headers: { Authorization: `Bearer ${token}`},
                responseType: 'blob'
            }
        );

        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading file:', error);
        setSnackbar({
            open: true,
            message: 'Failed to download file',
            severity: 'error'
        });
    }
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
    formData.append('phoneNumber', selectedAssignment.userId.phoneNumber)
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
    const filteredAssignments = assignments.filter(ass => {
      if(status === 'pending') {
        return !ass.status || ass.status === 'pending'
      }
      else {
        return ass.status === status
      }
    });

    const handleOpenDescription = (assignment) => {
      setDescriptionDialog({
        open: true,
        description: assignment.description,
        title: `Description for ${assignment.name}'s Assignment`,
      });
    };
  
    const handleCloseDescription = () => {
      setDescriptionDialog({
        open: false,
        description: '',
        title: '',
      });
    };

    const handleStatusChange = async(assignmentId, newStatus) => {
      try {
        const token = localStorage.getItem('token')

        await axios.patch(`http://localhost:8080/api/assignments/${assignmentId}/status`, {status: newStatus}, {
          headers: { Authorization: `Bearer ${token}`}
        })

        await fetchAssignments()
        setSnackbar({
          open: true,
          message: `Assignment moved to ${newStatus.replace('_', ' ')}`,
          severity: 'success'
        })
      } catch (error) {
        console.error('Error updating assignment status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update assignment status',
        severity: 'error'
      });
      }
    }

    const handleCompletionSubmit = async () => {
      try {
        const formData = new FormData();
        formData.append('feedback', completionForm.feedback);
        formData.append('fee', completionForm.fee);
        if (completionForm.files) {
          formData.append('files', completionForm.files);
        }
  
        const token = localStorage.getItem('token');
        await axios.patch(
          `http://localhost:8080/api/assignments/${completionDialog.assignment._id}/complete`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
  
        await fetchAssignments();
        setCompletionDialog({ open: false, assignment: null });
        setCompletionForm({ feedback: '', fee: '', files: null });
        setSnackbar({
          open: true,
          message: 'Assignment marked as completed',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error completing assignment:', error);
        setSnackbar({
          open: true,
          message: 'Failed to complete assignment',
          severity: 'error'
        });
      }
    };


    

    return (
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              {!isMobile && <TableCell>Course</TableCell>}
              <TableCell>Deadline</TableCell>
              <TableCell align='center'>Description</TableCell>
              <TableCell>Actions</TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.map((assignment) => (
              <TableRow key={assignment._id}>
                <TableCell>{assignment.name}</TableCell>
                <TableCell>{assignment.email}</TableCell>
                <TableCell>{assignment.phoneNumber}</TableCell>
                {!isMobile && <TableCell>{assignment.course}</TableCell>}
                <TableCell>{format(new Date(assignment.deadline), 'MMM dd, yyyy')}</TableCell>
                <TableCell align='center'>
                  <Tooltip title="View Description">
                    <IconButton
                    onClick={() => handleOpenDescription(assignment)}
                    color='primary'
                    size='small'
                    >
                      <DescriptionIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {status === 'pending' && (
                    <>
                      <Tooltip title="Download Files">
                        <IconButton
                          onClick={() => handleDownload(assignment._id, assignment.fileName)}
                          color="primary"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Mark as In Progress">
                        <IconButton
                          onClick={() => handleStatusChange(assignment._id, 'in_progress')}
                          color="info"
                        >
                          <InProgressIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Mark as Completed">
                        <IconButton
                          onClick={() => setCompletionDialog({ open: true, assignment })}
                          color="success"
                        >
                          <CompletedIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  {status === 'in_progress' && (
                    <>
                      <Tooltip title="Download Files">
                        <IconButton
                          onClick={() => handleDownload(assignment._id, assignment.fileName)}
                          color="primary"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Mark as Completed">
                        <IconButton
                          onClick={() => setCompletionDialog({ open: true, assignment })}
                          color="success"
                        >
                          <CompletedIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  {status === 'submitted' && (
                      <>
                        <Tooltip title="Mark as Paid">
                          <IconButton
                            onClick={() => handlePaymentStatus(assignment._id, 'paid')}
                            color="success"
                          >
                            <PaidIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Mark as Unpaid">
                          <IconButton
                            onClick={() => handlePaymentStatus(assignment._id, 'unpaid')}
                            color="error"
                          >
                            <UnpaidIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Uploaded Files">
                          <IconButton
                            onClick={() => handleViewFiles(assignment.completedFiles)}
                            color="primary"
                          >
                            <ViewFilesIcon />
                          </IconButton>
                        </Tooltip>
                        <TableCell>GHS {assignment.fee || 'N/A'}</TableCell>
                      </>
                    )}
                </Box>
              </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarContent = (
    <Sidebar>
      <Typography variant="h5" align="center" sx={{ padding: '16px', fontWeight: 'bold', color: theme.palette.primary.main }}>
        Edu Pro
      </Typography>
      <List>
        {[
          { icon: <HomeIcon />, text: 'Home', path: '/admin-dashboard'},
          { icon: <AssignmentIcon />, text: 'Assignments', path: '/get-assignments' },
          { icon: <PeopleIcon />, text: 'User Management' },
          { icon: <GroupIcon />, text: 'Groups' },
          { icon: <VpnKeyIcon />, text: 'API Keys' },
          { icon: <SettingsIcon />, text: 'Settings' },
        ].map((item, index) => (
          <Tooltip key={item.text} title={item.text} placement="right">
            <React.Fragment>
              <SidebarItem onClick={() => handleNavigation(item.path)} >
                <SidebarIcon>{item.icon}</SidebarIcon>
                {item.text}
              </SidebarItem>
              {index !== 5 && <Divider />}
            </React.Fragment>
          </Tooltip>
        ))}
      </List>
    </Sidebar>
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const handleCloseDescription = () => {
      setDescriptionDialog({
        open: false,
        description: '',
        title: '',
      });
    };

    const handleCompletionSubmit = async () => {
      try {
          const formData = new FormData();
          formData.append('feedback', completionForm.feedback);
          formData.append('fee', completionForm.fee);
          
          // Handle file upload
          if (completionForm.files) {
              formData.append('files', completionForm.files);
          }
  
          const token = localStorage.getItem('token');
          const response = await axios.patch(
              `http://localhost:8080/api/assignments/${completionDialog.assignment._id}/complete`,
              formData,
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'multipart/form-data'
                  }
              }
          );
  
          // Update the UI with the new files
          await fetchAssignments();
          setCompletionDialog({ open: false, assignment: null });
          setCompletionForm({ feedback: '', fee: '', files: null });
          setSnackbar({
              open: true,
              message: 'Assignment marked as completed',
              severity: 'success'
          });
      } catch (error) {
          console.error('Error completing assignment:', error);
          setSnackbar({
              open: true,
              message: 'Failed to complete assignment',
              severity: 'error'
          });
      }
  };
  return (
    <Box sx={{ display: 'flex' }}>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
          open
        >
          {sidebarContent}
        </Drawer>
      )}

      <MainContent maxWidth="xl">
        <TopBar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Assignments
          </Typography>
          <Tooltip title="Notifications">
            <IconButton>
              <Badge badgeContent={3} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </TopBar>

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

        <Dialog 
          open={descriptionDialog.open} 
          onClose={handleCloseDescription}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{descriptionDialog.title}</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ whiteSpace: 'pre-wrap' }}>
              {descriptionDialog.description}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDescription} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </MainContent>

      <Dialog 
        open={completionDialog.open} 
        onClose={() => setCompletionDialog({ open: false, assignment: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Complete Assignment</DialogTitle>
        <DialogContent>
          <TextField
            label="Feedback"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={completionForm.feedback}
            onChange={(e) => setCompletionForm(prev => ({ ...prev, feedback: e.target.value }))}
          />
          <TextField
            label="Fee"
            type="number"
            fullWidth
            margin="normal"
            value={completionForm.fee}
            onChange={(e) => setCompletionForm(prev => ({ ...prev, fee: e.target.value }))}
            InputProps={{
              startAdornment: <InputAdornment position="start">GHS</InputAdornment>,
            }}
          />
          <TextField
            type="file"
            fullWidth
            margin="normal"
            onChange={(e) => setCompletionForm(prev => ({ ...prev, files: e.target.files[0] }))}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompletionDialog({ open: false, assignment: null })}>
            Cancel
          </Button>
          <Button onClick={handleCompletionSubmit} color="primary">
            Complete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog 
        open={viewFilesDialog.open} 
        onClose={() => setViewFilesDialog({ open: false, files: [] })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Uploaded Files</DialogTitle>
        <DialogContent>
          {viewFilesDialog.files && viewFilesDialog.files.length > 0 ? (
            <List>
              {viewFilesDialog.files.map((file, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={file.name} 
                    secondary={`Size: ${file.size ? `${file.size} bytes` : 'Unknown'}`} 
                  />
                  <IconButton onClick={() => handleDownload(file.id, file.name)}>
                    <DownloadIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No files available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewFilesDialog({ open: false, files: [] })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Assignments;