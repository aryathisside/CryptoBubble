import { Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle, Grow, IconButton, Slide, Stack, Tooltip, Typography } from '@mui/material';
import { Block, Close, KeyboardArrowDown, RemoveRedEye, Reorder, SettingsSuggest, Star, Workspaces } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import StyledButton from '../ui/overrides/Button';
import { StyledIconTab, StyledIconTabs } from '../ui/overrides/IconTabs';
import useConfigStore from '../store/useConfigStore';
import useDataStore from '../store/useDataStore';
import StyledIconButton from '../ui/overrides/IconButton';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import Helper from '../utils/Helper';
import UserProfile from '../pages/UserProfile';
import axios from 'axios';
import FormInput from '../ui/overrides/Input';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const FooterTabs = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filter = useDataStore((state) => state.filter);
  const updateFilter = useDataStore((state) => state.updateFilter);
  const layout = useConfigStore((state) => state.layout);
  const setLayout = useConfigStore((state) => state.setLayout);
  const watchlists = useConfigStore((state) => state.watchlists);
  const navigation = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useDataStore();
  const setAuthenticated = useDataStore((state) => state.setAuthenticated);
  const [UserProfileModel, setUserProfileModel] = useState(false);
  const isMobile = useDataStore((state) => state.isMobile);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [deactivateModel, setDeactivateModel] = useState(false);
  const [deactivateText, setDeactivateText] = useState('');
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

  const deactivateAccount = async () => {
    const trimmedText = deactivateText?.trim().toUpperCase();

    if (!trimmedText) {
      return setError({
        message: 'Please type DELETE to deactivate your account',
        severity: 'error'
      });
    }

    if (trimmedText !== 'DELETE') {
      return setError({
        message: 'Wrong text, please check DELETE spelling',
        severity: 'error'
      });
    }

    try {
      const email = localStorage.getItem('userEmail');

      if (!email) {
        console.error('Email is required to DELETE the account.');
        return;
      }

      const response = await axios.post(process.env.DELETE_ACCOUNT, { email });

      if (response.status === 200) {
        console.log('Account DELETED successfully:', response.data.message);
        setAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setError({
          message: 'Your account has been deleted successfully.',
          severity: 'success'
        });
        setDeactivateModel(false);
        setTimeout(() => {
          navigate('/');
        }, 2000); // 2000 ms = 2 seconds
      } else {
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      if (error.response) {
        setError({
          message: `Failed to deactivate account: ${error.response.data.message}`,
          severity: 'error'
        });
      } else {
        setError({
          message: 'An error occurred. Please try again later.',
          severity: 'error'
        });
      }
    }
  };

  useEffect(() => {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const email = localStorage.getItem('userEmail');
    console.log(email);
    setProfile({ name: `${firstName} ${lastName}`, email: email });
  }, []);
  const [isGuest, setIsGuest] = useState(false);
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      setIsGuest(true);
    }
  }, []);
  const logoutConfirmation = () => {
    setUserProfileModel(false);
    setOpenDialog(true);
  };

  const handelDeactivateAccount = () => {
    setUserProfileModel(false);
    setDeactivateModel(true);
  };

  const showProfile = async () => {
    if (isGuest) {
      await logout();
    } else {
      if (isMobile) {
        console.log('kaskay');
        navigate('/user-profile');
      } else {
        console.log(UserProfileModel);
        setUserProfileModel(true);
      }
    }
  };

  useEffect(() => {
    setIsFilterOpen(false);
  }, [layout]);

  useEffect(() => {
    console.log('FooterTabs: isAuthenticated:', isAuthenticated);
    const token = localStorage.getItem('token');
    setAuthenticated(!!token);
  }, [isAuthenticated]);

  const redirectLogin = () => {
    navigation('/login');
  };

  const renderName = () => {
    if (filter.type === 'all') {
      return '1-100';
    }
    if (filter.type === 'favorite') {
      return 'Favorites';
    }
    if (filter.type === 'blocklist') {
      return 'Blocklist';
    }
    if (filter.type === 'watchlist' && filter.id) {
      const index = watchlists.findIndex((item) => item.id === filter.id);
      const wt = watchlists[index];
      return wt.name ? wt.name : `Watchlist ${index + 1}`;
    }
    return '1-100';
  };

  const updateFilterHandle = (fil) => {
    updateFilter(fil);
    setIsFilterOpen(false);
  };

  const handleLogout = () => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const userEmail = queryParams.get('userEmail');

    // Remove query parameters from the URL
    if (token || userEmail) {
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
    setOpenDialog(false);
    logout();
  };

  return (
    <Box pb={1 / 2} width={'40%'}>
      <Stack direction="row" justifyContent="flex-end" gap={1}>
        <Box position="relative" ml={1}>
          <Tooltip title="Wish list" arrow>
            <StyledButton onClick={() => setIsFilterOpen(!isFilterOpen)} disabled={!isAuthenticated} sx={{ height: '100%' }}>
              <Stack direction="row" display="flex" justifyContent="center" alignItems="center">
                <Typography color="white" fontWeight="bold" textTransform="none" fontSize={'12px'}>
                  {renderName()}
                </Typography>
                {isAuthenticated && (
                  <KeyboardArrowDown
                    sx={{
                      transition: 'transform 0.4s',
                      transform: isFilterOpen ? 'rotateZ(180deg)' : ''
                    }}
                  />
                )}
              </Stack>
            </StyledButton>
          </Tooltip>

          {isAuthenticated && (
            <Grow in={isFilterOpen}>
              <Box
                position="absolute"
                sx={{
                  display: isFilterOpen ? 'block' : 'none',
                  background: '#171A24',
                  backdropFilter: 'blur(8px)',
                  width: 600,
                  maxWidth: '90vw',
                  right: 0,
                  top: 70,
                  zIndex: 1000,
                  borderRadius: 1,
                  boxShadow: '0px 0px 7px 7px #00000027',
                  px: 2,
                  py: 1
                }}>
                <Stack>
                  <Box>
                    <StyledButton
                      onClick={() => updateFilterHandle({ type: 'all', id: null })}
                      sx={{ mr: 1, mb: 1, background: filter.type === 'all' ? '#0477DD !important' : null }}>
                      <Typography color="white" textTransform="none">
                        1-100
                      </Typography>
                    </StyledButton>
                    <StyledButton
                      onClick={() => updateFilterHandle({ type: 'favorite', id: null })}
                      sx={{ mr: 1, mb: 1, px: 1, background: filter.type === 'favorite' ? '#0477DD !important' : null }}>
                      <Star />
                      <Typography color="white" textTransform="none" ml={1 / 2}>
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
                            background: filter.type === 'watchlist' && filter.id === item.id ? '#0477DD !important' : null
                          }}>
                          <RemoveRedEye />
                          <Typography color="white" textTransform="none" ml={1 / 2}>
                            {item.name || `Watchlist ${index + 1}`}
                          </Typography>
                        </StyledButton>
                      );
                    })}
                    <StyledButton
                      onClick={() => updateFilterHandle({ type: 'blocklist', id: null })}
                      sx={{ mr: 1, mb: 1, px: 1, background: filter.type === 'blocklist' ? '#0477DD !important' : null }}>
                      <Block />
                      <Typography color="white" textTransform="none" ml={1 / 2}>
                        Blocklist
                      </Typography>
                    </StyledButton>
                  </Box>
                </Stack>
              </Box>
            </Grow>
          )}
        </Box>

        <Box mr={1} display={'flex'} gap={1}>
          <Tooltip title="Bubble view" arrow>
            <StyledIconButton
              sx={{ height: '100%' }}
              onClick={() => setLayout('bubble')} // Update this to handle the layout changes as needed
            >
              <Workspaces /> {/* or whichever icon you want to show */}
            </StyledIconButton>
          </Tooltip>
          <Tooltip title="List view" arrow>
            <StyledIconButton
              sx={{ height: '100%' }}
              onClick={() => setLayout('list')} // Update this to handle the layout changes as needed
            >
              <Reorder /> {/* or whichever icon you want to show */}
            </StyledIconButton>
          </Tooltip>
          <Tooltip title="setting" arrow>
            <StyledIconButton
              sx={{ height: '100%' }}
              onClick={() => setLayout('settings')} // Update this to handle the layout changes as needed
            >
              <SettingsSuggest /> {/* or whichever icon you want to show */}
            </StyledIconButton>
          </Tooltip>

          {isAuthenticated ? (
            <Tooltip title="Profile" arrow>
              <StyledButton onClick={showProfile} sx={{ height: '100%' }}>
                {/* <ExitToAppIcon /> */}
                <PermIdentityIcon />
              </StyledButton>
            </Tooltip>
          ) : (
            <StyledIconButton onClick={redirectLogin} sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <PersonOutlineOutlinedIcon />
              {/* <Typography color="white" sx={{ fontSize: '12px', ml: 1 }}>
                Login
              </Typography> */}
            </StyledIconButton>
          )}

          {/* <StyledIconTabs value={layout} onChange={(e, val) => setLayout(val)} sx={{ flexGrow: '1' }}>
            <StyledIconTab value="bubble" icon={<Workspaces />} />
            <StyledIconTab value="list" icon={<Reorder />} />
            <StyledIconTab value="settings" icon={<SettingsSuggest />} />
          </StyledIconTabs> */}
        </Box>

        <Dialog
          fullWidth
          open={UserProfileModel}
          maxWidth="md"
          scroll="paper"
          TransitionComponent={Transition}
          sx={{ '& .MuiDialog-container': { alignItems: 'center', justifyContent:"center" } }}
          PaperProps={{
            sx: {
              background: 'black',
              backdropFilter: 'blur(8px)',
              marginTop: 'min(10%, 100px)',
              marginX: 2,
              width: 'calc(30% - 32px)'
            }
          }}>
          <DialogTitle typography="body1" display="flex" justifyContent="flex-end" color="white" sx={{ padding: 1 }}>
            <StyledIconButton onClick={() => setUserProfileModel(!UserProfileModel)}>
              <Close />
            </StyledIconButton>
          </DialogTitle>
          <DialogContent sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // Centers content horizontally
      justifyContent: 'center', // Centers content vertically
      width: '100%', // Ensure it takes full width
      textAlign: 'center' // Centers text content
    }}>
            <Box height={'100%'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
              <Box>
                <Box width={'100%'} p={2}>
                  <Box>
                    <Typography>
                      <Box
                        sx={{
                          width: 100, // Circle size
                          height: 100,
                          backgroundColor: '#171A24',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto' 
                        }}>
                        <PermIdentityIcon sx={{ color: 'white', fontSize:"70px" }} /> {/* White icon */}
                      </Box>
                    </Typography>

                    <Typography variant="subtitle" color={'#A9A9A9'} sx={{fontSize:"12px"}}>
                      Name
                    </Typography>
                  </Box>
                  <Typography variant="h6" color={'white'}>
                    {profile.name}
                  </Typography>
                </Box>
                <Box width={'100%'}>
                  {/* <Box display={'flex'}> */}
                    <Typography variant="subtitle" color={'#A9A9A9'}  sx={{fontSize:"12px"}}>
                      Email
                    </Typography>
                  {/* </Box> */}
                  <Typography variant="h6" color={'white'}>
                    {profile.email}
                  </Typography>
                </Box>
              </Box>
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'} p={2} flexDirection={'column'} gap={2}>
                <StyledIconButton
                  onClick={logoutConfirmation}
                  sx={{
                    width: '260px',  // Set width to 60% of the modal
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#171A24',
                    py: 3,  // Adjust padding for better size
                    mx: 'auto', // Centers the button horizontally
                    my: 2
                  }}>
                  {/* <ExitToAppIcon /> */}
                  <LogoutIcon />
                  <Typography color="white" sx={{ fontSize: '18px', ml: 1 }}>
                    Log Out
                  </Typography>
                </StyledIconButton>
                <Typography variant="h7" color={'#FF3333'} sx={{ cursor: 'pointer' }} onClick={handelDeactivateAccount} mt={2}>
                Deactivate Account
                </Typography>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              backgroundColor: '#171A24', // Match your popup background color
              boxShadow: 'none', // Remove shadow
              border: 'none', // Remove any border
              widthL: '30%',
              py: 2
            }
          }}
          open={openDialog}
          onClose={() => setOpenDialog(false)}>
          <DialogContent
            sx={{
              textAlign: 'center',
              backgroundColor: '#171A24',
              color: 'white',
              p: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}>
            <Box bgcolor={'#FF3333'} width={'fit-content'} p={1} borderRadius={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
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
              px: 2
            }}>
            <StyledIconButton
              onClick={() => setOpenDialog(false)}
              variant="contained"
              sx={{
                backgroundColor: '#2A2E36',
                height: '50px',

                color: 'white',
                fontSize: '15px',
                width: '50%',
                '&:hover': { backgroundColor: '#555' }
              }}>
              No, stay
            </StyledIconButton>
            <StyledIconButton
              onClick={handleLogout}
              variant="contained"
              sx={{
                backgroundColor: '#FF3333',
                height: '50px',
                fontSize: '15px',
                color: 'white',
                width: '50%',
                '&:hover': { backgroundColor: '#FF5555' }
              }}>
              Yes, logout
            </StyledIconButton>
          </DialogActions>
        </Dialog>

        <Dialog
          fullWidth
          open={deactivateModel}
          maxWidth="md"
          scroll="paper"
          TransitionComponent={Transition}
          sx={{ '& .MuiDialog-container': { alignItems: 'start' } }}
          PaperProps={{
            sx: {
              background: '#171A24',
              backdropFilter: 'blur(8px)',
              marginTop: 'min(10%, 100px)',
              marginX: 2,
              width: 'calc(30% - 32px)'
            }
          }}>
          <DialogTitle typography="body1" display="flex" justifyContent="flex-end" color="white" sx={{ padding: 1 }}>
            <StyledIconButton onClick={() => setDeactivateModel(false)}>
              <Close />
            </StyledIconButton>
          </DialogTitle>
          <DialogContent>
            <Box display={'flex'} p={2} flexDirection={'column'} gap={2}>
              <Typography variant="subtitle" fontSize={'14px'}>
                Type “DELETE” to deactivate your account.
              </Typography>
              <FormInput
                id="deactivate"
                label="Type here"
                value={deactivateText}
                onChange={(e) => setDeactivateText(e.target.value)}

                // icon={<PersonIcon sx={{ color: '#A9A9A9' }} />}
              />
              <StyledIconButton
                onClick={deactivateAccount}
                sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3, border: '2px solid #FF3333' }}>
                {/* <ExitToAppIcon /> */}
                {/* <LogoutIcon/> */}
                <Typography color="#FF3333" sx={{ fontSize: '15px', ml: 1 }}>
                  Delete my account
                </Typography>
              </StyledIconButton>
            </Box>
          </DialogContent>
        </Dialog>

        {error && (
          <Alert style={{ position: 'absolute', right: 55, top: 5, zIndex: 1000 }} variant="filled" severity={error.severity} sx={{ mt: 2 }}>
            {error.message}
          </Alert>
        )}
      </Stack>
    </Box>
  );
};

export default FooterTabs;
