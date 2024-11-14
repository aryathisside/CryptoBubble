import { TextField, InputAdornment } from '@mui/material';

const FormInput = ({ icon, ...props }) => {
  return (
    <TextField
      {...props}
      sx={{
        backgroundColor: '#2A2E36',
        borderRadius: '8px',
        '& .MuiOutlinedInput-root': {
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
          color: '#A9A9A9',
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
