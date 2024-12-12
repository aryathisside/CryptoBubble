import { Box, Stack, Typography } from '@mui/material';
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

const SettingsView = () => {
  const watchlists = useConfigStore((state) => state.watchlists);
  const updateAllWatchlist = useConfigStore((state) => state.updateAllWatchlist);
  const updateFilter = useDataStore((state) => state.updateFilter);
  const filter = useDataStore((state) => state.filter);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const cleanup = Helper.handleResize(setIsMobile);

    return cleanup;
  }, []);

  const updateName = (id, value) => {
    const index = watchlists.findIndex((item) => item.id === id);
    watchlists[index].name = value;
    updateAllWatchlist(watchlists);
  };

  const addWatchList = () => {
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
    updateFilter({ type: 'all', id: null })
  };

  const updateFilterHandle = (fil) => {
    updateFilter(fil);
  };
  return (
    <Box sx={{ flexGrow: 1, width: '100%', px: 1, py: 3, overflow: 'scroll' }}>
      <Stack>
        <Box display="flex" justifyContent="space-between" alignItems={'center'} mb={2}>
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
          height={isMobile?240 :500}
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
                <Box display="flex" key={item.id} alignItems="center" my={1}>
                  <StyledTextField
                    fullWidth
                    placeholder={`Watchlist ${index + 1}`}
                    value={item.name}
                    onChange={(e) => updateName(item.id, e.target.value)}
                    InputProps={{ startAdornment: <Edit /> }}
                  />
                  <StyledIconButton onClick={() => removeWatchlist(item.id)} sx={{ ml: 1 }}>
                    <Delete />
                  </StyledIconButton>
                </Box>
              );
            })}
          </Scrollbar>
        </Box>

        {/* <Box display="flex" justifyContent="center" mt={7} sx={{ opacity: 0.85 }}>
          <img src={Logo} alt="AI + Bubbles" width={300} style={{ maxWidth: '40vw' }} />
        </Box> */}
      </Stack>
    </Box>
  );
};

export default SettingsView;
