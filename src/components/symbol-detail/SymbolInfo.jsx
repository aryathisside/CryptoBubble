import { Box, Grid, Typography } from '@mui/material';
import NumberComponent from '../common/AnimatedNumber';

const SymbolInfo = ({ symbol }) => {
  return (
    <Grid container mb={1}>
      <Grid item xs={4}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography typography="body2" sx={{ color: '#ccc' }}>
            Rank
          </Typography>
          <Typography typography="body1" sx={{ color: 'white' }}>
            {symbol.rank}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography typography="body2" sx={{ color: '#ccc' }}>
            24h Volume
          </Typography>
          <Typography typography="body1" sx={{ color: 'white' }}>
            <NumberComponent value={symbol.volume} />
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography typography="body2" sx={{ color: '#ccc' }}>
            1W Volume
          </Typography>
          <Typography typography="body1" sx={{ color: 'white' }}>
            <NumberComponent value={symbol.volumeWeekly} />
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SymbolInfo;
