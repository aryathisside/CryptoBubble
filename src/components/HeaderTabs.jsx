/* eslint-disable prettier/prettier */
import {  Stack } from '@mui/material';
import { StyledTab, StyledTabs } from '../ui/overrides/Tabs';
import HeaderProgress from './HeaderProgress';
import useConfigStore from '../store/useConfigStore';
import useDataStore from '../store/useDataStore';
import Helper from '../utils/Helper';
import { useEffect, useState } from 'react';

const HeaderTabs = () => {
  const config = useConfigStore((state) => state.configuration);
  const layout = useConfigStore((state) => state.layout);
  const updateConfig = useConfigStore((state) => state.setConfig);
  const currencies = useDataStore((state) => state.currencies);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const cleanup = Helper.handleResize(setIsMobile);

    return cleanup; 
  }, []);

  const calculateVarient = (period) => {
    const weight = Helper.calculateConfigurationWeight({ ...config, period }, currencies);
    if (weight > 0) {
      return 'green';
    }
    if (weight < 0) {
      return 'red';
    }
    return 'neutral';
  };

  return (
    <Stack direction="row">
      <HeaderProgress />
      {layout === 'bubble' && (
        <>
        <img 
            className="ml-2" 
            src={isMobile ? './image2.png' : './image.png'} 
            alt="Brand Image" 
            style={{ height: 40 }} 
          />
      <StyledTabs
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
        {/* <StyledTab variant="green" label="Market Cap & Week" />
        <StyledTab variant="red" label="Market Cap & Month" /> */}
      </StyledTabs>
      </>
      )}
    </Stack>
  );
};

export default HeaderTabs;
