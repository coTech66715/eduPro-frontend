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
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const Input = styled('input')({
  display: 'none',
});

const FilePreview = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const NewAssignment = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: '',
    phoneNumber: '',
    programme: '',
    course: '',
    deadline: '',
    file: null,
    description: '',
  });

  const [filePreview, setFilePreview] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, file });
    setFilePreview(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, file: null });
    setFilePreview(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid #e0e0e0',
        }}
      >
        <Typography variant="h4" align="center" color='blue' gutterBottom>
          Submit a New Assignment
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              variant="outlined"
              placeholder="Enter your full name"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              variant="outlined"
              placeholder="Enter your email"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Student ID"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              required
              variant="outlined"
              placeholder="Enter your student ID"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="0269066715"
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
              <MenuItem value="Computer Science">Computer Science</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              {/* Add more options as needed */}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Course"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              required
              variant="outlined"
              placeholder="Enter course title"
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <label htmlFor="contained-button-file">
                <Input
                  accept="*/*"
                  id="contained-button-file"
                  type="file"
                  onChange={handleFileChange}
                />
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mr: 2 }}
                >
                  Upload File
                </Button>
              </label>
              {filePreview && (
                <FilePreview>
                  <Typography>{formData.file?.name}</Typography>
                  <IconButton onClick={handleRemoveFile} size="small">
                    <CloseIcon />
                  </IconButton>
                </FilePreview>
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
              placeholder="Describe the assignment (optional)"
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 5 }}
              >
                Submit Assignment
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default NewAssignment;
