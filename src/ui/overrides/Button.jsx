import { Button, styled } from '@mui/material';

const StyledButton = styled(Button)({
  padding: '10px 15px',
  color: 'white',
  background: '#ffffff1f',
  borderRadius: 12,
  ':hover': {
    background: '#ffffff40'
  }
});

export default StyledButton;
