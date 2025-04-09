import { Alert, Box, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FormInput from '../../ui/overrides/Input';
import StyledIconButton from '../../ui/overrides/IconButton';
import FormButton from '../../ui/overrides/FormButton';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import axios from 'axios';
import { Email, Lock } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const MobileSignup = ({ showSignup }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // To show loading during request
  const [error, setError] = useState({
    message: '',
    severity: ''
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError({
          message: '',
          severity: ''
        });
      }, 5000);

      return () => clearTimeout(timer); // Cleanup the timeout on unmount or error change
    }
  }, [error]);

  const requestOtp = async () => {
    try {
      setLoading(true);

      const response = await axios.post(process.env.USER_SIGNUP, {
        firstname: firstName,
        lastname: lastName,
        email,
        password
      });
      setError({
        message: 'Otp send successfully to your email',
        severity: 'success'
      });

      setIsOtpSent(true); // Move to OTP verification step
      
      console.log(response.data.message); // Confirmation message (e.g., "OTP sent to email")
    } catch (err) {
      console.log(error);
      setError({
        message: err.response?.data?.message || 'An error occurred during signup',
        severity: 'error'
      });
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
        password
      });
      setError({
        message: 'Your account has been created successfully...',
        severity: 'success'
      });
      localStorage.setItem('token', response.data.token); // Store token if needed
      localStorage.setItem('userEmail', response.data.userEmail);
      localStorage.setItem('firstName', response.data.firstName);
      localStorage.setItem('lastName', response.data.lastName);
      console.log('Signup successful:', response.data);
     

      setIsOtpSent(false); // Reset OTP sent status
      window.location.reload();
    } catch (err) {
      setError({
        message: err.response?.data?.message || 'OTP verification failed',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    showSignup(true);
  };
  return (
    <Box width={'100%'} height={'100%'} display={'flex'} flexDirection={'column'} py={2} gap={3} alignItems={'center'} px={2}>
      <Box width={'100%'} display={'flex'} flexDirection={'column'} gap={3} alignItems={'center'}>
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
            <FormInput
              id="otp"
              label="OTP"
              type="text"
              value={otp}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault(); // Prevent non-numeric input
                }
              }}
              onChange={(e) => setOtp(e.target.value)}
            />
          </Box>
        ) : (
          <Box display={'flex'} flexDirection={'column'} width={'100%'} gap={2}>
            <FormInput id="first-name" label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <FormInput id="last-name" label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <FormInput id="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Email sx={{ color: '#A9A9A9' }} />} />

            <FormInput
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={
                <span onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                  {showPassword ? <Lock sx={{ color: '#A9A9A9' }} /> : <VisibilityIcon sx={{ color: '#A9A9A9' }} />}
                </span>
              }
            />
          </Box>
        )}
        {/* <Typography onClick={handleForgotPasswordClick} variant="subtitle" color="#A9A9A9">
            Forgot Password?
          </Typography> */}
        {/* <Typography variant="subtitle" color="#A9A9A9">
          Login with social media
        </Typography>
        <Grid display={'flex'} gap={2}>
          <StyledIconButton onClick={handleGoogleLogin} sx={{ height: '100%', width: 'fit-content', backgroundColor: '#2A2E36' }}>
            <img height={25} src="Social Media.png" alt="" />
          </StyledIconButton>
          <StyledIconButton onClick={handleLinkedinLogin} sx={{ height: '100%', width: 'fit-content', backgroundColor: '#2A2E36' }}>
            <img height={25} src="Social Media (1).png" alt="" />
          </StyledIconButton>
        </Grid> */}
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
          Back To Login <ArrowRightAltIcon className="arrow" />
        </FormButton>
      </Box>
      {error && (
        <Alert  style={{
          position: 'absolute',
          top: 5, // Keep this as required
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width:"90%"
        }} variant="filled" severity={error.severity} sx={{ mt: 2 }}>
          {error.message}
        </Alert>
      )}
    </Box>
  );
};

export default MobileSignup;
