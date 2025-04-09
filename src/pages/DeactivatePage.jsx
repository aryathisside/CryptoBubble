import { Alert, Box, Dialog, DialogActions, DialogContent, Input, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import Helper from '../utils/Helper';
import StyledIconButton from '../ui/overrides/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import useDataStore from '../store/useDataStore';
import { Button } from 'react-bootstrap';
import FormInput from '../ui/overrides/Input';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeactivateAccount = () => {
  const isMobile = useDataStore((state) => state.isMobile);
  const { isAuthenticated, logout } = useDataStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [deactivateText, setDeactivateText] = useState("")
  const navigate = useNavigate()
  const setAuthenticated = useDataStore((state) => state.setAuthenticated);
  const [error, setError] = useState({
    message: '',
    severity: ''
  });


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

  
  const handleLogout =async() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const userEmail = queryParams.get('userEmail');
  
    // Remove query parameters from the URL
    if (token || userEmail) {
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
   await logout()
      window.location.href = '/';
  
  };

  const deactivateAccount = async () => {
    const trimmedText = deactivateText?.trim().toUpperCase(); // Trim spaces from input

    if (!trimmedText) {
        return setError({
            message: "Please type DELETE to deactivate your account",
            severity: "error",
        });
    }

    if (trimmedText !== "DELETE") {
        return setError({
            message: "Wrong text, please check DELETE spelling",
            severity: "error",
        });
    }

    try {
        const email = localStorage.getItem("userEmail");

        if (!email) {
            console.error("Email is required to DELETE the account.");
            return;
        }

        const response = await axios.post(process.env.DELETE_ACCOUNT, { email });

        if (response.status === 200) {
            console.log("Account DELETED successfully:", response.data.message);
            setAuthenticated(false);
            localStorage.removeItem("token");
            localStorage.removeItem("userEmail");
            setError({
                message: "Your account has been deleted successfully.",
                severity: "success",
            });
            setTimeout(() => {
              navigate("/");
          }, 2000); // 2000 ms = 2 seconds
        } else {
            console.error("Unexpected response:", response);
        }
    } catch (error) {
        if (error.response) {
            setError({
                message: `Failed to deactivate account: ${error.response.data.message}`,
                severity: "error",
            });
        } else {
            setError({
                message: "An error occurred. Please try again later.",
                severity: "error",
            });
        }
    }
};

  return (
    <Stack
      sx={{
        display: 'flex',
        p: 0,
        height: '100%', // Ensure full viewport height
        backgroundColor: '#000000'
      }}>
      <Box width={'100%'} height={'100px'} bgcolor={'#171A24'} display={'flex'}>
        <Box sx={{cursor:"pointer"}} height={'100%'}width={'25%'} display={'flex'} justifyContent={'center'} alignItems={'center'} onClick={()=>navigate("/user-profile")}>
          <KeyboardBackspaceIcon sx={{ color: 'white', fontSize: '40px' }} />
        </Box>
        <Box height={'100%'} width={isMobile? "75%": '50%'} display={'flex'} alignItems={'center'} >
          <Typography variant="h5" color={'white'}>
          Delete Account
          </Typography>
        </Box>
      </Box>
      <Box  display={"flex"}  p={2} flexDirection={"column"} gap={2}>
        <Typography variant='subtitle' fontSize={"14px"}>
        Type “DELETE” to deactivate your account.
        </Typography>
        <FormInput
        
                id="deactivate"
                label="Type here"
                value={deactivateText}
                onChange={(e) => setDeactivateText(e.target.value)}
                
                // icon={<PersonIcon sx={{ color: '#A9A9A9' }} />}
              />
               <StyledIconButton onClick={deactivateAccount} sx={{  width:"100%", display:
              'flex', justifyContent:"center", alignItems:"center", py:3,
              border:"2px solid #FF3333"
              
              }}>
              {/* <ExitToAppIcon /> */}
              {/* <LogoutIcon/> */}
              <Typography color="#FF3333"  sx={{ fontSize: '15px', ml: 1 }}
           >
           
           Delete my account
              </Typography>
            </StyledIconButton>
      
      </Box>

      {error && (
  <Alert
    style={{
      position: 'absolute',
      top: 5, // Keep this as required
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      width:"90%"
    }}
    variant="filled"
    severity={error.severity}
    sx={{ mt: 2 }}
  >
    {error.message}
  </Alert>
)}

      

    </Stack>
  );
};

export default DeactivateAccount;
