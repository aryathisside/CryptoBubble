import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import Chart from '../../utils/Chart';

const ChartCanvas = ({ quotes, period }) => {
  const canvasContainerRef = useRef();
  const [chartInstance, setChartInstance] = useState();
  useEffect(() => {
    if (canvasContainerRef.current) {
      const CI = new Chart(canvasContainerRef.current);
      CI.start();
      setChartInstance(CI);
      CI.quotes = quotes;
      CI.baseCurrency = {
        id: 'usd',
        symbol: '$',
        code: 'USD'
      };
      CI.period = period;
      CI.requestFrame();
    }
  }, [canvasContainerRef, quotes]);
  //   useEffect(() => {
  //     if (!quotes) return;
  //     if (chartInstance) {
  //       chartInstance.quotes = quotes;
  //       if (chartInstance.quotes && config.period !== 'hour') {
  //         chartInstance.quotes = [
  //           ...chartInstance.quotes,
  //           {
  //             p: selectedCurrency.price,
  //             t: Date.now() / 1000
  //           }
  //         ];
  //       }
  //       //   chartInstance.colors = getThemeColors();
  //       chartInstance.baseCurrency = 'USD';
  //       chartInstance.period = config.period;
  //       chartInstance.requestFrame();
  //     }
  //   }, [chartInstance]);
  useEffect(() => {
    return () => {
      if (chartInstance) chartInstance.stop();
    };
  });
  return (
    <Box className="price-chart">
      <canvas ref={canvasContainerRef} />
    </Box>
  );
};

export default ChartCanvas;
