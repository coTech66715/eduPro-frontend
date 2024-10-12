import React from 'react';
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
  Paper,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';

// Styled components
const Sidebar = styled('div')(({ theme }) => ({
  width: '240px',
  height: '100vh',
  backgroundColor: '#f4f5f7',
  position: 'fixed',
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
  marginLeft: '240px',
  padding: '20px',
  backgroundColor: '#ffffff',
  minHeight: '100vh',
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    padding: '10px',
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
  backgroundColor: theme.palette.primary.main, // Blue background
  '& .MuiTableCell-head': {
    color: theme.palette.primary.contrastText, // Ensuring text is visible on blue background
    fontWeight: 'bold',
  },
}));

const AdminDashboard = () => {
  return (
    <div>
      {/* Sidebar */}
      <Sidebar>
        <Typography variant="h5" align="center" sx={{ padding: '16px', fontWeight: 'bold' }}>
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
            <React.Fragment key={item.text}>
              <SidebarItem>
                <SidebarIcon>{item.icon}</SidebarIcon>
                {item.text}
              </SidebarItem>
              {index !== 5 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        {/* Top Bar */}
        <TopBar>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Dashboard
          </Typography>
          <IconButton>
            <Badge badgeContent={3} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </TopBar>

        {/* Cards */}
        <Grid container spacing={2}>
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

        {/* User Management Section */}
        <Box mt={5}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            User Management
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">Role</TableCell>
                  <TableCell align="left">Status</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {[
                  { name: 'John Doe', email: 'johndoe@example.com', role: 'User', status: 'Active' },
                  { name: 'Jane Smith', email: 'janesmith@example.com', role: 'User', status: 'Inactive' },
                  { name: 'Michael Brown', email: 'michaelbrown@example.com', role: 'User', status: 'Active' },
                ].map((user) => (
                  <TableRow key={user.email}>
                    <TableCell align="left">{user.name}</TableCell>
                    <TableCell align="left">{user.email}</TableCell>
                    <TableCell align="left">{user.role}</TableCell>
                    <TableCell align="left">{user.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </MainContent>
    </div>
  );
};

export default AdminDashboard;