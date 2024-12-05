import { TextField, InputAdornment } from '@mui/material';

const FormInput = ({ icon, ...props }) => {
  return (
    <TextField
      {...props}
      sx={{
        backgroundColor: '#2A2E36',
        borderRadius: '8px',
        '& .MuiOutlinedInput-root': {
          '& input': {
            color: 'white', // Set typed text color to white
          },
          '& fieldset': {
            border: 'none',
          },
          '&:hover fieldset': {
            border: 'none',
          },
          '&.Mui-focused fieldset': {
            border: 'none',
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'white',
        },
        '& .MuiInputLabel-root': {
          color: 'white',
        },
      }}
      InputProps={{
        endAdornment: icon ? <InputAdornment position="end">{icon}</InputAdornment> : null,
      }}
    />
  );
};

export default FormInput;
