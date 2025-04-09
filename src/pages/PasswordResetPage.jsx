import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Stack, Typography } from '@mui/material';
import FormInput from '../ui/overrides/Input';
import FormButton from '../ui/overrides/FormButton';
import Helper from '../utils/Helper';
import useDataStore from '../store/useDataStore';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  const isMobile = useDataStore((state) => state.isMobile);

  const [error, setError]=useState({
    message:"",
    severity:""
  })

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError({
          message:"",
          severity:""
        });
      }, 5000);

      return () => clearTimeout(timer); // Cleanup the timeout on unmount or error change
    }
  }, [error]);

 
  

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');



  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      setError({
        message:'Passwords do not match',
        severity:"warning"
      })
      return;
    }

    try {
        console.log(token , email)
      const response = await axios.post(process.env.RESET_PASSWORD, {
        email,
        token,
        newPassword:password
      });

      if (response.status === 200) {
        setError(
          {
            message:'Password has been reset successfully.',
            severity:"success"
          }
          
        )
        navigate('/login'); // Redirect to login after successful reset
      }
    } catch (error) {
      setError(
        {
          message:'Failed to reset password. Please try again.',
          severity:"success"
        }
        
      )
      console.error('Error in handlePasswordReset:', error);
    }
  };

  return (
    <Stack
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 0,
        height: '100vh', // Ensure full viewport height
        backgroundImage: `
              linear-gradient(270deg, rgba(23, 26, 36, 0.5) 0%, rgba(23, 26, 36, 0.85) 41.51%, #171A24 93.39%), 
              url(/LoginBackground.svg)`, // Combine gradient and image
        backgroundSize: 'cover', // Make the image cover the entire area
        backgroundPosition: 'right', // Center the background image
        backgroundRepeat: 'no-repeat' // Prevent the image from repeating
      }}>
      <Box width={isMobile?"100%":'45%'} height={'60%'} display={'flex'} justifyContent={'center'} flexDirection={'column'} gap={2} alignItems={'center'}>
      <Typography variant="h5" color="white">Set a New Password</Typography>

        <Typography variant="subtitle" color="#A9A9A9" textAlign={'center'}>
          Create a new password. Your new password should be different from previously used passwords.
        </Typography>

        <Box width={'80%'} display={'flex'} flexDirection={'column'} gap={2}>
        <FormInput label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <FormInput label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <FormButton sx={{border:"2px solid white"}} onClick={handlePasswordReset}>Reset Password</FormButton>
      </Box>
      </Box>
    
    </Stack>
  );
};

export default ResetPasswordPage;
