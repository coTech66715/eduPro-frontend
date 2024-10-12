import React, { useState } from 'react';
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
  Divider,
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
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddIcon from '@mui/icons-material/Add';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const MainContent = styled('div')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  [theme.breakpoints.up('md')]: {
    marginLeft: drawerWidth,
  },
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
  },
}));

const UserDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Mock user data - replace with actual user data
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    avatar: "/api/placeholder/100/100",
    university: "University of Ghana",
    program: "Computer Science",
    level: "300",
    accountBalance: 50.00,
    overallProgress: 65,
  };

  // Mock assignments data - replace with actual data
  const assignments = [
    { id: 1, title: 'Math Problem Set', course: 'MATH301', status: 'In Progress', dueDate: '2024-10-20', progress: 60 },
    { id: 2, title: 'Programming Project', course: 'CS305', status: 'Completed', dueDate: '2024-10-15', progress: 100 },
    { id: 3, title: 'Database Design', course: 'CS310', status: 'Pending', dueDate: '2024-10-25', progress: 0 },
  ];

  // Mock course progress data for pie chart
  const courseProgress = [
    { name: 'Completed', value: 5 },
    { name: 'In Progress', value: 3 },
    { name: 'Not Started', value: 2 },
  ];
  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

  // Mock data for new progress cards
  const courseCompletion = 75;
  const assignmentSuccessRate = 88;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
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
          { text: 'All Assignments', icon: <AssignmentIcon /> },
          { text: 'My Courses', icon: <SchoolIcon /> },
          { text: 'Academic Progress', icon: <TimelineIcon /> },
          { text: 'Payment History', icon: <AccountBalanceWalletIcon /> },
        ].map((item, index) => (
          <ListItem button key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box>
      <SideDrawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </SideDrawer>  
      <MainContent>
        {/* Top Bar */}
        <TopBar>
          <Box display="flex" alignItems="center">
            <Avatar src={user.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Welcome, {user.name}!
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {user.program} - Level {user.level}
              </Typography>
            </Box>
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
                      {user.accountBalance}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
              {/* New Course Completion Card */}
              <Grid item xs={12} sm={6} >
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
              {/* New Assignment Success Rate Card */}
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
                      {assignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell>{assignment.title}</TableCell>
                          <TableCell>{assignment.course}</TableCell>
                          <TableCell>
                            <Chip
                              label={assignment.status}
                              color={
                                assignment.status === 'Completed'
                                  ? 'success'
                                  : assignment.status === 'In Progress'
                                  ? 'primary'
                                  : 'warning'
                              }
                            />
                          </TableCell>
                          <TableCell>{assignment.dueDate}</TableCell>
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
    </Box>
  );
};

export default UserDashboard;