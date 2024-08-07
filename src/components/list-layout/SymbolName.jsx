import { Box, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import StyledIconButton from '../../ui/overrides/IconButton';
import useDataStore from '../../store/useDataStore';

const SymbolName = ({ symbol }) => {
  const setSelectedCurrency = useDataStore((state) => state.setSelectedCurrency);
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <StyledIconButton>
        <Add />
      </StyledIconButton>
      <Box
        display="flex"
        alignItems="center"
        sx={{
          height: 36,
          padding: '6px 15px',
          cursor: 'pointer',
          color: 'white',
          background: '#ffffff1f',
          borderRadius: 20,
          ':hover': {
            background: '#ffffff40'
          }
        }}
       >
        <img width={20} height={20} src={`https://cryptobubbles.net/backend/${symbol.image}`} alt={symbol.name} />
        <Typography color="white" ml={1}>
          {symbol.name}
        </Typography>
      </Box>
    </Box>
  );
};

export default SymbolName;
