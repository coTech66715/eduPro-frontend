import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logo from '../../../src/images/logo.png'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:8080/api/auth/login', { username, password });
      
      // Save the token and user info in localStorage
      localStorage.setItem('token', data.token);
      
      localStorage.setItem('userRole', data.role); // Store the user role

      // Redirect based on user role using navigate
      navigate(data.role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
    } catch (err) {
      setError('Invalid login credentials');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <img src={logo} alt="EduPro Logo" style={{ width: '200px', marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
        <Typography variant="h4" color='blue' align="center">Welcome back to EduPro</Typography>
        {error && <Typography color="error" align="center">{error}</Typography>}
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} sx={{ color: 'white' }} />
              </Box>
            ) : (
              'Login'
            )}
          </Button>
          <Grid container>
            <Grid item>
              <Typography variant="body2" align="center">
                Don’t have an account? <a href="/signup">Sign up</a>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} sx={{ color: 'blue' }} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Login;
