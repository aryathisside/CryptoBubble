import { TextField, styled } from '@mui/material';

export const SearchTextField = styled(TextField)({
  colorScheme: 'dark',
  '& .MuiOutlinedInput-root': {
    padding: '5px 10px',
    color: 'white',
    borderRadius: '5px',
    input: {
      padding: '5px',
      textAlign: 'left'
    },
    '& fieldset': {
      borderColor: '#2A2E36'
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#03a9f4'
    }
  }
});

const StyledTextField = styled(TextField)({
  colorScheme: 'dark',
  '& .MuiOutlinedInput-root': {
    padding: '5px 10px',
    color: 'white',
    borderRadius: '5px',
    input: {
      padding: '5px',
      textAlign: 'center'
    },
    '& fieldset': {
      borderColor: '#2A2E36'
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

