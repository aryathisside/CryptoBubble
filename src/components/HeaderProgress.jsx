import { LinearProgress } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Helper from '../utils/Helper';
import useConfigStore from '../store/useConfigStore';
import useDataStore from '../store/useDataStore';
const CACHE_DURATION = 60000; // 1 minute

const HeaderProgress = () => {
  const config = useConfigStore((state) => state.configuration);
  const currencies = useDataStore((state) => state.currencies);
  const setCurrencies = useDataStore((state) => state.setCurrencies);
  const setLoading = useDataStore((state) => state.setLoading);

  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const requestRef = useRef();

  const apiCall = async () => {
    console.log('calling api .....');
    const req = await fetch(process.env.REACT_APP_API_URL);
    const data = await req.json();
    localStorage.setItem('cryptoData', JSON.stringify(data));
    localStorage.setItem('cryptoDataTimestamp', Date.now()); // Store timestamp

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
    const fetchDataFromLocalStorage = () => {
      const storedData = localStorage.getItem('cryptoData');
      const storedTimeStamp = localStorage.getItem('cryptoDataTimestamp');
      if (storedData && storedTimeStamp) {
        const elapsedTime = Date.now() - storedTimeStamp;
        if (elapsedTime < CACHE_DURATION) {
          setCurrencies(JSON.parse(storedData));
          setLoading(false);
        } else {
          // If more than 1 minute has passed, fetch new data
          setLoading(true);
          apiCall().then(() => setLoading(false));
        }
      } else {
        setLoading(true);
        apiCall().then(() => setLoading(false));
      }
    };

    fetchDataFromLocalStorage();

    const intervalId = setInterval(() => {
      apiCall();
    }, 60000); // 60 seconds interval

    requestRef.current = requestAnimationFrame(updateProgress);

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(requestRef.current);
    };
  }, [setCurrencies, setLoading]);

  const calculateVarient = () => {
    const weight = Helper.calculateConfigurationWeight(config, currencies);
    if (weight > 0) {
      return '#3f3';
    }
    if (weight < 0) {
      return '#f66';
    }
    return '#07d';
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
