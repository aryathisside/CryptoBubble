import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert, Box, IconButton, Stack, Typography } from '@mui/material';
import FormInput from '../ui/overrides/Input';
import FormButton from '../ui/overrides/FormButton';
import Helper from '../utils/Helper';
import { Email, Lock } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useDataStore from '../store/useDataStore';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // To show loading during request

  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isMobile = useDataStore((state) => state.isMobile);


  const handlePasswordChange = async () => {
    setLoading(true);
    setError(null);
  
    if (!email || !currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      setLoading(false);
      return;
    }

    if(newPassword === currentPassword){
        setError("current password and new password should not be same")
        setLoading(false)
        return
    }
  
    try {
      const response = await axios.post(process.env.CHANGE_PASSWORD, {
        email: email,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
  
      if (response.status === 200) {
        navigate("/login")
      }
    } catch (error) {
      const message = error.response?.data?.message || "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
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
          <Box position={"absolute"} top= {isMobile?10:30} left={isMobile?10:50}>
        <IconButton onClick={()=>navigate("/login")}> <ArrowBackIosIcon sx={{color:'white !important', fontSize:"2.4rem"}} /> </IconButton>
        </Box>
      <Box
        width={isMobile ? '100%' : '45%'}
        height={'60%'}
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        gap={2}
        alignItems={'center'}>
        <Typography variant="h5" color="white">
          Set a New Password
        </Typography>

        <Typography variant="subtitle" color="#A9A9A9" textAlign={'center'}>
          Create a new password. Your new password should be different from previously used passwords.
        </Typography>

        <Box width={'80%'} display={'flex'} flexDirection={'column'} gap={2}>
          <FormInput id="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Email sx={{ color: '#A9A9A9' }} />} />

          <FormInput
            id="current password"
            label="current password"
            type={showPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            icon={
              <span onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                {showPassword ? <Lock sx={{ color: '#A9A9A9' }} /> : <VisibilityIcon sx={{ color: '#A9A9A9' }} />}
              </span>
            }
          />
          <FormInput label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <FormInput label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <FormButton sx={{ border: '2px solid white' }} onClick={handlePasswordChange}>
            Change Password
          </FormButton>
        </Box>
      </Box>
      {error && (
        <Alert style={{ position: 'absolute', right: 55, top: 5 }} variant="filled" severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Stack>
  );
};

export default ChangePassword;
