import { Box, Grid, Typography } from '@mui/material';
import NumberComponent from '../common/AnimatedNumber';
import Helper from '../../utils/Helper';
import { useEffect, useState } from 'react';

const SymbolInfo = ({ symbol }) => {

  const [isMobile, setIsMobile]=useState(false)


  useEffect(() => {
    const cleanup = Helper.handleResize(setIsMobile);

    return cleanup;
  }, []);
  return (
    <Grid container mb={1} width={isMobile?"100%":"50%"} display={"flex"} justifyContent={isMobile?"center":"space-between"} >
      <Grid  item xs={4}>
        <Box display="flex" flexDirection="column" alignItems="center" width={"fit-content"}>
          <Typography typography="body2" sx={{ color: '#ccc' }}>
            Rank
          </Typography>
          <Typography typography="body1" sx={{ color: 'white' }}>
            {symbol.rank}
          </Typography>
        </Box>
      </Grid>
     
      <Grid item xs={4}>
        <Box display="flex" flexDirection="column" alignItems="center" width={"fit-content"}>
          <Typography typography="body2" sx={{ color: '#ccc' }}>
            24h Volume
          </Typography>
          <Typography typography="body1" sx={{ color: 'white' }}>
            <NumberComponent value={symbol.volume} />
          </Typography>
        </Box>
      </Grid>
     
    </Grid>
  );
};

export default SymbolInfo;