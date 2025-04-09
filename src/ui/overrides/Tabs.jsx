/* eslint-disable prettier/prettier */
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Helper from '../../utils/Helper';
import useConfigStore from '../../store/useConfigStore';

export const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    display: 'flex',
    
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    
    width: '100%',
    backgroundColor: '#222222',
  

  }
});

export const StyledTab = styled((props) => <Tab disableRipple {...props} />, { shouldForwardProp: (props) => props !== 'variant' })(
  ({ theme, variant = 'buy' }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightNormal,
    fontSize: theme.typography.pxToRem(14),
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(1),
    // border: variant === 'neutral' ? 'solid #07d' : `solid ${Helper.getPrimaryColor(variant === 'sell' ? -1 : 1, useConfigStore.getState().colorScheme)} 2px;`,
    // borderTop: "12px",
    borderRadius:"8px",
    background: '#ffffff1f',
   
   
    // borderBottomLeftRadius: '12px',
    // borderBottomRightRadius: '12px',
    color: '#fff',
    minWidth: 0,
    transitionProperty: 'background-color,transform,opacity,border-color',
    transitionDuration: '0.4s',
    ':hover': {
      background: '#ffffff40'
    },
    '&.Mui-selected': {
      color: '#fff',
      // border: 'solid rgb(255, 102, 102) 2px',
      background: variant === 'neutral' ? '#07d' : `${Helper.getSecondaryColor(variant === 'sell' ? -1 : 1, useConfigStore.getState().colorScheme)}`
    }
  })
);
