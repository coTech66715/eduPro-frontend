import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, CircularProgress, Box, Container, Typography, FormControl, InputLabel, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import logo from '../../../src/images/logo.png'; 

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', name: '', phone: '', university: '', program: '', level: '',
    email: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signup', formData);
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src={logo} alt="EduPro Logo" style={{ width: '200px', marginBottom: '20px' }} />
        <Typography variant="h4" color='blue' align="center">Welcome back to EduPro</Typography>
        <Typography component="h1" color='blue' variant="h4">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField name="username" label="Username" onChange={handleChange} fullWidth required margin="normal" />
          <TextField name="name" label="Name" onChange={handleChange} fullWidth required margin="normal" />
          <TextField name="phone" label="Phone Number" onChange={handleChange} fullWidth required margin="normal" />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="university-label">University</InputLabel>
            <Select
              labelId="university-label"
              name="university"
              value={formData.university}
              label="University"
              onChange={handleChange}
              required
            >
              <MenuItem value="University of Ghana">University of Ghana</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="program-label">Program</InputLabel>
            <Select
              labelId="program-label"
              name="program"
              value={formData.program}
              label="Program"
              onChange={handleChange}
              required
            >
              <MenuItem value="Computer Science">Computer Science</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="level-label">Level</InputLabel>
            <Select
              labelId="level-label"
              name="level"
              value={formData.level}
              label="Level"
              onChange={handleChange}
              required
            >
              {Array.from({ length: 6 }, (_, i) => i + 1).map(i => (
                <MenuItem key={i} value={i * 100}>{i * 100}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField name="email" label="Email" type="email" onChange={handleChange} fullWidth required margin="normal" />
          <TextField name="password" label="Password" type="password" autoComplete="off" onChange={handleChange} fullWidth required margin="normal" />
          <TextField name="confirmPassword" label="Confirm Password" type="password" autoComplete="off" onChange={handleChange} fullWidth required margin="normal" />

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CircularProgress size={24} sx={{ color: 'blue' }} />
            </Box>
          )}
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Sign Up'
            )}
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                Log in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;