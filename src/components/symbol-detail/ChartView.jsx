import { Box, Dialog, DialogContent, DialogTitle, Slide , Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Close, KeyboardArrowDown } from '@mui/icons-material';
import StyledIconButton from '../../ui/overrides/IconButton';
import useDataStore from '../../store/useDataStore';
import ChartCanvas from './ChartCanvas';
import PriceCalculator from '../common/PriceCalulator';
import CurrencyPerformanceGrid from './CurrencyPerformanceGrid';
import SymbolInfo from './SymbolInfo';
import TradeLinks from './TradeLinks';



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ChartView = () => {
  const selectedCurrency = useDataStore((state) => state.selectedCurrency);
  const setSelectedCurrency = useDataStore((state) => state.setSelectedCurrency);
  const isCurrencySelected = !!selectedCurrency;
  const [quotes, setQuotes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('year');
  const [expanded, setExpanded] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const fetchData = async () => {
    setQuotes(null);
    setIsLoading(true);
    setFetchError(false);
    const maxRetries = 3;
    let attempt = 0;
    let success = false;
   while(attempt<maxRetries && !success){
    try {
      const response = await fetch(`${process.env.CHART_DATA_URL}/${period}/${selectedCurrency.id}/USD.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setQuotes(json);
      success = true
    } catch (error) {
      attempt += 1
      if (attempt === maxRetries) {
        setFetchError(true);
        console.error('Failed to fetch data after 3 attempts:', error);
      } else {
        // Optionally, you can add a delay before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      
    }

   }
    setIsLoading(false);
    
  };
  useEffect(() => {
    if (isCurrencySelected) fetchData();
  }, [isCurrencySelected, period]);

  return (
    <Dialog
      fullWidth
      open={isCurrencySelected}
      hideBackdrop
      maxWidth="sm"
      scroll="paper"
      TransitionComponent={Transition}
      sx={{ '& .MuiDialog-container': { alignItems: 'start' } }}
      PaperProps={{
        sx: { background: '#444444e6', backdropFilter: 'blur(8px)', marginTop: 'min(10%, 100px)', marginX: 2, width: 'calc(100% - 32px)' }
      }}>
      {isCurrencySelected && (
        <>
          <DialogTitle typography="body1" display="flex" justifyContent="space-between" color="white" sx={{ padding: 1 }}>
            <Box display="flex" alignItems="center">
              <StyledIconButton onClick={() => setExpanded(!expanded)} sx={{ mr: 2 }}>
                <KeyboardArrowDown sx={{ transition: 'all 0.2s', transform: expanded ? '' : 'rotateZ(-90deg)' }} />
              </StyledIconButton>
              <img src={`${process.env.BUBBLE_IMAGE_PATH}/${selectedCurrency.image}`} height={20} width={20} alt={selectedCurrency.symbol} style={{ marginRight: '10px' }} />
              {selectedCurrency.name}
            </Box>
            <StyledIconButton onClick={() => setSelectedCurrency(null)}>
              <Close />
            </StyledIconButton>
          </DialogTitle>
          {expanded && (
            <DialogContent sx={{ padding: 0 }}>
              <TradeLinks symbol={selectedCurrency} />
              <PriceCalculator selectedCurrency={selectedCurrency} />
              <SymbolInfo symbol={selectedCurrency} />
              {isLoading && (
                <Box display="flex" justifyContent="center" p={5} height={240} alignItems="center">
                  <img className="rotate-center" src={`${process.env.BUBBLE_IMAGE_PATH}/${selectedCurrency.image}`} height={70} width={70} alt={selectedCurrency.symbol} />
                </Box>
              )}
              {fetchError && (
                <Box
                display="flex"
                justifyContent="center"
                p={5}
                height={240}
                alignItems="center"
              >
                <Typography color="error" variant="h6" textAlign="center">
                  Unable to establish connection or process the request. <br />
                  Please try again later.
                </Typography>
              </Box>)}
              {!isLoading && quotes && <ChartCanvas quotes={quotes} period={period} />}
              {selectedCurrency && <CurrencyPerformanceGrid symbol={selectedCurrency} period={period} setPeriod={setPeriod} />}
            </DialogContent>
          )}
        </>
      )}
    </Dialog>
  );
};

export default ChartView;