import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  MenuItem,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';


const Input = styled('input')({
  display: 'none',
});

const FileList = styled(List)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(1),
  maxHeight: '200px',
  overflowY: 'auto',
}));

const NewAssignment = ({ user }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: '',
    phoneNumber: '',
    programme: '',
    course: '',
    deadline: '',
    files: [],
    description: '',
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFormData(prevData => ({
      ...prevData,
      files: [...prevData.files, ...newFiles]
    }));
  };

  const handleRemoveFile = (index) => {
    setFormData(prevData => ({
      ...prevData,
      files: prevData.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    
    const data = new FormData();
  data.append('name', formData.name);
  data.append('email', formData.email);
  data.append('studentId', formData.studentId);
  data.append('phoneNumber', formData.phoneNumber);
  data.append('programme', formData.programme);
  data.append('course', formData.course);
  data.append('deadline', formData.deadline);
  data.append('description', formData.description);

  formData.files.forEach(file => data.append('files', file));

    try {
      const token = localStorage.getItem('token')

      if(!token) {
        console.error('No auth token found');
        setOpenSnackbar(true)
        return
      }
      const response = await fetch('http://localhost:8080/api/assignments/submit', {
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json();
      if(response.ok){
        console.log('Success:', result);
        setOpenSnackbar(true); 
        navigate(-1)
      }else {
        console.log('Error:', result);

        if(response.status === 401) {
          navigate('/')
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setOpenSnackbar(true)
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ mt: 6, p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Submit a New Assignment
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Programme"
                name="programme"
                value={formData.programme}
                onChange={handleInputChange}
                required
                variant="outlined"
              >
                <MenuItem value="">Select a programme</MenuItem>
                <MenuItem value="Computer Science">Computer Science</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                {/* Add more options as needed */}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <label htmlFor="contained-button-file">
                  <Input
                    accept="*/*"
                    id="contained-button-file"
                    name='files'
                    multiple
                    type="file"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Files
                  </Button>
                </label>
                {formData.files.length > 0 && (
                  <FileList>
                    {formData.files.map((file, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFile(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </FileList>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ minWidth: 200 }}
                >
                  Submit Assignment
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Assignment submitted successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewAssignment;