import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
  Box,
  IconButton,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';

const Input = styled('input')({
  display: 'none',
});

const FilePreview = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const NewAssignment = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: '',
    phoneNumber: '',
    programme: user?.program || '',
    course: '',
    deadline: null,
    file: null,
    description: '',
  });

  const [filePreview, setFilePreview] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, deadline: date });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, file: file });
    setFilePreview(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, file: null });
    setFilePreview(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', {
      ...formData,
      deadline: formData.deadline ? format(formData.deadline, 'yyyy-MM-dd') : null,
    });
    // You can add logic here to handle the form submission
  };

  useEffect(() => {
    // Cleanup function to revoke the file preview URL
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          New Assignment
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* ... (other form fields remain the same) */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Deadline"
                value={formData.deadline}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Grid>
            {/* ... (rest of the form fields) */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                
              >
                Submit Assignment
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </LocalizationProvider>
  );
};

export default NewAssignment;