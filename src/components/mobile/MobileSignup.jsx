import { Box, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import FormInput from '../../ui/overrides/Input';
import StyledIconButton from '../../ui/overrides/IconButton';
import FormButton from '../../ui/overrides/FormButton';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Email, Lock } from '@mui/icons-material';
import { handleGoogleLogin, handleLinkedinLogin } from '../../utils/auth';

const MobileSignup = ({ showSignup }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false); // To show loading during request
  const [error, setError] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const requestOtp = async () => {
    try {
      setLoading(true);

      const response = await axios.post(process.env.USER_SIGNUP, {
        firstname: firstName,
        lastname: lastName,
        email,
        password
      });

      setIsOtpSent(true); // Move to OTP verification step
      setError(''); // Clear error messages
      console.log(response.data.message); // Confirmation message (e.g., "OTP sent to email")
    } catch (err) {
      console.log(error);
      setError(err.response?.data?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  
  const verifyOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(process.env.VERIFY_OTP, {
        email,
        otp,
        firstname: firstName,
        lastname: lastName,
        password,
      });
      localStorage.setItem('token', response.data.token); // Store token if needed
      localStorage.setItem("userEmail", response.data.userEmail)
      console.log('Signup successful:', response.data);
      setError('');
      setIsSignUp(false); // Reset form to login state
      setIsOtpSent(false); // Reset OTP sent status
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    showSignup(true);
  };
  return (
    <Box width={'100%'} height={'100%'} display={'flex'} flexDirection={'column'} py={2} gap={3} alignItems={'center'} px={2}>
      <Box width={'100%'}  display={'flex'} flexDirection={'column'} gap={3} alignItems={'center'}  >
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} width={'100%'} gap={1}>
          <Typography variant="h5" color="white" fontWeight={'bold'}>
            Create An a Account
          </Typography>
          <Typography variant="subtitle" color="#A9A9A9">
            Signup with your email
          </Typography>
        </Box>
        {isOtpSent ? (
          <Box display={'flex'} flexDirection={'column'} width={'100%'} gap={2}>
            <FormInput id="otp" label="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          </Box>
        ) : (
          <Box display={'flex'} flexDirection={'column'} width={'100%'} gap={1}>
            <FormInput id="first-name" label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <FormInput id="last-name" label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <FormInput id="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Email sx={{ color: '#A9A9A9' }} />} />

            <FormInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock sx={{ color: '#A9A9A9' }} />}
            />
          </Box>
        )}
        {/* <Typography onClick={handleForgotPasswordClick} variant="subtitle" color="#A9A9A9">
            Forgot Password?
          </Typography> */}
        <Typography variant="subtitle" color="#A9A9A9">
          Login with social media
        </Typography>
        <Grid display={'flex'} gap={2}>
          <StyledIconButton onClick={handleGoogleLogin} sx={{ height: '100%', width: 'fit-content', backgroundColor: '#2A2E36' }}>
            <img height={25} src="Social Media.png" alt="" />
          </StyledIconButton>
          <StyledIconButton onClick={handleLinkedinLogin} sx={{ height: '100%', width: 'fit-content', backgroundColor: '#2A2E36' }}>
            <img height={25} src="Social Media (1).png" alt="" />
          </StyledIconButton>
        </Grid>
      </Box>

      <Box display={'flex'} flexDirection={'column'} width={'100%'} gap={2} justifySelf={'flex-end'}>
        {isOtpSent ? (
         <FormButton onClick={verifyOtp} disabled={loading}>
         {loading ? 'Verifying...' : 'Verify OTP'} <ArrowRightAltIcon className="arrow" />
       </FormButton>
        ) : (
          <FormButton onClick={requestOtp} disabled={loading}>
            {loading ? 'Sending OTP...' : 'Sign Up'} <ArrowRightAltIcon className="arrow" />
          </FormButton>
        )}
        <FormButton onClick={handleLoginClick}>
          Login <ArrowRightAltIcon className="arrow" />
        </FormButton>
      </Box>
    </Box>
  );
};

export default MobileSignup;
