import { Box } from '@mui/material';
import StyledIconButton from '../../ui/overrides/IconButton';

const TradeLinks = ({ symbol, ...props }) => {
  const open = (url) => {
    window.open(url, 'blank');
  };
  return (
    <Box display="flex" justifyContent="center" mb={1} gap={1} {...props}>
      <StyledIconButton onClick={() => open(`https://coinmarketcap.com/currencies/${symbol.slug}`)} sx={{p: 0}} style={{padding:'0px'}}>
      <img src="https://cdn.freelogovectors.net/wp-content/uploads/2023/05/coinmarketcap-logo-01-freelogovectors.net_.png" alt="" className='' style={{height:"20px",filter: "brightness(0) invert(1)"}}  />

      </StyledIconButton>
      <StyledIconButton onClick={() => open(`https://www.coingecko.com/en/coins/${symbol.slug}`)} sx={{ pr: 0.7 }}>
        <img src="https://i.pinimg.com/originals/be/c9/b3/bec9b33d6638ff927a96d0e93546a056.png" alt="" className='h-[20px] w-[20px]' style={{height:"20px"}} />
      </StyledIconButton>
    </Box>
  );
};

export default TradeLinks;
