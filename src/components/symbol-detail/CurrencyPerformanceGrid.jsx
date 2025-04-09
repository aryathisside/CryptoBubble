import { Box, Grid, Typography } from '@mui/material';
import Helper from '../../utils/Helper';
import useConfigStore from '../../store/useConfigStore';
import { useEffect, useState } from 'react';
import useDataStore from '../../store/useDataStore';

const BoxItem = ({ children, onClick, selected }) => {

  const isMobile = useDataStore((state) => state.isMobile);


  return (
    <Box
      display="flex"
      flexDirection={isMobile?"column":"row"}
      // flexDirection="column"
      justifyContent={"center"
      }
      alignItems="center"
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderRadius: '8px',
        border: "2px solid #2A2E36",
        padding: '5px 0',
        transition: 'background-color .4s',
        background: selected && '#ffffff14',
        ':hover': { background: '#ffffff14' }
      }}>
      {children}
    </Box>
  );
};
const FirstText = ({ text, selected, value }) => {
  const colorScheme = useConfigStore((state) => state.colorScheme);
  let color = 'rgba(255,255,255,.25)';
  if (value > 0 || value < 0) color = Helper.getSecondaryColor(value,colorScheme);
  return (
    <Typography
      fontSize={13}
      sx={{
        color: selected ? 'white' : '#ccc',
        // background: selected && color,
        borderRadius: '6px',
        padding: '4px 8px',
        transition: 'background-color .2s'
      }}>
      {text}
    </Typography>
  );
};
const SecondText = ({ value }) => {
  const colorScheme = useConfigStore((state) => state.colorScheme);
  let color = 'white';
  if (value > 0 || value < 0) color = Helper.getPrimaryColor(value, colorScheme);
  return (
    <Typography fontWeight={400} sx={{ color }} fontSize={13}>
      {Helper.formatPercentage(value, true)}
    </Typography>
  );
};

const CurrencyPerformanceGrid = ({ symbol, period, setPeriod }) => {
  return (
    <Grid container p={1} columnSpacing={1}>
      <Grid item xs={2.4}>
        <BoxItem  onClick={() => setPeriod('hour')} selected={period === 'hour'}>
          <FirstText text="Hour" value={symbol.performance.hour} selected={period === 'hour'} />
          <SecondText value={symbol.performance.hour} />
        </BoxItem>
      </Grid>
      <Grid item xs={2.4}>
        <BoxItem onClick={() => setPeriod('day')} selected={period === 'day'}>
          <FirstText text="Day" value={symbol.performance.day} selected={period === 'day'} />
          <SecondText value={symbol.performance.day} />
        </BoxItem>
      </Grid>
      <Grid item xs={2.4}>
        <BoxItem onClick={() => setPeriod('week')} selected={period === 'week'}>
          <FirstText text="Week" value={symbol.performance.week} selected={period === 'week'} />
          <SecondText value={symbol.performance.week} />
        </BoxItem>
      </Grid>
      <Grid item xs={2.4}>
        <BoxItem onClick={() => setPeriod('month')} selected={period === 'month'}>
          <FirstText text="Month" value={symbol.performance.week} selected={period === 'month'} />
          <SecondText value={symbol.performance.month} />
        </BoxItem>
      </Grid>
      <Grid item xs={2.4}>
        <BoxItem onClick={() => setPeriod('year')} selected={period === 'year'}>
          <FirstText text="Year" value={symbol.performance.year} selected={period === 'year'} />
          <SecondText value={symbol.performance.year} />
        </BoxItem>
      </Grid>
    </Grid>
  );
};

export default CurrencyPerformanceGrid;
