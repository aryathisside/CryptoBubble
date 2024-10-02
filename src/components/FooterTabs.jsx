import { Box, Grow, Stack, Typography } from '@mui/material';
import { Block, KeyboardArrowDown, RemoveRedEye, Reorder, SettingsSuggest, Star, Workspaces } from '@mui/icons-material';
import { useState } from 'react';
import StyledButton from '../ui/overrides/Button';
import { StyledIconTab, StyledIconTabs } from '../ui/overrides/IconTabs';
import useConfigStore from '../store/useConfigStore';
import useDataStore from '../store/useDataStore';

const FooterTabs = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filter = useDataStore((state) => state.filter);
  const updateFilter = useDataStore((state) => state.updateFilter);
  const layout = useConfigStore((state) => state.layout);
  const setLayout = useConfigStore((state) => state.setLayout);
  const watchlists = useConfigStore((state) => state.watchlists);

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
    console.log("fill is", fil)
    updateFilter(fil);
    setIsFilterOpen(false);
  };

  return (
    <Box pb={1 / 2}>
      <Stack direction="row" justifyContent="space-between">
        <Box position="relative" ml={1}>
          <StyledButton onClick={() => setIsFilterOpen(!isFilterOpen)} sx={{ background: isFilterOpen ? '#0676DB !important' : null }}>
            <Stack direction="row" gap={1}>
              <Typography color="white" fontWeight="bold" textTransform="none">
                {renderName()}
              </Typography>
              <KeyboardArrowDown
                sx={{
                  transition: 'transform 0.4s',
                  transform: isFilterOpen ? 'rotateZ(180deg)' : ''
                }}
              />
            </Stack>
          </StyledButton>
          <Grow in={isFilterOpen}>
            <Box
              position="absolute"
              sx={{
                display: isFilterOpen ? 'block' : 'none',
                background: '#444444e6',
                backdropFilter: 'blur(8px)',
                width: 600,
                maxWidth: '90vw',
                bottom: 55,
                borderRadius: 1,
                boxShadow: '0px 0px 7px 7px #00000027',
                px: 2,
                py: 1
              }}>
              <Stack>
                <Typography typography="h6" color="#ccc">
                  Pages
                </Typography>
                <Box>
                  <StyledButton
                    onClick={() => updateFilterHandle({ type: 'all', id: null })}
                    sx={{ mr: 1, mb: 1, px: 2, background: filter.type === 'all' ? '#0477DD !important' : null }}>
                    <Typography color="white" textTransform="none">
                      1-100
                    </Typography>
                  </StyledButton>
                </Box>

                <Typography typography="h6" color="#ccc">
                  List
                </Typography>
                <Box>
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
        </Box>

        <Box mr={1}>
          <StyledIconTabs value={layout} onChange={(e, val) => setLayout(val)} sx={{ flexGrow: '1' }}>
            <StyledIconTab value="bubble" icon={<Workspaces />} />
            <StyledIconTab value="list" icon={<Reorder />} />
            <StyledIconTab value="settings" icon={<SettingsSuggest />} />
          </StyledIconTabs>
        </Box>
      </Stack>
    </Box>
  );
};

export default FooterTabs;
