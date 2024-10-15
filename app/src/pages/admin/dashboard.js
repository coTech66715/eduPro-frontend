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
} from '@mui/material';
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

const MainContent = styled('div')(({ theme }) => ({
  padding: '20px',
  backgroundColor: '#ffffff',
  minHeight: '100vh',
  [theme.breakpoints.up('sm')]: {
    marginLeft: '240px',
  },
}));

const TopBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
}));

const StatCard = styled(Card)(({ theme, bgcolor }) => ({
  margin: '10px 0',
  padding: '16px',
  borderRadius: '8px',
  color: '#fff',
  textAlign: 'center',
  backgroundColor: bgcolor,
}));

const StatTitle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: '#fff',
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '28px',
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

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');

      if (userRole !== 'admin') {
        console.error('Access denied. Admin only.');
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
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
          { icon: <HomeIcon />, text: 'Home' },
          { icon: <AssignmentIcon />, text: 'Assignments' },
          { icon: <PeopleIcon />, text: 'User Management' },
          { icon: <GroupIcon />, text: 'Groups' },
          { icon: <VpnKeyIcon />, text: 'API Keys' },
          { icon: <SettingsIcon />, text: 'Settings' },
        ].map((item, index) => (
          <Tooltip key={item.text} title={item.text} placement="right">
            <React.Fragment>
              <SidebarItem onClick={isMobile ? handleDrawerToggle : undefined}>
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

      <MainContent>
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
            { title: 'Total Users', value: '1,200', color: '#2196f3' },
            { title: 'Completed Tasks', value: '350', color: '#ff9800' },
            { title: 'Pending Tasks', value: '45', color: '#f44336' },
          ].map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <StatCard bgcolor={stat.color}>
                <CardContent>
                  <StatTitle>{stat.title}</StatTitle>
                  <StatValue>{stat.value}</StatValue>
                </CardContent>
              </StatCard>
            </Grid>
          ))}
        </Grid>

        <Box mt={5}>
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