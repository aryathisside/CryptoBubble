import { Alert, Box, IconButton, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FormInput from '../ui/overrides/Input'
import { Email } from '@mui/icons-material'
import FormButton from '../ui/overrides/FormButton'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import axios from 'axios'
import Helper from '../utils/Helper'
import { useNavigate } from 'react-router-dom'
import StyledIconButton from '../ui/overrides/IconButton'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import useDataStore from '../store/useDataStore'

const ForgotPasswordPage = () => {
    const [email,setEmail]=useState("")
    const [error, setError]=useState({
      message:"",
      severity:""
    })

    const isMobile = useDataStore((state) => state.isMobile);
    const navigate = useNavigate()
  
 

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

    const sendResetLink = async () => {
        try {
            const response = await axios.post(process.env.FORGOT_PASSWORD, { email });
            if (response.status === 200) {
                setError({
                  message:"Password reset link has been sent to your email.",
                  severity:"success"
                })
            }
        } catch (error) {
          if(error.response){
            console.log(error.response.data.message)
            setError({
              message:error.response?.data?.message,
              severity:"error"
            })
            return
          }
        
            setError({
              message:"Failed to send reset link. Please try again.",
              severity:"error"
            })
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
        <Box position={'absolute'} display={"flex"} top={20} right={20} >
        <StyledIconButton sx={{width:"90px",py:2, display:"flex", justifyContent:"center"}} onClick={() => navigate("/login")}>
          {' '}
          <ArrowLeftIcon sx={{ color: '#A9A9A9 !important', fontSize:"2rem" }} />
         <Typography variant='subtitle2' color= '#A9A9A9 '>
         Back
         </Typography>
        </StyledIconButton>
      </Box>
      <Alert style={{position:"absolute" , right:5 ,top:5}} variant="filled" severity={error.severity} sx={{ mt: 2 }}>
    {error.message}
  </Alert>
    </Stack>
  )
}

export default ForgotPasswordPage