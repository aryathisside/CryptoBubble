import axios from "axios";

export const Login = async (email,password) => {
    try {
     

      // Send login request to the backend
      const response = await axios.post(process.env.USER_LOGIN, { email, password });

      // Handle successful login (response contains the token)
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token); // Store token in localStorage
      localStorage.setItem("userEmail", response.data.userEmail)
      return {status:"success", message:"Login successful"}
    } catch (err) {
      // Check for specific backend errors

      // Handling specific errors from the backend
      if (err.response?.status === 400) {
        return { status:"failed", message:err.response?.data?.message || 'Please provide both email and password'}
     
      } else if (err.response?.status === 404) {
        // Handle "User not found" error
        return {status:"failed", message:err.response?.data?.message || 'User not found' }
  
      } else if (err.response?.status === 401) {
        // Handle incorrect password or unauthorized errors
        return {status:"failed",message:err.response?.data?.message || 'Incorrect password'}
      
      } else {
        // For any other errors (500, etc.)
        return{status:"failed", message:err.response?.data?.message || 'An error occurred while logging in'}
  
      }
  
  
  }
}

export const handleGoogleLogin = () => {
  // Redirect the user to the Google OAuth endpoint on your server
  window.location.href = "http://localhost:3001/api/auth/google"; // Update with your backend URL
};
export const handleLinkedinLogin = () => {
  // Redirect the user to the Google OAuth endpoint on your server
  window.location.href = "http://localhost:3001/api/auth/linkedin"; // Update with your backend URL
};