import { Box, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import FormInput from '../../ui/overrides/Input'
import { Email, Lock} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import StyledIconButton from '../../ui/overrides/IconButton'
import FormButton from '../../ui/overrides/FormButton'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { handleGoogleLogin, handleLinkedinLogin, Login } from '../../utils/auth'

const MobileLogin = ({showSignup}) => {

    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const navigate = useNavigate()
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(false); // To show loading during request
    const [error, setError] = useState('');

    const handleForgotPasswordClick = () => {
        navigate('/forgot-password'); // Redirect to the Forgot Password page
      };

      
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
      setLoading(false)
     navigate("/")
    }

};

const handleSignUpClick=()=>{
    showSignup(false)

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
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock sx={{ color: '#A9A9A9' }} />}
        
      />
        </Box>
        <Typography onClick={handleForgotPasswordClick} variant="subtitle" color="#A9A9A9">
            Forgot Password?
          </Typography>
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

        <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={2}  >
        <FormButton onClick={handleLogin} disabled={loading} >
          {loading ? 'Logging in...' : 'Log In'} <ArrowRightAltIcon className="arrow" />
        </FormButton>
        <FormButton onClick={handleSignUpClick}>
          Create a new account <ArrowRightAltIcon className="arrow" />
        </FormButton>
        </Box>


    </Box>
  )
}

export default MobileLogin