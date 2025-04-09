import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export const StyledIconTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#222222'
  }
});

export const StyledIconTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightNormal,
  fontSize: theme.typography.pxToRem(17),
  marginRight: theme.spacing(0),
  background: '#ffffff1f',
  color: '#fff',
  padding: '10px 12px',
  minHeight: 40,
  minWidth: 0,
  transitionProperty: 'background-color,transform,opacity,border-color',
  transitionDuration: '0.4s',
  ':first-child': {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  ':last-child': {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  ':hover': {
    background: '#ffffff40'
  },
  '&.Mui-selected': {
    color: '#fff',
    background: '#07d'
  }
}));
