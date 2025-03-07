import React from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';

const CoinDetail = ({ data }) => {
  return (
    <div className="flex">
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
          <div className="border-2 border-[#2A2E36] p-2 rounded">
            <IoIosArrowRoundForward className="text-[#A9A9A9]" />
          </div>
         
        </div>
        <img src={data?.image?.large} className="w-12" alt={data?.name} />
        <div className='text-[#A9A9A9]'>{data?.description?.en.slice(0,528)}</div>
      </div>
      <div className="bg-[#171A24] py-6 px-4 rounded-[12px] m-3 flex-1">
        <div className="flex justify-between items-center ">
          <div className="text-white">
            News <span className="text-[#A9A9A9]">(for watchlist cryptos)</span>
          </div>
          <div className="border-2 border-[#2A2E36] p-2 rounded">
            <IoIosArrowRoundForward className="text-[#A9A9A9]" />
          </div>
        </div>
        <div className="mt-2 mb-2">
          <div className="text-[#A9A9A9] text-sm">5 Days ago</div>
          <div className="text-white text-sm">Pi Network’s Open Mainnet is now live, marking a major milestone after ...</div>
        </div>

        <div className="mt-2 mb-2">
          <div className="text-[#A9A9A9] text-sm">5 Days ago</div>
          <div className="text-white text-sm">Pi Network’s Open Mainnet is now live, marking a major milestone after ...</div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
