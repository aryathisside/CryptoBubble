import { Box, Dialog, DialogContent, DialogTitle, Slide } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Close, KeyboardArrowDown } from '@mui/icons-material';
import StyledIconButton from '../../ui/overrides/IconButton';
import useDataStore from '../../store/useDataStore';
import ChartCanvas from './ChartCanvas';
import PriceCalculator from '../common/PriceCalulator';
import CurrencyPerformanceGrid from './CurrencyPerformanceGrid';
import SymbolInfo from './SymbolInfo';

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

  const fetchData = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    setQuotes(null);
    setIsLoading(true);
    await fetch(`http://cryptobubbles.net/backend/data/charts/${period}/${selectedCurrency.id}/USD.json`, requestOptions).then(
      (response) => {
        console.log(response.data);
        const json = response.data;
        setQuotes(json);
        setIsLoading(false);
      }
    ); // await fetch(`https://api.npoint.io/898c9b0216b7ba2385b1`);
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
              <img src={selectedCurrency.image} height={20} width={20} alt={selectedCurrency.symbol} style={{ marginRight: '10px' }} />
              {selectedCurrency.name}
            </Box>
            <StyledIconButton onClick={() => setSelectedCurrency(null)}>
              <Close />
            </StyledIconButton>
          </DialogTitle>
          {expanded && (
            <DialogContent sx={{ padding: 0 }}>
              <PriceCalculator selectedCurrency={selectedCurrency} />
              <SymbolInfo symbol={selectedCurrency} />
              {isLoading && (
                <Box display="flex" justifyContent="center" p={5} height={240} alignItems="center">
                  <img className="rotate-center" src={selectedCurrency.image} height={70} width={70} alt={selectedCurrency.symbol} />
                </Box>
              )}
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
