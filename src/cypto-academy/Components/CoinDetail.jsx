import React, { useEffect, useState } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';

const CoinDetail = ({ data, coinDetail }) => {
    const navigate = useNavigate();

    const [newsData, setNewsData] = useState([]);
  
    async function getSimulatorNews() {
      try {
        const response = await fetch(`${process.env.CRYPTO_NEWS_URL}/${coinDetail}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch trade history.');
        }
  
        console.log('single news :', result?.data?.results);
        setNewsData(result?.data?.results);
    
        //   return result.history; // Returns the trade history array
      } catch (error) {
          console.error('Error fetching trade history:', error.message);
        return [];
      }
    }
  
    useEffect(() => {
      getSimulatorNews();
    }, []);
  return (
<div className="flex flex-col sm:flex-row">

      <div className="bg-[#171A24] py-6 px-4 rounded-[12px] m-3 flex-1">
        <div className="text-white">Overview</div>

        <div className="flex justify-between ">
          <ul>
            <li className="text-white py-3 ">
              <div className="text-sm">
                <span className="text-sm text-[#AEB9E1]">24th Volume</span>
              </div>
              <div>
                <p className="text-md">${data.market_data.total_volume.usd}</p>
              </div>
            </li>
            <li className="text-white py-3 ">
              <div className="text-sm">
                <span className="text-sm text-[#AEB9E1]">All Time High</span>
              </div>
              <div>
                <p className="text-md">${data.market_data.ath.usd}</p>
              </div>
            </li>

            <li className="text-white py-3 ">
              <div className="text-sm">
                <span className="text-sm text-[#AEB9E1]">Rank</span>
              </div>
              <div>
                <p className="text-md">#{data.market_cap_rank}</p>
              </div>
            </li>

            <li className="text-white py-3 ">
              <div className="text-sm">
                <span className="text-sm text-[#AEB9E1]">Circulating Supply</span>
              </div>
              <div>
                <p className="text-md">{data.market_data.circulating_supply}</p>
              </div>
            </li>
          </ul>
          <ul>
            <li className="text-white py-3 ">
              <div className="text-sm">
                <span className="text-sm text-[#AEB9E1]">Market Cap</span>
              </div>
              <div>
                <p className="text-md">${data.market_data.market_cap.usd}</p>
              </div>
            </li>
            <li className="text-white py-3 ">
              <div className="text-sm">
                <span className="text-sm text-[#AEB9E1]">Total volume</span>
              </div>
              <div>
                <p className="text-md">${data.market_data.total_volume.usd}</p>
              </div>
            </li>
            <li className="text-white py-3 ">
              <div className="text-sm">
                <span className="text-sm text-[#AEB9E1]">Price To USD</span>
              </div>
              <div>
                <p className="text-md">${data.market_data.current_price.usd}</p>
              </div>
            </li>
            
          </ul>
        </div>
      </div>
      <div className="bg-[#171A24] py-6 px-4 rounded-[12px] m-3 flex-1">
        <div className="flex justify-between items-center mb-2">
          <div className="text-white">About</div>
          {/* <div className="border-2 border-[#2A2E36] p-2 rounded">
            <IoIosArrowRoundForward className="text-[#A9A9A9]" />
          </div> */}
         
        </div>
        <img src={data?.image?.large} className="w-12" alt={data?.name} />
        <div className='text-[#A9A9A9] text-sm'>{data?.description?.en.slice(0,528)}</div>
      </div>
      <div className="bg-[#171A24] py-6 px-4 rounded-[12px] m-3 flex-1">
        <div className="flex justify-between items-center ">
          <div className="text-white">
            News <span className="text-[#A9A9A9]">(for watchlist cryptos)</span>
          </div>
          <div className="border-2 border-[#2A2E36] p-2 rounded cursor-pointer"  onClick={() => navigate('/papertrade/app/news')}>
            <IoIosArrowRoundForward className="text-[#A9A9A9]" />
          </div>
        </div>

        {newsData && newsData.slice(0,4).map((news, index)=> {
          return (
           <Link key={index}  to={news?.url} target="_blank" rel="noopener noreferrer">
            <div className="mt-2 mb-2" >
          <div className="text-[#A9A9A9] text-sm">{news?.domain}</div>
          <div className="text-white text-sm">{news?.title}</div>
        </div>
           </Link>
          )
        }) }
      </div>
    </div>
  );
};

export default CoinDetail;
