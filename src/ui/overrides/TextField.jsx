import { TextField, styled } from '@mui/material';

const StyledTextField = styled(TextField)({
  colorScheme: 'dark',
  '& .MuiOutlinedInput-root': {
    padding: '5px 10px',
    color: 'white',
    borderRadius: '12px',
    input: {
      padding: '5px',
      textAlign: 'center'
    },
    '& fieldset': {
      borderColor: '#ccc'
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#03a9f4'
    }
  }
});

export default StyledTextField;
