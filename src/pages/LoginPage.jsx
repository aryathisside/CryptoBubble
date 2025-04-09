import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, IconButton, Stack, Typography } from '@mui/material';
import StyledIconButton from '../ui/overrides/IconButton';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import Helper from '../utils/Helper';
import MobileLogin from '../components/mobile/MobileLogin';
import MobileSignup from '../components/mobile/MobileSignup';
import { handleGoogleLogin, handleLinkedinLogin } from '../utils/auth';
import BackgrouondImage from '/Loginbg.png';

import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import useDataStore from '../store/useDataStore';


const LoginPage = () => {
  const [isLogin, setIslogin] = useState(true);
  const navigate = useNavigate();
  const isMobile = useDataStore((state) => state.isMobile);
  const handleMobileToggle = (val) => {
    setIslogin(val);
  };
 

  const handleForgotPasswordClick = () => {
    navigate('/forgot-password'); // Redirect to the Forgot Password page
  };
  const [isSignup, setIsSignup] = useState(false);

  const handleIsSignupPage = (val) => {
    setIsSignup(val);
  };


  return isMobile ? (
    <Stack
      sx={{
        display: 'flex',
        p: 0,
        height: '100vh', // Ensure full viewport height
        backgroundImage: `url(${BackgrouondImage})`, // Set background image
        backgroundSize: 'cover', // Make the image cover the entire area
        backgroundPosition: 'center', // Center the background image
        backgroundRepeat: 'no-repeat' // Prevent the image from repeating
      }}>
      <Box width={'100%'} height={'100%'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
        {isLogin ? <MobileLogin showSignup={handleMobileToggle} /> : <MobileSignup showSignup={handleMobileToggle} />}
      </Box>
    </Stack>
  ) : (
    <Stack
      sx={{
        display: 'flex',
        p: 0,
        height: '100vh', // Ensure full viewport height
        backgroundImage: `url(${BackgrouondImage})`, // Set background image
        backgroundSize: 'cover', // Make the image cover the entire area
        backgroundPosition: 'right', // Center the background image
        backgroundRepeat: 'no-repeat' // Prevent the image from repeating
      }}>
      <Box width={'40%'} height={'100%'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
        <Box display={'flex'} flexDirection={'column'} width={'90%'} gap={3} padding={3}>
          <Box display="flex" gap={1} alignItems="center" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            <img height={40} width={40} src={`./image2.png`} />
            <Typography variant="h5" color="white">
              Crypto+ bubble
            </Typography>
          </Box>
          {isSignup ? (
            <Typography variant="h3" color="white" width={'100%'}>
              Create New Account
            </Typography>
          ) : (
            <Typography variant="h3" color="white" width={'100%'}>
              Welcome Back
            </Typography>
          )}

          {/* <Box p={1} display={'flex'} flexDirection={'column'} width={'100%'} gap={1} padding={0}>
            <Typography variant="subtitle" color="#A9A9A9">
              Log in with your social media
            </Typography>
            <Grid display={'flex'} gap={2}>
              <StyledIconButton onClick={handleGoogleLogin} sx={{ height: '100%', width: 'fit-content', backgroundColor: '#2A2E36' }}>
                <img height={25} src="Social Media.png" alt="" />
              </StyledIconButton>
              <StyledIconButton onClick={handleLinkedinLogin} sx={{ height: '100%', width: 'fit-content', backgroundColor: '#2A2E36' }}>
                <img height={25} src="Social Media (1).png" alt="" />
              </StyledIconButton>
              <StyledIconButton sx={{ height: '100%', width: 'fit-content', backgroundColor: '#2A2E36' }}>
              <img height={25} src="Social Media (2).png" alt="" />
            </StyledIconButton>
            </Grid>
          </Box> */}
          <Box width={'100%'} border={'2px solid #2A2E36'}></Box>
          <Box width={'100%'} display={'flex'} justifyContent={'space-between'}>
            <Typography variant="subtitle" color="#A9A9A9">
              Or log in with your email.
            </Typography>
           {!isSignup &&  <Typography onClick={handleForgotPasswordClick} variant="subtitle" color="#A9A9A9">
              Forgot Password?
            </Typography>}
          </Box>
          <LoginForm isSignupPage={handleIsSignupPage} />
        </Box>
      </Box>
      <Box position={'absolute'} display={"flex"} top={20} right={20} >
        <StyledIconButton sx={{width:90, display:"flex", justifyContent:"center", alignItems:"center"}} onClick={() => navigate("/")}>
          {' '}
          <ArrowLeftIcon sx={{ color: '#A9A9A9 !important', fontSize:"2rem" }} />
         <Typography variant='subtitle2' color= '#A9A9A9 '>
         Home
         </Typography>
        </StyledIconButton>
      </Box>
    </Stack>
  );
};

export default LoginPage;
