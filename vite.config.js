import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL),
      'process.env.BUBBLE_IMAGE_PATH': JSON.stringify(env.BUBBLE_IMAGE_PATH),
      'process.env.CHART_DATA_URL': JSON.stringify(env.CHART_DATA_URL),
      'process.env.CRYPTO_NEWS_URL': JSON.stringify(env.CRYPTO_NEWS_URL),
      'process.env.USER_LOGIN': JSON.stringify(env.USER_LOGIN),
      'process.env.USER_SIGNUP': JSON.stringify(env.USER_SIGNUP),
      'process.env.VERIFY_OTP': JSON.stringify(env.VERIFY_OTP),
      'process.env.FORGOT_PASSWORD': JSON.stringify(env.FORGOT_PASSWORD),
      'process.env.RESET_PASSWORD': JSON.stringify(env.RESET_PASSWORD),
      'process.env.WISHLIST_UPDATE': JSON.stringify(env.WISHLIST_UPDATE),
      'process.env.WISHLIST_DELETE': JSON.stringify(env.WISHLIST_DELETE),
      'process.env.GET_WISHLIST': JSON.stringify(env.GET_WISHLIST),
      'process.env.GOOGLE_LOGIN': JSON.stringify(env.GOOGLE_LOGIN),
      'process.env.LINKEDIN_LOGIN': JSON.stringify(env.LINKEDIN_LOGIN),
      'process.env.CHANGE_PASSWORD': JSON.stringify(env.CHANGE_PASSWORD),
      'process.env.LOGOUT': JSON.stringify(env.LOGOUT),
      'process.env.CONTACT_US': JSON.stringify(env.CONTACT_US),
      'process.env.DISCORD': JSON.stringify(env.DISCORD)
    



    },
    plugins: [react()],
  }
})
