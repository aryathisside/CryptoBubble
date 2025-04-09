import { Alert, Box, Stack, SvgIcon, Typography } from '@mui/material';
import { Add, Block, Delete, Edit, RemoveRedEye, Star } from '@mui/icons-material';
import StyledIconButton from '../../ui/overrides/IconButton';
import useConfigStore from '../../store/useConfigStore';
import StyledTextField from '../../ui/overrides/TextField';
import Logo from '/image2.png';
import ColorSettings from './ColorSettings';

import React, { useEffect, useState } from 'react';
import useDataStore from '../../store/useDataStore';
import StyledButton from '../../ui/overrides/Button';
import Scrollbar from 'react-scrollbars-custom';
import Helper from '../../utils/Helper';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const SettingsView = () => {
  const watchlists = useConfigStore((state) => state.watchlists);
  const updateAllWatchlist = useConfigStore((state) => state.updateAllWatchlist);
  const updateFilter = useDataStore((state) => state.updateFilter);
  const filter = useDataStore((state) => state.filter);
  const isMobile = useDataStore((state) => state.isMobile);
    const setLayout = useConfigStore((state) => state.setLayout);
  const { isAuthenticated, logout } = useDataStore();
   const [error, setError] = useState({
      message: '',
      severity: ''
    });

  const [isGuest, setIsGuest] = useState(false);
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

  const deactivateAccount = async () => {
    try {

      const email = localStorage.getItem("userEmail")
      // Validate email
      if (!email) {
        console.error("Email is required to deactivate the account.");
        return;
      }
  
      // Make the API call
      const response = await axios.post(process.env.DELETE_ACCOUNT, {
        email,
      });
  
      // Handle success
      if (response.status === 200) {
        console.log("Account deactivated successfully:", response.data.message);
        setAuthenticated(false)
        localStorage.removeItem("token")
        localStorage.removeItem("userEmail")
        setError( {
          message: "Your account has been deactivated successfully.",
          severity:"success"
        }  );

       
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        console.error("Error from server:", error.response.data.message);
        alert(`Failed to deactivate account: ${error.response.data.message}`);
      } else {
        console.error("Network or other error:", error.message);
        alert("An error occurred. Please try again later.");
      }
    }
  };
  

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      setIsGuest(true);
    }
  }, []);


  const updateName = (id, value) => {
    const index = watchlists.findIndex((item) => item.id === id);
    watchlists[index].name = value;
    updateAllWatchlist(watchlists);
  };

  const addWatchList = () => {
    if(isGuest){
      setError({
        message:"Please Login first to add watchlist",
        severity:"warning"
      })
      return

    }


    if(!isAuthenticated){
      setError({
        message:"Please Login first to add watchlist",
        severity:"warning"
      })
      return
    }
    const item = {
      id: Date.now(),
      name: '',
      symbols: []
    };
    watchlists.push(item);
    updateAllWatchlist(watchlists);
  };

  const removeWatchlist = (id) => {
    const wl = watchlists.filter((item) => item.id !== id);
    updateAllWatchlist(wl);
    updateFilter({ type: 'all', id: null });
  };

  const updateFilterHandle = (fil) => {
    if (isGuest) {
      return logout();
    }
    updateFilter(fil);
  };
  return (
    <Box sx={{ flexGrow: 1, width: '100%',  display:"flex", justifyContent:"center",mt:isMobile?0:4 }}>
      <Stack sx={{position:"relative",}} width={isMobile?"100%": "50%"} height={isMobile?"100%": "85%"} p={isMobile?0:2} bgcolor={"#171A24"} borderRadius={"10px"}>
        <CloseIcon onClick={()=> setLayout("bubble")} sx={{ 
        position: "absolute", 
        top: 10, 
        right: 10, 
        cursor: "pointer",
        zIndex: 10
      }} />
        <Box display="flex" justifyContent="space-between" alignItems={'center'} mb={2} mt={4}>
          <Typography typography="h6" color="white">
            Colors
          </Typography>
          <ColorSettings />
        </Box>
        {isMobile && (
          <Box
            display={'flex'}
            flexWrap={'wrap'}
            marginTop={2}
            height={120}
            sx={{
              overflowY: 'scroll', // Enable vertical scrolling
              scrollbarWidth: 'none', // Hide scrollbar for Firefox
              '&::-webkit-scrollbar': { display: 'none' } // Hide scrollbar for Chrome, Safari, and Edge
            }}>
            <Scrollbar
              style={{ height: '100%' }}
              noScrollX
              thumbYProps={{
                renderer: (props) => {
                  const { elementRef, ...restProps } = props;
                  return (
                    <div
                      {...restProps}
                      ref={elementRef}
                      style={{
                        backgroundColor: '#CFA935', // Thumb color
                        borderRadius: '8px' // Optional: rounded corners for the scrollbar thumb
                      }}
                    />
                  );
                }
              }}>
              <StyledButton
                onClick={() => updateFilterHandle({ type: 'all', id: null })}
                sx={{ mr: 1, mb: 1, background: filter.type === 'all' ? '#0477DD !important' : null, fontSize: '12px' }}>
                <Typography variant="subtitle" color="white" textTransform="none">
                  1-100
                </Typography>
              </StyledButton>
              <StyledButton
                onClick={() => updateFilterHandle({ type: 'favorite', id: null })}
                sx={{ mr: 1, mb: 1, px: 1, background: filter.type === 'favorite' ? '#0477DD !important' : null, fontSize: '12px' }}>
                {/* <Star /> */}
                <Typography variant="subtitle" color="white" textTransform="none" ml={1 / 2}>
                  Favorites
                </Typography>
              </StyledButton>
              {watchlists.map((item, index) => {
                return (
                  <StyledButton
                    onClick={() => updateFilterHandle({ type: 'watchlist', id: item.id })}
                    key={item.id}
                    sx={{
                      mr: 1,
                      mb: 1,
                      px: 1,
                      background: filter.type === 'watchlist' && filter.id === item.id ? '#0477DD !important' : null,
                      fontSize: '12px'
                    }}>
                    {/* <RemoveRedEye /> */}
                    <Typography variant="subtitle" color="white" textTransform="none" ml={1 / 2}>
                      {item.name || `Watchlist ${index + 1}`}
                    </Typography>
                  </StyledButton>
                );
              })}
              <StyledButton
                onClick={() => updateFilterHandle({ type: 'blocklist', id: null })}
                sx={{ mr: 1, mb: 1, px: 1, background: filter.type === 'blocklist' ? '#0477DD !important' : null, fontSize: '12px' }}>
                <Block />
                <Typography variant="subtitle" color="white" textTransform="none" ml={1 / 2}>
                  Blocklist
                </Typography>
              </StyledButton>
            </Scrollbar>
          </Box>
        )}
        <Box display="flex" justifyContent="space-between">
          <Typography typography="h6" color="white">
            Watchlists
          </Typography>
          <StyledIconButton>
            <Add onClick={() => addWatchList()} />
          </StyledIconButton>
        </Box>
        <Box
          marginTop={2}
          height={isMobile ? 240 : 420}
          mb={2}
          sx={{
            overflowY: 'scroll', // Enable vertical scrolling
            scrollbarWidth: 'none', // Hide scrollbar for Firefox
            '&::-webkit-scrollbar': { display: 'none' } // Hide scrollbar for Chrome, Safari, and Edge
          }}>
          <Scrollbar
            style={{ height: '100%' }}
            noScrollX
            thumbYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return (
                  <div
                    {...restProps}
                    ref={elementRef}
                    style={{
                      backgroundColor: '#CFA935', // Thumb color
                      borderRadius: '8px' // Optional: rounded corners for the scrollbar thumb
                    }}
                  />
                );
              }
            }}>
            {watchlists.map((item, index) => {
              return (
                <Box display="flex" key={item.id} alignItems="center" my={1} px={2}>
                  <StyledTextField
                    fullWidth
                    placeholder={`Watchlist ${index + 1}`}
                    value={item.name}
                    onChange={(e) => updateName(item.id, e.target.value)}
                    InputProps={{ startAdornment: <Edit /> }}
                    inputProps={{
                      maxLength: process.env.WATCHLIST_CHARACTER_LIMIT, // Set the character limit
                    }}
                  />
                  <StyledIconButton onClick={() => removeWatchlist(item.id)} sx={{ ml: 1 }}>
                    <Delete />
                  </StyledIconButton>
                </Box>
              );
            })}
          </Scrollbar>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} width={'100%'} gap={2} px={1}>
     

         <Box display={"flex"} width={"100%"} gap={1} justifyContent={"flex-end"}>
         <StyledButton sx={{ width: isMobile?'50%':"50%", fontSize: '12px', gap: 1 }} onClick={() => window.open(`${process.env.DISCORD}`, '_blank')}>
            <SvgIcon viewBox="0 0 24 24">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
            </SvgIcon>{' '}
            Join Discord
          </StyledButton>
          <StyledButton
            sx={{ width: isMobile ? '50%' : '50%', fontSize: '12px', gap: 1 }}
            onClick={() => window.open(`${process.env.CONTACT_US}`, '_blank')}>
            <SvgIcon>
              <SupportAgentIcon />
            </SvgIcon>{' '}
            Contact Us
          </StyledButton>
         </Box>
        </Box>

        {/* <Box display="flex" justifyContent="center" mt={7} sx={{ opacity: 0.85 }}>
          <img src={Logo} alt="AI + Bubbles" width={300} style={{ maxWidth: '40vw' }} />
        </Box> */}
      </Stack>

      {error && (
              <Alert  style={{
                position: 'absolute',
                top: 5, // Keep this as required
                left: isMobile? '50%':null,
                transform: isMobile && 'translateX(-50%)',
                zIndex: 1000,
                width: isMobile? "90%": null,
                right: !isMobile && 55
              }} variant="filled" severity={error.severity} sx={{ mt: 2 }}>
               
                {error.message}
              </Alert>
            )}
    </Box>
  );
};

export default SettingsView;
