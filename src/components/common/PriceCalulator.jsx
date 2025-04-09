import { Box, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';
import {  useState } from 'react';
import StyledTextField from '../../ui/overrides/TextField';

import NumberComponent from './AnimatedNumber';

const PriceCalculator = ({ selectedCurrency }) => {
  const [value, setValue] = useState(1);
 

  return (
    
    <Box display="flex" justifyContent="center" alignItems="center" py={1} mb={1} px={2}>
      <StyledTextField
        type="number"
        InputProps={{ startAdornment: <Edit /> }}
        placeholder="Amount"
        value={value}
        sx={{ maxWidth: 120 }}
        onChange={(event) => setValue(event.target.value)}
      />
      <Typography typography="h6" fontWeight="500" ml={1} sx={{ color: '#ccc', textWrap: 'nowrap' }}>
        {selectedCurrency.symbol} =
      </Typography>
      <Typography typography="h6" fontWeight="500" ml={1} sx={{ color: 'white' }}>
        <NumberComponent value={selectedCurrency.price * Number(value)} />
      </Typography>
    </Box>
  );
};

export default PriceCalculator;