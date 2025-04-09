import { IconButton, styled } from '@mui/material';

const StyledIconButton = styled(IconButton)({
  height: 36,
  width: 36,
  color: 'white',
  // background: '#ffffff1f',
  border: "2px solid #2A2E36",
  borderRadius: 5,
  ':hover': {
    background: '#ffffff40'
  }
});

export default StyledIconButton;
