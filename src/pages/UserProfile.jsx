import { Box, Dialog, DialogActions, DialogContent, emphasize, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import Helper from '../utils/Helper';
import StyledIconButton from '../ui/overrides/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import useDataStore from '../store/useDataStore';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const isMobile = useDataStore((state) => state.isMobile);
  const { isAuthenticated, logout } = useDataStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [profile, setProfile]=useState({name:"", email:""})
   const navigate = useNavigate()

   useEffect(()=>{
    
    const firstName = localStorage.getItem("firstName")
    const lastName = localStorage.getItem("lastName")
    const email = localStorage.getItem("userEmail")
    console.log(email)
    setProfile({name:`${firstName} ${lastName}`, email:email})
   },[])





  
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
  return (
    <Stack
      sx={{
        display: 'flex',
        p: 0,
        height: '100%', // Ensure full viewport height
        backgroundColor: '#000000',
        width:"100%"
      }}>
      <Box width={'100%'} height={'100px'} bgcolor={'#171A24'} display={'flex'}>
        <Box sx={{cursor:"pointer"}} height={'100%'} width={'25%'} display={'flex'} justifyContent={'center'} alignItems={'center'} onClick={()=>navigate("/")}>
          <KeyboardBackspaceIcon sx={{ color: 'white', fontSize: '40px' }} />
        </Box>
        <Box height={'100%'} width={'50%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Typography variant="h5" color={'white'}>
            User’s Profile
          </Typography>
        </Box>
      </Box>
      <Box height={'100%'} display={'flex'} flexDirection={'column'} justifyContent={"space-between"} >
       <Box>
       <Box width={isMobile ? '100%' : '50%'} p={2}>
          <Box display={'flex'}>
            <PermIdentityIcon />
            <Typography variant="subtitle" color={'#A9A9A9'}>
              Name
            </Typography>
          </Box>
          <Typography variant="h6" color={'white'}>
           {profile.name}
          </Typography>
        </Box>
        <Box width={isMobile ? '100%' : '50%'} p={2}>
          <Box display={'flex'}>
            <PermIdentityIcon />
            <Typography variant="subtitle" color={'#A9A9A9'}>
              Email
            </Typography>
          </Box>
          <Typography variant="h6" color={'white'}>
            {profile.email}
          </Typography>
        </Box>
       </Box>
       <Box display={"flex"}  justifyContent={"center"} alignItems={"center"} p={2} flexDirection={"column"} gap={2} mb={8}>
       <StyledIconButton onClick={() => setOpenDialog(true)} sx={{  width:"100%", display:
              'flex', justifyContent:"center", alignItems:"center", py:4,
              
              }}>
              {/* <ExitToAppIcon /> */}
              <LogoutIcon/>
              <Typography color="white"  sx={{ fontSize: '20px', ml: 1 }}
           >
           
                Logout
              </Typography>
            </StyledIconButton>
            <Typography variant='h7' color={"#FF3333"} sx={{cursor:"pointer"}} onClick={()=>navigate("/deactivate-account")}>
              Delete Account
            </Typography>
       </Box>
      </Box>
      {/* Confirmation Dialog */}
      <Dialog fullWidth maxWidth="sm" PaperProps={{
    sx: {
      backgroundColor: '#171A24', // Match your popup background color
      boxShadow: 'none', // Remove shadow
      border: 'none', // Remove any border
    },
  }}  open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent
          sx={{
            textAlign: 'center',
            backgroundColor: '#171A24',
            color: 'white',
            p: 3,
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            flexDirection:"column"

          }}
        >
          <Box bgcolor={"#FF3333"} width={"fit-content"} p={1} borderRadius={1} display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <LogoutIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Are you logging out?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            backgroundColor: '#171A24',
            px:2
            
            
          }}
        >
          <StyledIconButton
            onClick={() => setOpenDialog(false)}
            variant="contained"
            sx={{
              backgroundColor: '#2A2E36',
              color: 'white',
              fontSize:"15px",
              width:"50%",
              '&:hover': { backgroundColor: '#555' },
            }}
          >
            No, stay
          </StyledIconButton>
          <StyledIconButton
            onClick={handleLogout}
            variant="contained"
            sx={{
              backgroundColor: '#FF3333',
              fontSize:"15px",
              color: 'white',
              width:"50%",
              '&:hover': { backgroundColor: '#FF5555' },
            }}
          >
            Yes, logout
          </StyledIconButton>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default UserProfile;
