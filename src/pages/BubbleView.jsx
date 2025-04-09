import { Box, Stack } from '@mui/material';
import HeaderTabs from '../components/HeaderTabs';
import BubblePlot from '../components/BubblePlot';
import FooterTabs from '../components/FooterTabs';
import ChartView from '../components/symbol-detail/ChartView';
import useConfigStore from '../store/useConfigStore';
import ListView from '../components/list-layout/ListView';
import SettingsView from '../components/settings/SettingsView';
import { useEffect, useState } from 'react';
import Helper from '../utils/Helper';
import MobileFooter from '../components/mobile/MobileFooter';
import useDataStore from '../store/useDataStore';

const BubbleView = () => {
  
  const isMobile = useDataStore((state) => state.isMobile);
 
  
  const layout = useConfigStore((state) => state.layout);
  return (
    <Stack sx={{ p: 0, bgcolor: '#000000', height:isMobile?"95%" :'100%',display:"flex" }}>
      <HeaderTabs />
      {layout === 'bubble' && <BubblePlot />}
      {layout === 'list' && <ListView />}
      {layout === 'settings' && <SettingsView />}
      <ChartView />
      {
        isMobile ? <MobileFooter/>:null
      }
      {/* <FooterTabs /> */}
    </Stack>
  );
};

export default BubbleView;

