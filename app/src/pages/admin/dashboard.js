import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  List,
  ListItem,
  Divider,
  IconButton,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  LinearProgress,
  Paper,
  Drawer,
  useMediaQuery,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, useTheme } from '@mui/material/styles';
import axios from 'axios';

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

const StatCard = styled(Card)(({ theme, bgcolor }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  color: '#fff',
  backgroundColor: bgcolor,
}));

const StatTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  color: '#fff',
  marginBottom: theme.spacing(1),
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#fff',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '& .MuiTableCell-head': {
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
  },
}));

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0)

  const navigate = useNavigate()

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');

      if (userRole !== 'admin') {
        console.error('Access denied. Admin only.');
        return;
      }
      try {
        setLoading(true);
        const [usersResponse, countResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/auth/users', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8080/api/auth/users/count', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setUsers(usersResponse.data);
        setUserCount(countResponse.data.count);
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
            Dashboard
          </Typography>
          <Tooltip title="Notifications">
            <IconButton>
              <Badge badgeContent={3} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </TopBar>

        <Grid container spacing={3}>
          {[
            { title: 'Inbox', value: '24', color: '#4caf50' },
            { title: 'Total Users', value: userCount.toString(), color: '#2196f3' },
            { title: 'Completed Tasks', value: '350', color: '#ff9800' },
            { title: 'Pending Tasks', value: '45', color: '#f44336' },
          ].map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <StatCard bgcolor={stat.color}>
                <CardContent>
                  <StatTitle variant="h6">{stat.title}</StatTitle>
                  <StatValue variant="h4">{stat.value}</StatValue>
                </CardContent>
              </StatCard>
            </Grid>
          ))}
        </Grid>

        <Box mt={10}>  
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            User Management
          </Typography>
          {loading ? (
            <LinearProgress />
          ) : (
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Email</TableCell>
                    <TableCell align="left">Program</TableCell>
                    <TableCell align="left">Level</TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell align='left'>{user.name}</TableCell>
                      <TableCell align="left">{user.email}</TableCell>
                      <TableCell align="left">{user.program}</TableCell>
                      <TableCell align="left">{user.level}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </MainContent>
    </Box>
  );
};

export default AdminDashboard;