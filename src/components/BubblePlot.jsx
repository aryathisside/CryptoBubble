/* eslint-disable prettier/prettier */
import { Box, CircularProgress } from '@mui/material';
import BubbleCanvas from './BubbleCanvas';
import useDataStore from '../store/useDataStore';

const BubblePlot = ({ selectedPeriod }) => {
  const currencies = useDataStore((state) => state.currencies);

  const isLoading = useDataStore((state) => state.loading);

  return (
    <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {isLoading && (
             <CircularProgress color="success" />
      )}
      {!isLoading && <BubbleCanvas stocksData={currencies} selectedPeriod={selectedPeriod} />}
    </Box>
  );
};

export default BubblePlot;