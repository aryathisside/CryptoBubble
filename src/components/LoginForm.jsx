import { Alert, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FormInput from '../ui/overrides/Input';
import { Email, Lock } from '@mui/icons-material';
import FormButton from '../ui/overrides/FormButton';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import axios from 'axios'; // Ensure to import axios for making API calls
import { useNavigate } from 'react-router-dom';
import { Login } from '../utils/auth';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useDataStore from '../store/useDataStore';

const LoginForm = ({ isSignupPage }) => {
  // State to track whether it's sign up mode
  const [isSignUp, setIsSignUp] = useState(false);

  // States for input fields and error handling
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({
    message: '',
    severity: ''
  });
  const [loading, setLoading] = useState(false); // To show loading during request
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();
  const setAuthenticated = useDataStore((state) => state.setAuthenticated);

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

  const handleLogin = async () => {
    setLoading(true); // Set loading to true while waiting for the response
    const response = await Login(email, password);
    if (response.status === 'failed') {
      setError({
        message: response.message,
        severity: 'error'
      });
      setEmail('');
      setPassword('');
      setAuthenticated(true);
      setLoading(false);
    } else {
      setError({
        message: 'Logged in successfully...',
        severity: 'success'
      });
      navigate('/');
      setLoading(false);
    }
  };
  const backToLogin = () => {
    isSignupPage(false);
    setIsSignUp(false);
  };

  // Function to handle the "Create a new account" button click
  const handleSignUpClick = () => {
    isSignupPage(true);
    setIsSignUp(true); // Toggle to Sign Up mode
    setIsOtpSent(false); // Reset OTP state on sign-up click
  };

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
      // Clear error messages
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

      setIsSignUp(false); // Reset form to login state
      setIsOtpSent(false); // Reset OTP sent status
      navigate('/');
    } catch (err) {
      setError({
        message: err.response?.data?.message || 'OTP verification failed',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Stack width={'100%'} display={'flex'} gap={2}>
      {/* Conditionally render First Name and Last Name inputs if it's Sign Up mode */}
      {isOtpSent ? (
        <>
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

          <FormButton onClick={verifyOtp} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'} <ArrowRightAltIcon className="arrow" />
          </FormButton>
        </>
      ) : (
        <>
          {isSignUp && (
            <Stack direction="row" spacing={2}>
              <FormInput
                id="first-name"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                icon={<PersonIcon sx={{ color: '#A9A9A9' }} />}
              />
              <FormInput
                id="last-name"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                icon={<PersonIcon sx={{ color: '#A9A9A9' }} />}
              />
            </Stack>
          )}

          {/* Always render Email and Password inputs */}
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

          {!isSignUp ? (
            <FormButton onClick={handleLogin} disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'} <ArrowRightAltIcon className="arrow" />
            </FormButton>
          ) : isOtpSent ? (
            <FormButton onClick={verifyOtp} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'} <ArrowRightAltIcon className="arrow" />
            </FormButton>
          ) : (
            <FormButton onClick={requestOtp} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Sign Up'} <ArrowRightAltIcon className="arrow" />
            </FormButton>
          )}

          {/* "Create a new account" button for switching to Sign Up mode */}
          {!isSignUp ? (
            <FormButton onClick={handleSignUpClick}>
              Create a new account <ArrowRightAltIcon className="arrow" />
            </FormButton>
          ) : (
            <FormButton onClick={backToLogin}>
              Back to Login <ArrowRightAltIcon className="arrow" />
            </FormButton>
          )}
        </>
      )}

      {/* Displaying error message if login fails */}
      {error && (
        <Alert style={{ position: 'absolute', right: 55, top: 5, zIndex: 1000 }} variant="filled" severity={error.severity} sx={{ mt: 2 }}>
          {error.message}
        </Alert>
      )}
    </Stack>
  );
};

export default LoginForm;
