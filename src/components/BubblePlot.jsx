/* eslint-disable prettier/prettier */
import { Box, CircularProgress, Typography } from '@mui/material';
import BubbleCanvas from './BubbleCanvas';
import useDataStore from '../store/useDataStore';
import Logo from "/image2.png";
import useConfigStore from '../store/useConfigStore';
import { useState, useEffect } from 'react';

const BubblePlot = ({ selectedPeriod }) => {
  const currencies = useDataStore((state) => state.currencies);
  const isLoading = useDataStore((state) => state.loading);
  const filter = useDataStore((state) => state.filter);
  const favorites = useConfigStore((state) => state.favorites);
  const blocklist = useConfigStore((state) => state.blocklist);
  const watchlists = useConfigStore((state) => state.watchlists);
  const [filteredCurrencies, setFilteredCurrencies] = useState([]);

  useEffect(() => {
    let filtered = [];
    if (filter.type === 'all') {
      filtered = currencies.filter((item) => !blocklist.includes(item.id));
    } else if (filter.type === 'favorite') {
      filtered = currencies.filter((item) => favorites.includes(item.id));
    } else if (filter.type === 'blocklist') {
      filtered = currencies.filter((item) => blocklist.includes(item.id));
    } else if (filter.type === 'watchlist' && filter.id) {
      const wt = watchlists.find((item) => item.id === filter.id);
      filtered = currencies.filter((item) => wt.symbols.includes(item.id));
    }
    setFilteredCurrencies(filtered);
  }, [currencies, favorites, filter, blocklist, watchlists]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: { xs: '28px', sm: '0px' }
      }}
    >
      {isLoading && (
        <Box>
          <img className="scale-up-center" src={Logo} alt="CRYPTO + Bubble" width={200} />
        </Box>
      )}
      {!isLoading && filteredCurrencies.length > 0 && (
        <BubbleCanvas stocksData={filteredCurrencies} selectedPeriod={selectedPeriod} />
      )}
      {!isLoading && filteredCurrencies.length === 0 && filter.type !== 'all' && (
    <Typography variant="h6" color="white">
      {filter.type} List is empty
    </Typography>
  )}
    </Box>
  );
};

export default BubblePlot;
