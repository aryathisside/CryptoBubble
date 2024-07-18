/* eslint-disable prettier/prettier */
import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import BubbleCanvas from './BubbleCanvas';
import useDataStore from '../store/useDataStore';


const BubblePlot = ({ selectedPeriod }) => {
  const [isLoading, setLoading] = useState(true);
  const currencies = useDataStore((state) => state.currencies);
  const setCurrencies = useDataStore((state) => state.setCurrencies);

  const fetchData = async () => {
    const req = await fetch(process.env.REACT_APP_API_URL);
    const data = await req.json();
    // setStocksData(data);
    setCurrencies(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
      {isLoading && <CircularProgress color="success" />}
      {!isLoading && <BubbleCanvas stocksData={currencies} selectedPeriod={selectedPeriod} />}
    </Box>
  );
};

export default BubblePlot;
