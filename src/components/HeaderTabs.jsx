/* eslint-disable prettier/prettier */
import { Box, Stack, ClickAwayListener, Grow, Typography, TextField, Slide, Dialog } from '@mui/material';
import { StyledTab, StyledTabs } from '../ui/overrides/Tabs';
import HeaderProgress from './HeaderProgress';
import useConfigStore from '../store/useConfigStore';
import useDataStore from '../store/useDataStore';
import Helper from '../utils/Helper';
import React, { useEffect, useRef, useState } from 'react';
import StyledIconButton from '../ui/overrides/IconButton';
import { Add, Edit, Search } from '@mui/icons-material';
import StyledTextField, { SearchTextField } from '../ui/overrides/TextField';
import Constant from '../utils/Constant';
import ConfigurationDialog from './layout/ConfigurationDialog';
import FooterTabs from './FooterTabs';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import Scrollbar from 'react-scrollbars-custom';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { Button } from 'react-bootstrap';

const HeaderTabs = () => {
  const config = useConfigStore((state) => state.configuration);
  const layout = useConfigStore((state) => state.layout);
  const updateConfig = useConfigStore((state) => state.setConfig);
  const currencies = useDataStore((state) => state.currencies);
  const isMobile = useDataStore((state) => state.isMobile);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const symbols = useDataStore((state) => state.currencies);
  const setSelectedCurrency = useDataStore((state) => state.setSelectedCurrency);
  const [filteredSymbols, setFilteredSymbols] = useState(symbols);
  const anchorEl = useRef();
  const setEditConfig = useConfigStore((state) => state.setEditConfig);
  const allConfigs = useConfigStore((state) => state.allConfigs);
  const updateAllConfig = useConfigStore((state) => state.updateAllConfigs);
  const setConfig = useConfigStore((state) => state.setConfig);
  const [hasToken, setHasToken] = useState(false);
  const location = useLocation();
  const setLayout = useConfigStore((state) => state.setLayout);
  const { isAuthenticated, logout } = useDataStore();
  const [isGuest, setIsGuest] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      setIsGuest(true);
    }
  }, []);

  const redirectToLogin = () => {
    const newTabUrl = '/papertrade/app';
    if(isAuthenticated){
      navigate(newTabUrl);
    }else{
      navigate('/login')
    }
    // window.open(newTabUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (searchTerm && searchTerm !== '') {
      const filter = symbols.filter(
        (item) => item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredSymbols(filter);
    } else {
      setFilteredSymbols(symbols);
    }
  }, [searchTerm, symbols]);

  const handleClose = (currency) => {
    setSearchEnabled(false);
    setSearchTerm('');
    if (currency) {
      setSelectedCurrency(currency);
    }
  };

  const calculateVarient = (item) => {
    const weight = Helper.calculateConfigurationWeight(item, currencies);
    if (weight > 0) {
      return 'buy';
    }
    if (weight < 0) {
      return 'sell';
    }
    return 'neutral';
  };

  const handleAddConfig = () => {
    const item = { ...Constant.DEFAULT_CONFIGS[0] };
    item.period = 'min1';
    item.id = Date.now();
    allConfigs.push(item);
    updateAllConfig(allConfigs);
    setConfig(item);
    setEditConfig(true);
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

    // Update state or perform other actions
    setHasToken(false); // Update the state to reflect logout
    logout();
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

  return (
    <Stack
      direction="row"
      height={isMobile ? '60px' : '90px'}
      gap={isMobile ? 1 : 2}
      bgcolor={'#171A24'}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      padding={1.5}>
      <HeaderProgress />
      {/* {layout === 'bubble' && ( */}
      <>
        {}

        <Box width={searchEnabled ? '30px' : 'fit-content'} overflow={searchEnabled && 'hidden'}>
          <img
            className="ml-2"
            src={'./image.png'}
            alt="Brand Image"
            style={{ height: isMobile?30:35, cursor: 'pointer',
               width: isMobile ? undefined : layout === 'bubble' ? 327 : 'auto' }}
            onClick={() => {
              setLayout('bubble');
            }}
          />
        </Box>

        <ClickAwayListener onClickAway={() => handleClose()}>
          <Box width={isMobile && searchEnabled ? '80%' : '30%'} position="relative">
            {(isMobile && searchEnabled) || !isMobile ? (
              <SearchTextField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                fullWidth
                ref={anchorEl}
                placeholder="Search..."
                InputProps={{
                  startAdornment: <Search sx={{ color: '#3D424B', mr: 1 }} />,
                  sx: { border: 'none', backgroundColor: '#2A2E36', boxShadow: 'none' }
                }}
                sx={{
                  backgroundColor: '#2A2E36',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& input::placeholder': { textAlign: 'left' }, // Aligns placeholder left
                  '& .MuiInputBase-input': {
                    color: 'white',

                    textAlign: 'left'
                  }
                }}
              />
            ) : (
              isMobile &&
              !searchEnabled && (
                <Box display={'flex'} gap={1} justifyContent={'flex-end'}>
                  <StyledIconButton sx={{ height: '100%' }} onClick={() => setSearchEnabled(true)}>
                    <Search />
                  </StyledIconButton>
                  {isAuthenticated && (
                    <StyledIconButton
                      onClick={showProfile}
                      sx={{ height: '100%', width: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {/* <ExitToAppIcon /> */}
                      <PermIdentityIcon />
                    </StyledIconButton>
                  )}
                </Box>
              )
            )}

            <Grow in={isMobile ? searchEnabled : searchTerm !== ''}>
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 9999,
                  border: 0,
                  mt: 1 / 2,
                  mr: 1,
                  borderRadius: 1,
                  width: '100%',
                  maxHeight: 240,
                  background: '#171A24',
                  backdropFilter: 'blur(8px)',
                  // overflow: 'scroll',
                  boxShadow: '0px 0px 7px 7px #00000027',
                  overflowY: 'scroll', // Enable vertical scrolling
                  scrollbarWidth: 'none', // Hide scrollbar for Firefox
                  '&::-webkit-scrollbar': { display: 'none' }
                }}>
                {filteredSymbols.map((symbol, index) => {
                  return (
                    <Box
                      display="flex"
                      key={symbol.symbol}
                      alignItems="center"
                      justifyContent="space-between"
                      onClick={() => handleClose(symbol)}
                      sx={{
                        cursor: 'pointer',
                        px: 2,
                        transition: 'background .4s',
                        ':hover': { background: '#ffffff14' },
                        borderBottom: filteredSymbols.length - 1 !== index ? '' : ''
                      }}>
                      <Box display="flex" alignItems="center">
                        <img width={20} height={20} src={`${process.env.BUBBLE_IMAGE_PATH}/${symbol.image}`} alt={symbol.name} />
                        <Typography color="white" ml={1} px={1} py={1}>
                          {symbol.name}
                        </Typography>
                      </Box>
                      <Typography fontWeight="600" color="#CCC" mr={1} px={1} py={1}>
                        {symbol.symbol}
                      </Typography>
                    </Box>
                  );
                })}
                {filteredSymbols.length === 0 && (
                  <Typography variant="h6" color="#CCC" ml={1} px={1} py={1}>
                    No symbols found
                  </Typography>
                )}
              </Box>
            </Grow>
          </Box>
        </ClickAwayListener>

        {layout === 'bubble' && !isMobile && (
          <Scrollbar
          className='header-scroll'
            style={{ width: '50%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }} // Ensure it spans horizontally
            noScrollY // Disable vertical scrolling
            thumbXProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return (
                  <div
                    {...restProps}
                    ref={elementRef}
                    style={{
                      backgroundColor: '#CFA935', // Thumb color
                      borderRadius: '8px', // Rounded corners
                      height: '5px', // Thumb height
                      cursor: 'grab'
                    }}
                  />
                );
              }
            }}>
            <div style={{ display: 'flex', width: 'max-content', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              {' '}
              {/* Ensure content is wider than container */}
              <StyledTabs
                sx={{
                  width: isMobile ? '90%' : '100%',

                  whiteSpace: 'nowrap' // Prevent wrapping
                }}
                variant="scrollable"
                value={config.id}
                onChange={(e, val) => updateConfig(allConfigs.find((item) => val === item.id))}
                scrollButtons={false}>
                {allConfigs.map((item) => (
                  <StyledTab key={item.id} variant={calculateVarient(item)} label={item.name || Constant.renderLabel(item)} value={item.id} />
                ))}
              </StyledTabs>
            </div>
          </Scrollbar>
        )}
      </>

      {!isMobile && (
        <Box p={1} display={'flex'} gap={1} padding={0}>
          <StyledIconButton sx={{ height: '100%' }} onClick={() => setEditConfig(true)}>
            <Edit />
          </StyledIconButton>
          <StyledIconButton sx={{ height: '100%' }} onClick={() => handleAddConfig()}>
            <Add />
          </StyledIconButton>
        </Box>
      )}

      
      <ConfigurationDialog />
      {isMobile ? null : <FooterTabs />}
      <Box>
        <StyledIconButton
          sx={{ height: '100%', width: isMobile?"40px": '160px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderColor: "#CFA935"}}
          onClick={redirectToLogin}>
  
          <Typography color="#CFA935" sx={{ fontSize: '14px' }}>
           {isMobile ? "CS": " Crypto Simulator"}
          </Typography>
        </StyledIconButton>
        
      </Box>

    </Stack>
  );
};

export default HeaderTabs;
