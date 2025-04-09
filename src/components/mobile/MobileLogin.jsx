import { Alert, Box, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FormInput from '../../ui/overrides/Input'
import { Email, Lock} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import StyledIconButton from '../../ui/overrides/IconButton'
import FormButton from '../../ui/overrides/FormButton'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { handleGoogleLogin, handleLinkedinLogin, Login } from '../../utils/auth'
import VisibilityIcon from '@mui/icons-material/Visibility';
import useDataStore from '../../store/useDataStore'

const MobileLogin = ({showSignup}) => {

    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const navigate = useNavigate()
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(false); // To show loading during request
    const [error, setError] = useState({
      message: '',
      severity: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const setAuthenticated = useDataStore((state) => state.setAuthenticated);


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

    const handleForgotPasswordClick = () => {
        navigate('/forgot-password'); // Redirect to the Forgot Password page
      };

      
  const handleLogin = async () => {

    setLoading(true); // Set loading to true while waiting for the response
    const response = await Login(email, password)
    if(response.status === "failed"){
      setError({
        message: response.message,
        severity: 'error'
      });
      setEmail("")
      setPassword("")
      setLoading(false)
    }else{
      setError({
        message: 'Logged in successfully...',
        severity: 'success'
      });
      setLoading(false)
      setAuthenticated(true)
      // window.location.href = "/"
      navigate("/")
      // window.location.reload()
    }

};

const handleSignUpClick=()=>{
    showSignup(false)

}
const handleSkip=async ()=>{
  await localStorage.setItem('token',"login without crediantials");
  // window.location.href = "/"
  navigate("/")
  setAuthenticated(true)
}
  return (
    <Box  width={'100%'} height={'100%'}  display={'flex'} flexDirection={'column'} gap={3}  px={2} >
     <Box width={'100%'}   display={'flex'} flexDirection={'column'} py={4}  gap={3} alignItems={"center"} px={2} >
     <Box display={"flex"} flexDirection={"column"} justifyContent={"center"
       } alignItems={"center"} width={"100%"} gap={1}>
       <Typography variant="h5" color="white" fontWeight={"bold"}>
            Login
          </Typography>
          <Typography variant="subtitle" color="#A9A9A9">
            Login with your email
          </Typography>
       </Box>
        <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={2}>
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
        type= {showPassword ? "text" :"password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={
          <span onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
            {showPassword ? <Lock sx={{ color: "#A9A9A9" }} /> : <VisibilityIcon sx={{ color: "#A9A9A9" }} />}
          </span>
        }
        
      />
        </Box>
        <Typography onClick={handleForgotPasswordClick} variant="subtitle" color="#A9A9A9">
            Forgot Password?
          </Typography>
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

        <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={2}  >
        <FormButton onClick={handleLogin} disabled={loading} >
          {loading ? 'Logging in...' : 'Log In'} <ArrowRightAltIcon className="arrow" />
        </FormButton>
        <FormButton onClick={handleSignUpClick}>
          Create a new account <ArrowRightAltIcon className="arrow" />
        </FormButton>
        <FormButton onClick={handleSkip}>
          Skip <ArrowRightAltIcon className="arrow" />
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
  )
}

export default MobileLogin