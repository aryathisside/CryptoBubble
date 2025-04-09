import { LinearProgress } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Helper from '../utils/Helper';
import useConfigStore from '../store/useConfigStore';
import useDataStore from '../store/useDataStore';
const CACHE_DURATION = 50000; // 1 minute

const HeaderProgress = () => {
  const config = useConfigStore((state) => state.configuration);
  const colorScheme = useConfigStore((state) => state.colorScheme);
  const currencies = useDataStore((state) => state.currencies);
  const setCurrencies = useDataStore((state) => state.setCurrencies);
  const setLoading = useDataStore((state) => state.setLoading);

  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const requestRef = useRef();

  const apiCall = async () => {
    const req = await fetch(process.env.REACT_APP_API_URL);
    const data = await req.json();
    // localStorage.setItem('cryptoData', JSON.stringify(data));
    // localStorage.setItem('cryptoDataTimestamp', Date.now()); // Store timestamp

    setCurrencies(data);
  };

  const updateProgress = () => {
    const elapsedTime = Date.now() - startTimeRef.current;
    const newProgress = Math.min((elapsedTime / 60000) * 100, 100); // Calculate progress based on elapsed time

    setProgress(newProgress);

    if (newProgress < 100) {
      requestRef.current = requestAnimationFrame(updateProgress);
    } else {
      // eslint-disable-next-line no-use-before-define
      refetch();
    }
  };
  const refetch = async () => {
    setProgress(-10);
    startTimeRef.current = Date.now();
    setProgress(0);
    requestRef.current = requestAnimationFrame(updateProgress);

    await apiCall();
  };

  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateProgress);
    const initFetch = async () => {
      await apiCall();
      setLoading(false);
    };
    setTimeout(initFetch, 1500);

    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const calculateVarient = () => {
    const weight = Helper.calculateConfigurationWeight(config, currencies);
    // if (weight > 0) {
    //   return '#3f3';
    // }
    // if (weight < 0) {
    //   return '#f66';
    // }
    return Helper.getPrimaryColor(weight, colorScheme);
  };
  return (
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{
        height: '3px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: 'transparent',
        '& .MuiLinearProgress-bar': {
          backgroundColor: calculateVarient()
        }
      }}
    />
  );
};

export default HeaderProgress;
