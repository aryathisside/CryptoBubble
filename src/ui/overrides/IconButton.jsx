import { IconButton, styled } from '@mui/material';

const StyledIconButton = styled(IconButton)({
  height: 36,
  width: 36,
  color: 'white',
  background: '#ffffff1f',
  borderRadius: 50,
  ':hover': {
    background: '#ffffff40'
  }
});

export default StyledIconButton;
