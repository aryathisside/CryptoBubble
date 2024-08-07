import { Box, Grid, Typography } from '@mui/material';
import Helper from '../../utils/Helper';

const BoxItem = ({ children, onClick, selected }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderRadius: '12px',
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
  let color = 'rgba(255,255,255,.25)';
  if (value > 0 || value < 0) color = Helper.getSecondaryColor(value);
  return (
    <Typography
      fontSize={14}
      sx={{
        color: selected ? 'white' : '#ccc',
        background: selected && color,
        borderRadius: '6px',
        padding: '4px 8px',
        transition: 'background-color .2s'
      }}>
      {text}
    </Typography>
  );
};
const SecondText = ({ value }) => {
  let color = 'white';
  if (value > 0 || value < 0) color = Helper.getPrimaryColor(value);
  return (
    <Typography fontWeight={400} sx={{ color }}>
      {Helper.formatPercentage(value, true)}
    </Typography>
  );
};

const CurrencyPerformanceGrid = ({ symbol, period, setPeriod }) => {
  return (
    <Grid container p={1} columnSpacing={1}>
      <Grid item xs={3}>
        <BoxItem onClick={() => setPeriod('hour')} selected={period === 'hour'}>
          <FirstText text="Hour" value={symbol.performance.hour} selected={period === 'hour'} />
          <SecondText value={symbol.performance.hour} />
        </BoxItem>
      </Grid>
      <Grid item xs={3}>
        <BoxItem onClick={() => setPeriod('day')} selected={period === 'day'}>
          <FirstText text="Day" value={symbol.performance.day} selected={period === 'day'} />
          <SecondText value={symbol.performance.day} />
        </BoxItem>
      </Grid>
      <Grid item xs={3}>
        <BoxItem onClick={() => setPeriod('week')} selected={period === 'week'}>
          <FirstText text="Week" value={symbol.performance.week} selected={period === 'week'} />
          <SecondText value={symbol.performance.week} />
        </BoxItem>
      </Grid>
      <Grid item xs={3}>
        <BoxItem onClick={() => setPeriod('year')} selected={period === 'year'}>
          <FirstText text="Year" value={symbol.performance.year} selected={period === 'year'} />
          <SecondText value={symbol.performance.year} />
        </BoxItem>
      </Grid>
    </Grid>
  );
};

export default CurrencyPerformanceGrid;
