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
  useEffect(() => {
    return () => {
      if (chartInstance) chartInstance.stop();
    };
  });
  return (
    <Box className="price-chart" height={300} >
      <canvas ref={canvasContainerRef} />
    </Box>
  );
};

export default ChartCanvas;
