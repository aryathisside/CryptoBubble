import { Box, IconButton, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FormInput from '../ui/overrides/Input'
import { Email } from '@mui/icons-material'
import FormButton from '../ui/overrides/FormButton'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import axios from 'axios'
import Helper from '../utils/Helper'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom'

const ForgotPasswordPage = () => {
    const [email,setEmail]=useState("")

    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate()
  
    useEffect(() => {
      // Handle window resize for mobile detection
      const cleanup = Helper.handleResize(setIsMobile);
      return cleanup;
    }, []);

    const sendResetLink = async () => {
        try {
            const response = await axios.post(process.env.FORGOT_PASSWORD, { email });
            if (response.status === 200) {
                alert("Password reset link has been sent to your email.");
            }
        } catch (error) {
            alert("Failed to send reset link. Please try again.");
            console.error("Error in sendResetLink:", error);
        }
    };
  return (
    <Stack
    sx={{
      display: 'flex',
      justifyContent:"center",
      alignItems:"center",
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
       <Box width={isMobile?"100%":"45%"} height={"60%"}  display={"flex"} justifyContent={"center"} flexDirection={"column"} gap={2} alignItems={"center"}>
       <Typography variant="h5" color="white">
       Forgot Password?
          </Typography>
          <Typography variant="subtitle" color="#A9A9A9" textAlign={"center"} >
          Please enter the email address associated with your account and we will send you a password reset link.
          </Typography>
      <Box width={"80%"} display={"flex"} flexDirection={"column"} gap={2}>
      <FormInput
        id="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Email sx={{ color: '#A9A9A9' }} />}
        
      />
       <FormButton sx={{border:"2px solid white"}} onClick={sendResetLink}  >
          Send reset Link <ArrowRightAltIcon className="arrow" />
        </FormButton>
      </Box>
          
        </Box> 
    </Stack>
  )
}

export default ForgotPasswordPage