/* eslint-disable prettier/prettier */
import { Box, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import HeaderTabs from '../components/HeaderTabs';
import FooterTabs from '../components/FooterTabs';
import BubbleManager from '../utils/BubbleManager';
import '../components/style.css';
import BubblePlot from '../components/BubblePlot';
import CryptoTable from '../components/CryptoTable';
import useDataStore from '../store/useDataStore';

const BubbleView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('min1');
  const currencies = useDataStore((state) => state.currencies);

  return (
    <div style={{ height: '100vh', overflowY: 'scroll', backgroundColor: '#222222' }}>
      <Stack sx={{ p: 0, bgcolor: '#222222', height: '90%' }}>
      <HeaderTabs selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />
      <BubblePlot selectedPeriod={selectedPeriod} />
      <FooterTabs />
    </Stack>
    <CryptoTable tableData={currencies}></CryptoTable>
    </div>
  );
};

export default BubbleView;
