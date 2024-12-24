import { Box, Grow, Stack, Tooltip, Typography } from '@mui/material';
import { Block, KeyboardArrowDown, RemoveRedEye, Reorder, SettingsSuggest, Star, Workspaces } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import StyledButton from '../ui/overrides/Button';
import { StyledIconTab, StyledIconTabs } from '../ui/overrides/IconTabs';
import useConfigStore from '../store/useConfigStore';
import useDataStore from '../store/useDataStore';
import StyledIconButton from '../ui/overrides/IconButton';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

const FooterTabs = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filter = useDataStore((state) => state.filter);
  const updateFilter = useDataStore((state) => state.updateFilter);
  const layout = useConfigStore((state) => state.layout);
  const setLayout = useConfigStore((state) => state.setLayout);
  const watchlists = useConfigStore((state) => state.watchlists);
  const navigation = useNavigate()
  const location = useLocation();
  const { isAuthenticated, logout } = useDataStore();
  const setAuthenticated = useDataStore((state) => state.setAuthenticated);
    const [isGuest, setIsGuest] = useState(false);
    useEffect(() => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setIsGuest(true);
      }
    }, []);


  const showProfile  = async ()=>{
    if(isGuest){
      await logout()
      navigation("/login")
    }else{
      navigation("/user-profile")
      
    }
  }

  useEffect(()=>{
    setIsFilterOpen(false)
  },[layout])

  useEffect(() => {
    console.log('FooterTabs: isAuthenticated:', isAuthenticated);
    const token = localStorage.getItem("token")
    setAuthenticated(!!token)
    

  }, [isAuthenticated]);

  const redirectLogin = ()=>{
    navigation("/login")

  }

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
    logout()
  };

  return (
    <Box pb={1 / 2}>
      <Stack direction="row" justifyContent="space-between" gap={1}>
        <Box position="relative" ml={1}>
        <Tooltip title="Wish list" arrow>
        <StyledButton onClick={() => setIsFilterOpen(!isFilterOpen)} disabled={!isAuthenticated} sx={{ width:"100px", height:"100%"  }} >
            <Stack direction="row" display="flex" justifyContent="center"alignItems="center">
              <Typography color="white" fontWeight="bold" textTransform="none" fontSize={"12px"}>
                {renderName()}
              </Typography>
            {
              isAuthenticated &&   <KeyboardArrowDown
              sx={{
                transition: 'transform 0.4s',
                transform: isFilterOpen ? 'rotateZ(180deg)' : ''
              }}
            />

            }
            </Stack>
          </StyledButton>

        </Tooltip>
          
        {
          isAuthenticated &&   <Grow in={isFilterOpen}>
          <Box
            position="absolute"
            sx={{
              display: isFilterOpen ? 'block' : 'none',
              background: '#171A24',
              backdropFilter: 'blur(8px)',
              width: 600,
              maxWidth: '90vw',
              right:0,
              top:70,
              zIndex:1000,
             
              borderRadius: 1,
              boxShadow: '0px 0px 7px 7px #00000027',
              px: 2,
              py: 1
            }}>
            <Stack>

              <Box>
                
              <StyledButton
                    onClick={() => updateFilterHandle({ type: 'all', id: null })}
                    sx={{ mr: 1, mb: 1, px: 2, background: filter.type === 'all' ? '#0477DD !important' : null }}>
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
                      sx={{ mr: 1, mb: 1, px: 1, background: filter.type === 'watchlist' && filter.id === item.id ? '#0477DD !important' : null }}>
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
        }
        </Box>

        <Box mr={1} display={"flex"} gap={1}>
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
             <StyledIconButton onClick={showProfile}  sx={{ height: '100%', width:"40px", display:
  'flex', justifyContent:"center", alignItems:"center",
  
  }}>
  {/* <ExitToAppIcon /> */}
  <PermIdentityIcon/>
  
</StyledIconButton>
           </Tooltip>
          ) : (
            <StyledIconButton onClick={redirectLogin}  sx={{ height: '100%', width:"90px", display:
              'flex', justifyContent:"center", alignItems:"center",
              
              }}
           >
              <PersonOutlineOutlinedIcon />
              <Typography color="white" sx={{ fontSize: '12px', ml: 1 }}>
                Login
              </Typography>
            </StyledIconButton>
          )}

          {/* <StyledIconTabs value={layout} onChange={(e, val) => setLayout(val)} sx={{ flexGrow: '1' }}>
            <StyledIconTab value="bubble" icon={<Workspaces />} />
            <StyledIconTab value="list" icon={<Reorder />} />
            <StyledIconTab value="settings" icon={<SettingsSuggest />} />
          </StyledIconTabs> */}
        </Box>
      </Stack>
    </Box>
  );
};

export default FooterTabs;
