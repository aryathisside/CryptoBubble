import { Box, Container } from '@mui/material';

const LogoMobile = (props) => {
  return (
    <Box display="grid" {...props}>
      <svg viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.9841 6.5731L10.5267 3.44896L22.8765 2.86384C21.1691 1.0991 18.7774 0 16.1281 0H0V16.7871L12.9841 6.5731Z"
          fill="url(#paint0_linear_1786_3061)"
        />
        <path
          d="M29.7997 28.7576C29.7997 33.5731 26.7699 37.68 22.5147 39.2815L15.5567 30.4363L22.9404 24.6292L18.4492 18.9191L11.0659 24.7284L7.46753 20.1539L17.4747 12.2821L19.0734 14.3132V14.3148L20.1549 15.6891L23.6491 3.76611C24.2359 4.54977 24.7041 5.42883 25.0245 6.37572C25.3449 7.32261 25.5181 8.33623 25.5181 9.39177C25.5181 12.9902 23.4936 16.1138 20.5238 17.6905C23.1599 18.1548 25.4783 19.539 27.1378 21.4968C28.7988 23.454 29.7997 25.9886 29.7997 28.7576Z"
          fill="url(#paint1_radial_1786_3061)"
        />
        <path d="M0 22.4094V40H13.8372L0 22.4094Z" fill="url(#paint2_linear_1786_3061)" />
        <path opacity="0.31" d="M8.9069 21.9836L7.46753 20.1538L17.4747 12.282L8.9069 21.9836Z" fill="black" />
        <defs>
          <linearGradient id="paint0_linear_1786_3061" x1="9.50268" y1="3.03736" x2="-3.38461" y2="13.7268" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0092FF" />
            <stop offset="1" stopColor="#084B9A" />
          </linearGradient>
          <radialGradient
            id="paint1_radial_1786_3061"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(17.8016 17.0462) scale(13.4069 13.4069)">
            <stop stopColor="#0092FF" />
            <stop offset="1" stopColor="#084B9A" />
          </radialGradient>
          <linearGradient id="paint2_linear_1786_3061" x1="0.328572" y1="28.5494" x2="8.32069" y2="42.4357" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0092FF" />
            <stop offset="1" stopColor="#084B9A" />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  );
};

export default LogoMobile;
