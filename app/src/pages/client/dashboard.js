import React from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  sidebar: {
    width: '250px',
    height: '100vh',
    backgroundColor: '#2c3e50', // Darker background for better contrast
    color: 'white',
    position: 'fixed',
    paddingTop: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    marginLeft: '250px',
    padding: '20px',
  },
  card: {
    margin: '16px',
    transition: '0.3s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  notification: {
    marginTop: '16px',
  },
  listItem: {
    '&:hover': {
      backgroundColor: '#34495e', // Change color on hover
    },
  },
  totalAssignmentsCard: {
    backgroundColor: '#3498db', // Blue color
    color: 'white',
  },
  pendingAssignmentsCard: {
    backgroundColor: '#f1c40f', // Yellow color
    color: 'black',
  },
  completedAssignmentsCard: {
    backgroundColor: '#2ecc71', // Green color
    color: 'white',
  },
}));

const UserDashboard = () => {
  const classes = useStyles();

  return (
    <div>
      {/* Sidebar */}
      <div className={classes.sidebar}>
        <Typography variant="h5" align="center" style={{ padding: '16px' }}>
          LCMS
        </Typography>
        <List>
          <ListItem button className={classes.listItem}>
            Dashboard
          </ListItem>
          <Divider />
          <ListItem button className={classes.listItem}>
            My Assignments
          </ListItem>
          <ListItem button className={classes.listItem}>
            Notifications
          </ListItem>
          <ListItem button className={classes.listItem}>
            Profile
          </ListItem>
          <ListItem button className={classes.listItem}>
            Settings
          </ListItem>
          <ListItem button className={classes.listItem}>
            Logout
          </ListItem>
        </List>
      </div>

      {/* Main Content */}
      <div className={classes.mainContent}>
        <Typography variant="h4" align="center" gutterBottom>
          User Dashboard
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={3}>
            <Card className={`${classes.card} ${classes.totalAssignmentsCard}`}>
              <CardContent>
                <Typography variant="h5">Total Assignments</Typography>
                <Typography variant="h6">100</Typography>
              </CardContent>
              <CardActions>
                <Button color="inherit">View Assignments</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card className={`${classes.card} ${classes.pendingAssignmentsCard}`}>
              <CardContent>
                <Typography variant="h5">Pending Assignments</Typography>
                <Typography variant="h6">15</Typography>
              </CardContent>
              <CardActions>
                <Button color="inherit">View Pending</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card className={`${classes.card} ${classes.completedAssignmentsCard}`}>
              <CardContent>
                <Typography variant="h5">Completed Assignments</Typography>
                <Typography variant="h6">85</Typography>
              </CardContent>
              <CardActions>
                <Button color="inherit">View Completed</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

         {/* Open Assignments Table */}
         <Box className={classes.notification}>
          <Typography variant="h6">
            Open Assignments</Typography> <Typography variant="body1">You have no new notifications.</Typography> </Box> </div> </div> ); };

export default UserDashboard            
