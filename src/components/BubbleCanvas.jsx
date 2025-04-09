/* eslint-disable prettier/prettier */
import { useEffect, useRef, useState } from 'react';
import './style.css';
import BubbleManager from '../utils/BubbleManager';
import useDataStore from '../store/useDataStore';
import useConfigStore from '../store/useConfigStore';
const BubbleCanvas = () => {
  const [canvasManager, setCanvasManager] = useState();
  const currencies = useDataStore((state) => state.currencies);
  const config = useConfigStore((state) => state.configuration);
  const setSelectedCurrency = useDataStore((state) => state.setSelectedCurrency);
  const canvasContainerRef = useRef();
  const colorScheme = useConfigStore((state) => state.colorScheme);
  const [filteredCurrencies, setFilteredCurrencies] = useState([]);
  const filter = useDataStore((state) => state.filter);
  const favorites = useConfigStore((state) => state.favorites);
  const blocklist = useConfigStore((state) => state.blocklist);
  const watchlists = useConfigStore((state) => state.watchlists);
  const baseCurrency = useConfigStore((state) => state.currency);
  const selectedCurrency = useDataStore((state) => state.selectedCurrency);

  useEffect(() => {
    if (canvasContainerRef.current) {
      const cM = new BubbleManager(canvasContainerRef.current);
      setCanvasManager(cM);

      
      cM.setProperties({...config, colors:colorScheme,baseCurrency});
      // Push the currencies to the canvas manager
      setTimeout(() => {
        // cM.pushCurrencies(currencies);
      }, 1000);
      cM.eventSelect.register((currency) => setSelectedCurrency(currency));
      cM.wakeUp();
      cM.start();
    }
  }, [canvasContainerRef]);
  useEffect(() => {
    if (canvasManager) {
      canvasManager.setProperties({...config, colors:colorScheme,baseCurrency});
    }
  }, [config, colorScheme]);

  // useEffect(() => {
  //   if (canvasManager) {
  //     canvasManager.pushCurrencies(currencies);
  //   }
  // }, [selectedCurrency]);

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

  useEffect(() => {
    if (canvasManager) {
      canvasManager.pushCurrencies(filteredCurrencies);
    }
  }, [filteredCurrencies]);

  


  return <canvas style={{backgroundColor:"#000000"}}  id="canvas" ref={canvasContainerRef} />
};

export default BubbleCanvas;