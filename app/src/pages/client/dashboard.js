import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  LinearProgress,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
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

const ProgressCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '& .MuiTableCell-head': {
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
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
    display: 'flex',
    flexDirection: 'column',
  },
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  marginTop: 'auto',
  marginBottom: theme.spacing(2),
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

const UserDashboard = () => {
  const [assign, setAssign] = useState([])
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  

  
  const [user, setUser] = useState({
    name: "",
    program: "",
    level: "",
    avatar: "",
    overallProgress: 0,
    solvedAssignments: 0,
    accountBalance: 0
  });


  useEffect(() => {
    fetchRecentAssignments();
    fetchUserDetails()
  }, [])

  const fetchRecentAssignments = async() => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/assignments/recent', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json();
      setAssign(data)
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

      const response = await fetch('http://localhost:8080/api/auth/user/details', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setUser(prevUser => ({
        ...prevUser,
        name: data.name,
        program: data.program,
        level: data.level,
      }))
    } catch (error) {
      console.error('Error fetching user details:', error);

      
    }
  }

  

  // Mock course completion and assignment success rate
  const courseCompletion = 80;
  const assignmentSuccessRate = 90;

  // Mock course progress data
  const courseProgress = [
    { name: 'Completed', value: 60 },
    { name: 'In Progress', value: 30 },
    { name: 'Not Started', value: 10 },
  ];

  // // Mock assignments data
  // const assignments = [
  //   { id: 1, title: "Data Structures Assignment", course: "CS201", status: "Completed", dueDate: "2024-10-20", progress: 100 },
  //   { id: 2, title: "Machine Learning Project", course: "CS301", status: "In Progress", dueDate: "2024-11-05", progress: 60 },
  //   { id: 3, title: "Database Design", course: "CS202", status: "Not Started", dueDate: "2024-11-15", progress: 0 },
  // ];

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token')

    fetch('http://localhost:8080/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    }).then(() => {
      navigate('/')
    }).catch(error => {
      console.error('Logout error:', error);
      navigate('/')
    })
  };

  const drawer = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Avatar src={user.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user.program}
          </Typography>
        </Box>
      </Box>
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
      <LogoutButton
        variant="contained"
        color="primary"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
      >
        Logout
      </LogoutButton>
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
        <TopBar>
          <Box display="flex" alignItems="center">
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' }, fontSize: '3rem' }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box>
              <Typography variant={isMobile ? 'h5' : 'h4'} color='blue' sx={{ fontWeight: isMobile ? '1.5rem' : '2.125rem'}}>
                Welcome, {user.name}!
              </Typography>
              <Typography variant={isMobile ? 'body2' : 'subtitle1'} color="blue" sx={{
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}>
                {user.program} - Level {user.level}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: isMobile ? 2 : 0}}>
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

        <Grid container spacing={3}>
          {/* User Stats */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledCard>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Overall Progress
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Box width="100%" mr={1}>
                        <LinearProgress variant="determinate" value={user.overallProgress} />
                      </Box>
                      <Box minWidth={35}>
                        <Typography variant="body2" color="textSecondary">{`${user.overallProgress}%`}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledCard>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Solved Assignments
                    </Typography>
                    <Typography variant="h5" component="div">
                      {user.solvedAssignments}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledCard>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Pending Assignments
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Box width="100%" mr={1}>
                        <LinearProgress variant="determinate" value={courseCompletion} />
                      </Box>
                      <Box minWidth={35}>
                        <Typography variant="body2" color="textSecondary">{`${courseCompletion}%`}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledCard>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Assignment Success Rate
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Box width="100%" mr={1}>
                        <LinearProgress variant="determinate" value={assignmentSuccessRate} />
                      </Box>
                      <Box minWidth={35}>
                        <Typography variant="body2" color="textSecondary">{`${assignmentSuccessRate}%`}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            </Grid>
          </Grid>

          {/* Course Progress Pie Chart */}
          <Grid item xs={12} md={4}>
            <ProgressCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Course Progress
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={courseProgress}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {courseProgress.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <Box display="flex" justifyContent="center" mt={2}>
                  {courseProgress.map((entry, index) => (
                    <Box key={entry.name} display="flex" alignItems="center" mr={2}>
                      <Box width={10} height={10} bgcolor={COLORS[index % COLORS.length]} mr={1} />
                      <Typography variant="body2">{entry.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </ProgressCard>
          </Grid>

          {/* Assignments Table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Assignments
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <StyledTableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Course</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Progress</TableCell>
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {assign.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell>{assignment.programme}</TableCell>
                          <TableCell>{assignment.course}</TableCell>
                          <TableCell>
                            <Chip
                              label='Submitted'
                              color='primary'
                            />
                          </TableCell>
                          <TableCell>{new Date(assignment.deadline).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Box width="100%" mr={1}>
                                <LinearProgress variant="determinate" value={assignment.progress} />
                              </Box>
                              <Box minWidth={35}>
                                <Typography variant="body2" color="textSecondary">
                                  {`${assignment.progress}%`}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MainContent>
    </Root>
  );
};

export default UserDashboard;