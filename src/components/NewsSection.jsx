import { KeyboardDoubleArrowRight } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import React from 'react';

const NewsSection = ({newsItem}) => {
  return (
    <>
      <Box key={newsItem.id} mb={2} bgcolor={'none'} padding={1} borderRadius={2} marginRight={1} border={"2px solid #2A2E36"}>
       <Link href={newsItem.url} target={"_blank"} sx={{textDecoration:"none"}}>
       <Typography variant="subtitle2" color="white" sx={{ fontSize: '0.85rem' }}>
          {newsItem.title}
        </Typography>
        <Typography variant="body2" color="white" sx={{ fontSize: '0.65rem' }} paddingY={1}>
          {new Date(newsItem.published_at).toLocaleDateString()}{' '}
          <a
            href={`https://${newsItem.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#CFA935', fontSize: '0.65rem', textDecoration: 'none' }}>
            {' '}
            {newsItem.domain}
          </a>
        </Typography>
        <Box display={'flex'} alignItems={'center'} flexDirection={'row'} fontSize={'0.65rem'}>
          <a href={newsItem.url} target="_blank" rel="noopener noreferrer" style={{ color: '#CFA935', textDecoration: 'none' }}>
            Read more
          </a>
          <KeyboardDoubleArrowRight sx={{ color: '#CFA935', fontSize: '0.80rem' }} />
        </Box>
       
       
       </Link>
      </Box>
    </>
  );
};

export default NewsSection;
