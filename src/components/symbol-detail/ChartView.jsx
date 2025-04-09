import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, Slide, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Close, KeyboardArrowDown, KeyboardDoubleArrowRight } from '@mui/icons-material';
import StyledIconButton from '../../ui/overrides/IconButton';
import useDataStore from '../../store/useDataStore';
import ChartCanvas from './ChartCanvas';
import PriceCalculator from '../common/PriceCalulator';
import CurrencyPerformanceGrid from './CurrencyPerformanceGrid';
import SymbolInfo from './SymbolInfo';
import TradeLinks from './TradeLinks';
import { Scrollbar } from 'react-scrollbars-custom';
import NewsSection from '../NewsSection';
import WishlistAdd from './WishlistAdd';
import Helper from '../../utils/Helper';
import useConfigStore from '../../store/useConfigStore';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ChartView = () => {
  const selectedCurrency = useDataStore((state) => state.selectedCurrency);
  const setSelectedCurrency = useDataStore((state) => state.setSelectedCurrency);
  const isCurrencySelected = !!selectedCurrency;
  const [quotes, setQuotes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchNews, setFetchNews]=useState(false)
  const [isMobile, setIsMobile]=useState(false)
  const config = useConfigStore((state) => state.configuration);


  useEffect(() => {
    console.log("config in chart");
    const p = config.period;
  
    // Check the value of `p` and set the period accordingly
    if (['hour', 'day', 'week', 'month', 'year'].includes(p)) {
      setPeriod(p);  // Set the period as p if it matches one of the allowed values
    } else {
      setPeriod('year');  // Default to 'year' if p doesn't match any of the allowed values
    }
  
  }, [config]);
  


  useEffect(() => {
    const cleanup = Helper.handleResize(setIsMobile);

    return cleanup;
  }, []);

  const fetchData = async () => {
    setQuotes(null);
    setIsLoading(true);
    setFetchError(false);
    const maxRetries = 3;
    let attempt = 0;
    let success = false;
    while (attempt < maxRetries && !success) {
      try {
        const response = await fetch(`${process.env.CHART_DATA_URL}/${period}/${selectedCurrency.id}/USD.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setQuotes(json);
        success = true;
      } catch (error) {
        attempt += 1;
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



    const handleNewsSection = async (symbol) => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.CRYPTO_NEWS_URL}/${symbol}`);
        const result = await response.json();
        setNewsData(result);
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false)
      }
    };
    // handleNewsSection(selectedCurrency?.symbol);

    useEffect(() => {
      if (isCurrencySelected) {
        fetchData(); // Fetch chart data
        handleNewsSection(selectedCurrency.symbol); // Fetch news data
      }
    }, [isCurrencySelected, period]);
 


  return (
    <Dialog
      fullWidth
      open={isCurrencySelected}
      
      hideBackdrop
      maxWidth="md"
      scroll="paper"
      TransitionComponent={Transition}
      sx={{ '& .MuiDialog-container': { alignItems: 'start' } }}
      PaperProps={{
        sx: {
          background: '#171A24',
          backdropFilter: 'blur(8px)',
          marginTop: 'min(10%, 100px)',
          marginX: 2,
          width: 'calc(100% - 32px)'
        }
      }}>
      {isCurrencySelected && (
        <>
          <DialogTitle typography="body1" display="flex" justifyContent="space-between" color="white" sx={{ padding: 1 }}>
            <Box display="flex" alignItems="center">
              <StyledIconButton onClick={() => setExpanded(!expanded)} sx={{ mr: 2 }}>
                <KeyboardArrowDown sx={{ transition: 'all 0.2s', transform: expanded ? '' : 'rotateZ(-90deg)' }} />
              </StyledIconButton>
              <WishlistAdd symbol={selectedCurrency} />
              <img
                src={`${process.env.BUBBLE_IMAGE_PATH}/${selectedCurrency.image}`}
                height={20}
                width={20}
                alt={selectedCurrency.symbol}
                style={{ marginRight: '10px' }}
              />
              {selectedCurrency.name}
            </Box>
            <StyledIconButton onClick={() => setSelectedCurrency(null)}>
              <Close />
            </StyledIconButton>
          </DialogTitle>

          {expanded && (
            <DialogContent sx={{ padding: 0 }}>
              <Grid container >
                <Grid item xs={12} md={8.5}>
                  <TradeLinks symbol={selectedCurrency} />
                  <Box display={"flex"} alignItems={"center"} flexDirection={isMobile?"column":"row"}  justifyContent={"space-between"}>
                  <PriceCalculator selectedCurrency={selectedCurrency} />
                  <SymbolInfo symbol={selectedCurrency} />
                  </Box>
                  {isLoading && (
                    <Box display="flex" justifyContent="center" p={5} height={240} alignItems="center">
                      <img
                        className="rotate-center"
                        src={`${process.env.BUBBLE_IMAGE_PATH}/${selectedCurrency.image}`}
                        height={70}
                        width={70}
                        alt={selectedCurrency.symbol}
                      />
                    </Box>
                  )}
                  {fetchError && (
                    <Box display="flex" justifyContent="center" p={5} height={240} alignItems="center">
                      <Typography color="error" variant="h6" textAlign="center">
                        Unable to establish connection or process the request. <br />
                        Please try again later.
                      </Typography>
                    </Box>
                  )}
                  {!isLoading && quotes && <ChartCanvas  quotes={quotes} period={period} />}
                  {selectedCurrency && <CurrencyPerformanceGrid symbol={selectedCurrency} period={period} setPeriod={setPeriod} />}
                </Grid>
                <Grid item xs={12} md={3.5} display={'flex'} flexDirection={'column'} paddingX={1} paddingBottom={2}>
                  <Typography variant="h7" color="white" borderBottom={'2px solid #2A2E36'} width={'100%'} paddingY={1} >
                    Latest News
                  </Typography>
                  <Box
                    marginTop={2}
                    height={isMobile?420:"100%"}
                    sx={{
                      overflowY: 'scroll', // Enable vertical scrolling
                      scrollbarWidth: 'none', // Hide scrollbar for Firefox
                      '&::-webkit-scrollbar': { display: 'none' } // Hide scrollbar for Chrome, Safari, and Edge
                    }}>
                    {
                      loading?(
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress sx={{color:'#CFA935'}} />
                      </Box>
                      ):(
                        <Scrollbar
                    
                      style={{ height: '100%' }}
                      noScrollX
                      thumbYProps={{
                        renderer: (props) => {
                          const { elementRef, ...restProps } = props;
                          return (
                            <div
                              {...restProps}
                              ref={elementRef}
                              style={{
                                backgroundColor: '#CFA935', // Thumb color
                                borderRadius: '8px' // Optional: rounded corners for the scrollbar thumb
                              }}
                            />
                          );
                        }
                      }}>
                      {newsData?.data?.results?.map((newsItem, index) => (
                        <NewsSection key={index} newsItem={newsItem}/>
                      ))}
                    </Scrollbar>
                      )
                    }
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          )}
        </>
      )}
    </Dialog>
  );
};

export default ChartView;
