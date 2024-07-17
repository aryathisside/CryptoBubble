/* eslint-disable prettier/prettier */
import { Box, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import HeaderTabs from '../components/HeaderTabs';
import FooterTabs from '../components/FooterTabs';
import BubbleManager from '../utils/BubbleManager';
import '../components/style.css';
import BubblePlot from '../components/BubblePlot';

const BubbleView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('min1');
  return (
    <Stack sx={{ p: 0, bgcolor: '#222222', height: '100%' }}>
      <HeaderTabs selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />
      <BubblePlot selectedPeriod={selectedPeriod} />
      <FooterTabs />
    </Stack>
  );
};

export default BubbleView;
