import { Button, styled } from '@mui/material';

const StyledButton = styled(Button)({
  padding: '10px 15px',
  color: 'white',
  background: 'none',
  borderRadius: 12,
  border: "2px solid #2A2E36",
  ':hover': {
    background: '#ffffff40'
    
  }
});

export default StyledButton;
