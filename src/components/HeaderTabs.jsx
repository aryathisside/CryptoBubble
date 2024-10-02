/* eslint-disable prettier/prettier */
import {  Box, Stack, ClickAwayListener, Grow, Typography } from '@mui/material';
import { StyledTab, StyledTabs } from '../ui/overrides/Tabs';
import HeaderProgress from './HeaderProgress';
import useConfigStore from '../store/useConfigStore';
import useDataStore from '../store/useDataStore';
import Helper from '../utils/Helper';
import { useEffect, useRef, useState } from 'react';
import StyledIconButton from '../ui/overrides/IconButton';
import { Add, Edit, Search } from '@mui/icons-material';
import StyledTextField from '../ui/overrides/TextField';
import Constant from '../utils/Constant';
import ConfigurationDialog from './layout/ConfigurationDialog';

const HeaderTabs = () => {
  const config = useConfigStore((state) => state.configuration);
  const layout = useConfigStore((state) => state.layout);
  const updateConfig = useConfigStore((state) => state.setConfig);
  const currencies = useDataStore((state) => state.currencies);
  const [isMobile, setIsMobile] = useState(false);
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
  useEffect(() => {
    const cleanup = Helper.handleResize(setIsMobile);

    return cleanup; 
  }, []);

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

  return (
    <Stack direction="row"  >
      <HeaderProgress />
      {layout === 'bubble' && (
        <>
        <img 
            className="ml-2" 
            src={isMobile ? './image2.png' : './image.png'} 
            alt="Brand Image" 
            style={{ height: 40 }} 
          />
      {/* <StyledTabs
            variant="scrollable"
            value={config.period}
            onChange={(e, val) => updateConfig({ period: val })}
            sx={{ flexGrow: '1' }}
            scrollButtons={false}>
      
        <StyledTab variant={calculateVarient('min1')} label="1min" value="min1" />
        <StyledTab variant={calculateVarient('min5')} label="5min" value="min5" />
        <StyledTab variant={calculateVarient('min15')} label="15min" value="min15" />
        <StyledTab variant={calculateVarient('hour')} label="Hour" value="hour" />
        <StyledTab variant={calculateVarient('day')} label="Day" value="day" />
        <StyledTab variant={calculateVarient('week')} label="Week" value="week" />
        <StyledTab variant={calculateVarient('month')} label="Month" value="month" />
        <StyledTab variant={calculateVarient('year')} label="Year" value="year" />
      </StyledTabs> */}
      <StyledTabs
            variant="scrollable"
            value={config.id}
            onChange={(e, val) => updateConfig(allConfigs.find((item) => val === item.id))}
            scrollButtons={false}>
            {allConfigs.map((item) => {
              return <StyledTab key={item.id} variant={calculateVarient(item)} label={item.name || Constant.renderLabel(item)} value={item.id} />;
            })}
          </StyledTabs>
      </>
      )}
       <Box p={1}>
            <StyledIconButton onClick={() => setEditConfig(true)}>
              <Edit />
            </StyledIconButton>
          </Box>
          <Box p={1}>
            <StyledIconButton onClick={() => handleAddConfig()}>
              <Add />
            </StyledIconButton>
          </Box>
       <Box p={1}>
          {!searchEnabled && (
            <StyledIconButton onClick={() => setSearchEnabled(true)}>
              <Search />
            </StyledIconButton>
          )}
        </Box>
        {searchEnabled && (
          <ClickAwayListener onClickAway={() => handleClose()}>
            <Box width="30%" position="relative">
              <StyledTextField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                fullWidth
                ref={anchorEl}
                placeholder="Search symbol"
                InputProps={{ startAdornment: <Search /> }}
              />

              <Grow in={searchEnabled}>
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
                    background: '#444444e6',
                    backdropFilter: 'blur(8px)',
                    overflow: 'scroll',
                    boxShadow: '0px 0px 7px 7px #00000027'
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
                          borderBottom: filteredSymbols.length - 1 !== index ? '1px solid #656565' : ''
                        }}>
                        <Box display="flex" alignItems="center">
                          <img width={20} height={20} src={`${process.env.BUBBLE_IMAGE_PATH }/${symbol.image}`} alt={symbol.name} />
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
        )}
        <ConfigurationDialog/>
    </Stack>
  );
};

export default HeaderTabs;
