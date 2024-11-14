/* eslint-disable prettier/prettier */
import { Box, CircularProgress } from '@mui/material';
import BubbleCanvas from './BubbleCanvas';
import useDataStore from '../store/useDataStore';
import Logo from "/image2.png"

const BubblePlot = ({ selectedPeriod }) => {
  const currencies = useDataStore((state) => state.currencies);

  const isLoading = useDataStore((state) => state.loading);

  return (
    <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', height:"10vh" }}>
      {isLoading && (
        <Box>
          <img className="scale-up-center" src={Logo} alt="CRYPTO + Bubble" width={200} />
        </Box>
      )}
      {!isLoading && <BubbleCanvas stocksData={currencies} selectedPeriod={selectedPeriod} />}
    </Box>
  );
};

export default BubblePlot;