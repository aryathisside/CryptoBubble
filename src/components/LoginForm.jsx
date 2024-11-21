import { Alert, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FormInput from '../ui/overrides/Input';
import { Email, Lock } from '@mui/icons-material';
import FormButton from '../ui/overrides/FormButton';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import axios from 'axios';  // Ensure to import axios for making API calls
import { useNavigate } from 'react-router-dom';
import { Login } from '../utils/auth';

const LoginForm = ({isSignupPage}) => {
  // State to track whether it's sign up mode
  const [isSignUp, setIsSignUp] = useState(false);

  // States for input fields and error handling
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // To show loading during request
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);

      return () => clearTimeout(timer); // Cleanup the timeout on unmount or error change
    }
  }, [error]);

  const handleLogin = async () => {

      setLoading(true); // Set loading to true while waiting for the response
      const response = await Login(email, password)
      if(response.status === "failed"){
        setError(response.message)
        setEmail("")
        setPassword("")
        setLoading(false)
      }else{
        setError("")
        navigate("/")
        setLoading(false)
      }

  };

  // Function to handle the "Create a new account" button click
  const handleSignUpClick = () => {
    isSignupPage(true)
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
        password,
      });
      
    
      setIsOtpSent(true); // Move to OTP verification step
      setError(''); // Clear error messages
      console.log(response.data.message); // Confirmation message (e.g., "OTP sent to email")
    } catch (err) {
      console.log(error)
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
     navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack width={"100%"} display={"flex"} gap={2}>
      {/* Conditionally render First Name and Last Name inputs if it's Sign Up mode */}
     {
        isOtpSent ?(
            <>
             <FormInput
            id="otp"
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <FormButton onClick={verifyOtp} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'} <ArrowRightAltIcon className="arrow" />
          </FormButton>
            </>

        ):(
            <>
             {isSignUp && (
        <Stack direction="row" spacing={2}>
          <FormInput id="first-name" label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <FormInput id="last-name" label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </Stack>
      )}

      {/* Always render Email and Password inputs */}
      <FormInput
        id="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Email sx={{ color: '#A9A9A9' }} />}
        
      />

      <FormInput
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock sx={{ color: '#A9A9A9' }} />}
        
      />



{!isSignUp ? (
        <FormButton onClick={handleLogin} disabled={loading} >
          {loading ? 'Logging in...' : 'Log In'} <ArrowRightAltIcon className="arrow" />
        </FormButton>
      ) : (
        isOtpSent ? (
          <FormButton onClick={verifyOtp} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'} <ArrowRightAltIcon className="arrow" />
          </FormButton>
        ) : (
          <FormButton onClick={requestOtp} disabled={loading}>
            {loading ? 'Sending OTP...' : 'Sign Up'} <ArrowRightAltIcon className="arrow" />
          </FormButton>
        )
      )}

      {/* "Create a new account" button for switching to Sign Up mode */}
      {!isSignUp && (
        <FormButton onClick={handleSignUpClick}>
          Create a new account <ArrowRightAltIcon className="arrow" />
        </FormButton>
      )}
            </>
        )
     }

      {/* Displaying error message if login fails */}
      {error && (
  <Alert style={{position:"absolute" , right:55 ,top:5}} variant="filled" severity="error" sx={{ mt: 2 }}>
    {error}
  </Alert>
)}
    </Stack>
  );
};

export default LoginForm;
