# Stage 1: Build the Vite app
FROM node:18 AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy all files and build the app
COPY . .

# # Set environment variables
# ENV REACT_APP_API_URL="https://testverify.certs365.io/crypto/v1/crypto/fetch-crypto" \
#     BUBBLE_IMAGE_PATH="https://cryptobubbles.net/backend" \
#     CHART_DATA_URL="https://testverify.certs365.io/crypto/v1/crypto/fetch/graph" \
#     CRYPTO_NEWS_URL="https://testverify.certs365.io/crypto/v1/crypto/fetch/news" \
#     USER_LOGIN="https://testverify.certs365.io/crypto/v1/crypto/login" \
#     USER_SIGNUP="https://testverify.certs365.io/crypto/v1/crypto/signup" \
#     VERIFY_OTP="https://testverify.certs365.io/crypto/v1/crypto/signup/verify-otp" \
#     FORGOT_PASSWORD="https://testverify.certs365.io/crypto/v1/crypto/login/forgot-password" \
#     RESET_PASSWORD="https://testverify.certs365.io/crypto/v1/crypto/login/reset-password" \
#     WISHLIST_UPDATE="https://testverify.certs365.io/crypto/v1/crypto/updateWishlist" \
#     WISHLIST_DELETE="https://testverify.certs365.io/crypto/v1/crypto/deleteWishlist" \
#     GET_WISHLIST="https://testverify.certs365.io/crypto/v1/crypto/getUserWishlist" \
#     GOOGLE_LOGIN="https://testverify.certs365.io/crypto/api/auth/google" \
#     LINKEDIN_LOGIN="https://testverify.certs365.io/crypto/api/auth/linkedin" \
#     LOGOUT="https://testverify.certs365.io/crypto/v1/crypto/logout" \
#     DISCORD="https://discord.gg/b66746EM" \
#     CONTACT_US="https://www.aicerts.io/contact-us/" \
#     DELETE_ACCOUNT="https://testverify.certs365.io/crypto/v1/crypto/delete-account" \
#     WATCHLIST_CHARACTER_LIMIT="20" \
#     CRYPTO_ACADEMY="https://admindev.certs365.io/papertrade" \
#     SIMULATOR_API="https://testverify.certs365.io/crypto/v1/simulator" \
#     COINGECKO_KEY="CG-Dyy1rhWZuTgoDXgXUNvJ6wB3" \
#     VITE_SUPABASE_API="https://zpyjyoizpwiihevdufrx.supabase.co" \
#     VITE_SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpweWp5b2l6cHdpaWhldmR1ZnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MzI5MDYsImV4cCI6MjA1MjAwODkwNn0.1x_GuwzxvGClwWdalxvT31q7uhcRRZLRn6p4QlSeUhU" 


RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files to Nginx public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
