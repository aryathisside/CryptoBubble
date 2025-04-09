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
          display:"none"
        },
        '& .MuiInputLabel-root': {
          color: 'white',
        },
        '& .MuiInputLabel-shrink': {
          transform: 'translate(0, -16px)', // Ensures label stays above when content is present
          display:"none"
        },
      }}
      InputProps={{
        endAdornment: icon ? <InputAdornment position="end">{icon}</InputAdornment> : null,
      }}
    />
  );
};

export default FormInput;
