import React from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from 'react-router-dom';

const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

const StyledAccountBalanceWalletIcon = styled(AccountBalanceWalletIcon)(({ theme }) => ({
  fontSize: '5rem',
  color: theme.palette.primary.main,
}));

const StyledErrorOutlineIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: '3rem',
  color: theme.palette.error.main,
  position: 'absolute',
  top: '-10px',
  right: '-10px',
}));

const PaymentHistory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Root>
      <IconWrapper>
        <Box position="relative">
          <StyledAccountBalanceWalletIcon />
          <StyledErrorOutlineIcon />
        </Box>
      </IconWrapper>
      <Typography variant={isMobile ? 'h4' : 'h3'} align="center" gutterBottom color='red'>
        Oops! Payment History Not Found
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" paragraph>
        We're sorry, but the payment history you're looking for seems to be missing.
      </Typography>
      <Typography variant="body1" align="center" color="textSecondary" paragraph>
        Don't worry, your wallet is safe! This might be a temporary glitch or the page may still be under construction.
      </Typography>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        sx={{ mt: 3 }}
      >
        <Button
          onClick={handleGoBack}
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<ArrowBackIcon />}
        >
          Go Back
        </Button>
        <Button
          component={Link}
          to="/user-dashboard"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AccountBalanceWalletIcon />}
        >
          Return to Dashboard
        </Button>
      </Stack>
    </Root>
  );
};

export default PaymentHistory;