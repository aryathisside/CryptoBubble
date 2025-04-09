import React, { useEffect } from 'react'
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useGetWatchlistDataQuery } from '../services/supabaseApi';
import { IoIosArrowRoundForward } from "react-icons/io";
import {
    // LeadingActions,
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions,
    Type as ListType
  } from 'react-swipeable-list';

const MiniWatchlist = () => {
      const { currentUser } = useAuth();
      const navigate = useNavigate();

        const {
          data: watchlistData,
          error,
          isLoading,
          // isFetching,
          isSuccess,
          refetch
        } = useGetWatchlistDataQuery(currentUser.uid);
      
        useEffect(() => {
          const interval = setInterval(() => refetch(), 60000);
      
          return () => {
            clearInterval(interval);
          };
        }, []);

        const normalizeMarketCap = (marketCap) => {
            if (marketCap > 1_000_000_000_000) {
              return `${Math.floor(marketCap / 1_000_000_000_000)} T`;
            }
            if (marketCap > 1_000_000_000) {
              return `${Math.floor(marketCap / 1_000_000_000)} B`;
            }
            if (marketCap > 1_000_000) {
              return `${Math.floor(marketCap / 1_000_000)} M`;
            }
            if (marketCap > 1_000) {
              return `${Math.floor(marketCap / 1_000)} K`;
            }
            return marketCap;
          };
  return (
    <div className="bg-[#171A24] py-6 rounded-[12px]">
      <div className='flex justify-between px-4 pb-4'>
      <div className='text-white text-md font-semibold'>
        Watchlist
      </div>
      <div className='text-sm text-[#A9A9A9] cursor-pointer flex items-center' onClick={() => navigate("/papertrade/app/watchlist")}>See all <IoIosArrowRoundForward /></div>
      </div>
      
          {isSuccess && watchlistData?.length !== 0 && (
                <div fullSwipe={false} type={ListType.IOS} className="md:px-4 flex flex-col space-y-1 pb-12 text-white font-text">
                  {/* Table Head */}
                  <li className="grid grid-cols-3 text-gray-500 py-3 px-1 md:px-5 cursor-pointer bg-[#2A2E36] rounded-md ">
            
                    <div className="flex justify-start items-center space-x-4">
                      <p className="text-white pl-4 w-30">Name</p>
                    </div>
                    <div className="flex items-center ml-auto md:ml-0 justify-end">
                      <p className="text-white">Price</p>
                    </div>
                    <div className="flex items-center ml-auto md:ml-0 justify-end">
                      <p className="text-white w-20">24h %</p>
                    </div>
       
                  </li>
                  {isSuccess &&
                    watchlistData?.length !== 0 &&
                    watchlistData?.slice(0,8)?.map((coin, index) => (

                        <div className="grid grid-cols-3 text-gray-500 py-2 px-1md:px-5 hover:bg-gray-900 rounded-lg cursor-pointer xl:w-full" key={index} style={{height:"60px"}}>
            
                          <div className="flex items-center space-x-2 ">
                            <img className="h-6 w-6 object-contain" src={coin.image.small} alt="cryptocurrency" loading="lazy" />
                            <div>
                              <p className="w-40 text-white break-words font-semibold">{coin.name} 
                                <span className='text-[#CFA935] text-sm uppercase'> {coin.symbol}</span>
                              </p>
                             
                            </div>
                          </div>
                          <div className="flex items-center ml-auto md:ml-0 justify-end">
                            <p className=" text-white font-semibold">
                              ${coin?.market_data.current_price.usd}
                              <br />
                              <span className="md:hidden w-28 md:w-40 text-gray-500">MCap: {normalizeMarketCap(coin?.market_data.market_cap.usd)}</span>
                            </p>
                          </div>
                          <div className="hidden md:flex items-center justify-end">
                            <p
                              className={` ${
                                coin?.market_data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                              } font-semibold`}>
                              {coin?.market_data.price_change_percentage_24h >= 0 && '+'}
                              {coin?.market_data.price_change_percentage_24h?.toFixed(2)}%
                            </p>
                          </div>
                       
                        </div>
             
                    ))}
                 
                </div>
              )}
    </div>
  )
}

export default MiniWatchlist
