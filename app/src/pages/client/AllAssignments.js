import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Avatar,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DownloadIcon from '@mui/icons-material/Download';
import PaymentIcon from '@mui/icons-material/Payment';
import axios from 'axios'

import { Link, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Root = styled('div')({
  display: 'flex',
});

const MainContent = styled('div')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
}));

const TopBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const SideDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.default,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '& .MuiTableCell-head': {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1rem'
  }
}));



const AllAssignments = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [completedAssignments, setCompletedAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllAssignments();
  }, []);

  const fetchAllAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/assignments/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const mappedAssignments = response.data.map(assignment => ({
        ...assignment,
        status: mapStatus(assignment.status)
      }))

      setAssignments(mappedAssignments);
      setFilteredAssignments(mappedAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const mapStatus = (backendStatus) => {
    const statusMap = {
      'pending': 'Pending',
      'in_progress': 'In Progress',
      'submitted': 'Completed'
    };
    return statusMap[backendStatus] || backendStatus;
  };

  useEffect(() => {
    fetchUserDetails();
    fetchAllAssignments();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/auth/user/details', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  



  useEffect(() => {
    const filtered = assignments.filter(assignment => 
      (statusFilter === 'All' || assignment.status === statusFilter) &&
      (assignment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
       assignment.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredAssignments(filtered);
  }, [searchTerm, statusFilter, assignments]);

  

  const groupedAssignments = {
    Completed: filteredAssignments.filter(a => a.status === 'Completed'),
    'In Progress': filteredAssignments.filter(a => a.status === 'In Progress'),
    Pending: filteredAssignments.filter(a => a.status === 'Pending'),
  };

  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => a.status === 'Completed').length,
    inProgress: assignments.filter(a => a.status === 'In Progress').length,
    pending: assignments.filter(a => a.status === 'Pending').length,
  };

  

  const chartData = [
    { name: 'Completed', value: stats.completed, color: theme.palette.success.main },
    { name: 'In Progress', value: stats.inProgress, color: theme.palette.primary.main },
    { name: 'Pending', value: stats.pending, color: theme.palette.warning.main },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  
  const drawer = (
    <div>
      {user && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar 
            sx={{ width: 60, height: 60, mr: 2 }}
            {...(user.name ? { children: user.name.charAt(0) } : {})}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user.program} - Level {user.level}
            </Typography>
          </Box>
        </Box>
      )}
      <List>
        {[
          { text: 'Dashboard', icon: <TimelineIcon />, path: '/user-dashboard' },
          { text: 'All Assignments', icon: <AssignmentIcon />, path: '/assignments' },
          { text: 'Payment History', icon: <AccountBalanceWalletIcon />, path: '/payment-history' },
        ].map((item, index) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
    </div>
  );

  return (
    <Root>
      <SideDrawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </SideDrawer>
      <MainContent>
        {/* Top Bar */}
        <TopBar>
          <Box display="flex" alignItems="center">
            {isMobile && (
              <IconButton
                color="blue"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h4" color='blue' sx={{ fontWeight: 'bold' }}>
              All Assignments
            </Typography>
          </Box>
          <Box>
            <IconButton>
              <Badge badgeContent={3} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Button
              component={Link}
              to="/new-assignment"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ ml: 2 }}
            >
              New Assignment
            </Button>
          </Box>
        </TopBar>

        {/* Stats and Chart */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Assignment Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              {Object.entries(stats).map(([key, value]) => (
                <Grid item xs={6} key={key}>
                  <StyledCard sx={{ bgcolor: theme.palette.background.paper }}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Typography>
                      <Typography variant="h5" component="div" sx={{ color: theme.palette.primary.main }}>
                        {value}
                      </Typography>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search assignments"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Assignments Table */}
        {Object.entries(groupedAssignments).map(([status, assignments]) => (
          <Box key={status} sx={{ mb: 4 }}>
            <Typography variant="h6" color='primary' gutterBottom>
              {status} ({assignments.length})
            </Typography>
            <TableContainer component={Paper} sx={{ 
                boxShadow: 3,
                borderRadius: 2,
                overflow: 'hidden'
              }}>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell>Course</StyledTableCell>
                    <StyledTableCell>Deadline</StyledTableCell>
                    {status === 'Completed' && <StyledTableCell>Fee</StyledTableCell>}
                    {status === 'Completed' && <StyledTableCell>Download</StyledTableCell>}
                    {status === 'Completed' && <StyledTableCell>Payment</StyledTableCell>}
                    {(status === 'In Progress' || status === 'Pending') && <StyledTableCell>Progress</StyledTableCell>}
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment._id} sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                      <TableCell>{assignment.course}</TableCell>
                      <TableCell>{new Date(assignment.deadline).toLocaleDateString()}</TableCell>
                      {status === 'Completed' && (
                        <>
                          <TableCell>{assignment.fee ? `GHS ${assignment.fee.toFixed(2)}` : 'N/A'}</TableCell>
                          <TableCell>
                            <IconButton >
                              <DownloadIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton>
                              <PaymentIcon />
                            </IconButton>
                          </TableCell>
                        </>
                      )}
                      {status === 'In Progress' && (
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress variant="determinate" value={60} />
                            </Box>
                            <Box sx={{ minWidth:  35 }}>
                              <Typography variant="body2" color="text.secondary">60%</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      )}
                      {status === 'Pending' && (
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress variant="determinate" value={30} />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                              <Typography variant="body2" color="text.secondary">30%</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </MainContent>
    </Root>
  );
};

export default AllAssignments;