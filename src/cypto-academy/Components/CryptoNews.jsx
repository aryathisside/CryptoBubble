import React, { useEffect, useState } from 'react';
import newsImage from '../Assets/images/PiNetwork.png';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowRoundForward } from 'react-icons/io';

const CryptoNews = () => {
  const [newsData, setNewsData] = useState([]);
  const navigate = useNavigate();

  async function getSimulatorNews() {
    try {
      const response = await fetch(`${process.env.SIMULATOR_API}/getNews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch trade history.');
      }

      console.log('news :', result?.data?.results);
      setNewsData(result?.data?.results);
      //   return result.history; // Returns the trade history array
    } catch (error) {
      //   console.error('Error fetching trade history:', error.message);
      return [];
    }
  }

  useEffect(() => {
    getSimulatorNews();
  }, []);
  return (
    <div className="py-6 m-3 border-t-2 border-[#2A2E36]">
      <div className="flex justify-between">
        <div className="text-white font-semibold text-md">Latest News & Articles</div>
        <div className="text-sm text-[#A9A9A9] cursor-pointer flex items-center" onClick={() => navigate('/papertrade/app/news')}>
          See all news <IoIosArrowRoundForward />
        </div>
      </div>

      <div className="md:flex w-full gap-4 mt-4">
        {newsData &&
          newsData.slice(0, 5).map((news, index) => (
            <div key={index} className="flex-1 items-center justify-center">
              <img src={newsImage} alt="crypto" className="w-full h-auto rounded-2xl" />
              <div className="text-white mt-2">{news?.source?.title}</div>
              <div className="text-[#A9A9A9] text-sm mt-2 mb-2 line-clamp-2">{news?.title}</div>

              <Link to={news?.url} target="_blank" rel="noopener noreferrer" className="text-[#CFA935] hover:underline">
                Read more &gt;&gt;
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CryptoNews;
