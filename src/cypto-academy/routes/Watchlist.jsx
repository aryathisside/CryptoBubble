import { useEffect, useState } from 'react';
import {
  // LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type as ListType
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import { Link, useNavigate } from 'react-router-dom';

import emptyWatchlistLogo from '../Assets/svg/emptyWatchlist.svg';
import BuyCoins from '../Components/BuyCoins';
import { useGetCoinsDataQuery } from '../services/coinsDataApi';
import { useAuth } from '../../Context/AuthContext';
import { supabase } from '../Utils/init-supabase';
import { useGetWatchlistDataQuery } from '../services/supabaseApi';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';

import Loader from '../Components/Loader';
import DynamicPagination from '../../components/common/Pagination';
import { BsArrowDownUp, BsArrowLeftRight } from 'react-icons/bs';
import { FaShoppingCart } from 'react-icons/fa';
import { IoIosArrowRoundForward } from 'react-icons/io';
import priceIcon from '../Assets/svg/price-icon.svg';

const trailingActions = (coinId, userId, refetch) => {
  async function handleDelete() {
    try {
      const {
        // data,
        error
      } = await supabase.from('watchlist').delete().eq('coinId', `${coinId}`).eq('userId', `${userId}`);
      if (error) {
        throw new Error(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <TrailingActions>
      <SwipeAction className="bg-red-500 py-5 px-3  text-white font-bold cursor-pointer" onClick={() => handleDelete()}>
        Delete
      </SwipeAction>
      <SwipeAction>
        <Link to={`/papertrade/app/coin/${coinId}`} className="bg-blue-500 py-5 px-3  text-white font-bold">
          View
        </Link>
      </SwipeAction>
    </TrailingActions>
  );
};

const Watchlist = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [newsData, setNewsData] = useState([]);

  const {
    data,
    error: MarketFetcherror,
    isLoading: MarketFetchLoading,
    isSuccess: MarketFetchSuccess
  } = useGetCoinsDataQuery({ pollingInterval: 60000 });

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
      console.error('Error fetching trade history:', error.message);
      return [];
    }
  }

  useEffect(() => {
    getSimulatorNews();
  }, []);

  async function handleDelete(coinId, userId) {
    try {
      const {
        // data,
        error
      } = await supabase.from('watchlist').delete().eq('coinId', `${coinId}`).eq('userId', `${userId}`);
      if (error) {
        throw new Error(error);
      }
      refetch();
    } catch (error) {
      console.log(error);
    }
  }

  // fetch watchlist coin data
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = watchlistData?.slice(indexOfFirstItem, indexOfLastItem);


  return (
    <section className="lg:px-4 py-2 lg:py-8 w-full  p-2 flex">
        {isLoading ? <Loader />:

      <>
      <div className="bg-[#171A24] w-full lg:w-[72%] py-6 px-4 rounded-[12px] lg:mx-4 mt-4 sm:m-2 relative">
        <div className="md:flex justify-between">
          <div>
            <p className="text-white font-bold text-xl md:text-2xl font-title lg:mt-0 mb-2 ml-3">WatchList</p>
            <p className="text-[#A9A9A9] text-sm  font-title lg:mt-0 mb-4 ml-3">Keep track on your favorite crypto in one place.</p>
          </div>
          <div className="md:px-4" onClick={() => navigate('/papertrade/app/search')}>
            <label for="table-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"></path>
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="w-full mb-4 sm:w-[auto] lg:w-[300px] text-sm rounded-lg block pl-10 p-2.5 bg-[#171A24] border-2 border-[#2A2E36] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search Crypto here..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        {/* <p className="text-white font-semibold text-md font-title  ml-3 mb-4">Swipe left to delete or view the coins.</p> */}
        {error && watchlistData?.length !== 0 && <p className="text-2xl text-red-400 px-4">Something went wrong</p>}
        {/* coin table */}
        {watchlistData?.length === 0 && (
          <div className=" shadow-lg rounded-2xl  px-4 py-4 md:px-4 flex flex-col lg:justify-center align-center text-center max-w-xl m-auto">
            <img src={emptyWatchlistLogo} alt="empty watchlist" />
            <p className="text-white text-xl font-bold my-2 lg:text-center">Your watchlist is empty</p>
            <p className="text-gray-300 lg:text-center mb-5">Press the button to browse all the coins</p>
            <Link
              to="/papertrade/app/market"
              className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
              View Coins
            </Link>
          </div>
        )}
        <div className="overflow-x-auto mb-4">
          {isSuccess && watchlistData?.length !== 0 && (
            <table className="w-full text-white border-collapse font-light mt-4">
              <thead className="bg-[#2A2E36]">
              <tr className="text-[#A9A9A9] text-sm font-light">
                  {/* Apply rounded corners based on screen size */}

                  <th className="text-left p-2 rounded-tl-md rounded-bl-md">Name</th>
                  <th className="p-2 text-center">Price</th>
                  <th className="hidden lg:table-cell text-center p-2">24h Volume</th>
                  <th className="hidden md:table-cell text-center p-2">24h %</th>
                  <th className="hidden lg:table-cell text-center p-2">24h High</th>
                  <th className="hidden lg:table-cell text-center p-2 ">24h Low</th>

                  <th className="hidden md:table-cell px-4 py-3 text-left rounded-tr-md rounded-br-md">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {currentItems.map((coin, index) => (
                  <tr key={index} className="hover:bg-[#080808] cursor-pointer">
                    <td className="flex items-center space-x-2 px-2 py-3">
                      <img className="h-7 w-7 md:h-8 md:w-8 object-contain" src={coin.image.small} alt="crypto" loading="lazy" />
                      <div>
                        <p className="text-white font-semibold truncate text-sm">
                          {coin.name} <span className="text-[#CFA935] text-[8px] bg-[#00000033] p-1.5"> {coin.symbol.toUpperCase()}</span>
                        </p>

                        {/* <p className=' text-sm'>{`$/USD`}</p> */}
                      </div>
                    </td>
                    {/* <td className="px-4 py-2 flex items-center space-x-2">
                      <img className="h-8 w-8 md:h-10 md:w-10 object-contain" src={coin.image.small} alt="cryptocurrency" loading="lazy" />
                      <div>
                        <p className="font-semibold">{coin.name}</p>
                        <p className="text-gray-400">{`${coin.symbol}/USD`.toUpperCase()}</p>
                      </div>
                    </td> */}
                    <td className="text-center p-3">
                      <p className="flex items-center justify-center text-sm">
                        ${coin?.market_data.current_price.usd}
                        <img src={priceIcon} alt="price" className="w-4 h-4 ml-1" />
                      </p>
                      <p className="block md:hidden">
                        <span className={coin?.market_data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {coin?.market_data.price_change_percentage_24h >= 0 && '+'}
                          {coin?.market_data.price_change_percentage_24h?.toFixed(2)}%
                        </span>
                      </p>
                    </td>
                    <td className="hidden lg:table-cell  text-sm p-3">${coin?.market_data?.total_volume?.usd}</td>
                    <td className="hidden md:table-cell px-4 py-2 font-semibold">
                      <span className={coin?.market_data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {coin?.market_data.price_change_percentage_24h >= 0 && '+'}
                        {coin?.market_data.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </td>
                    <td className="hidden lg:table-cell text-center  text-sm p-3">${coin?.market_data?.high_24h?.usd}</td>

                    {/* 24h Low */}
                    <td className="hidden lg:table-cell text-center text-sm p-3">${coin?.market_data?.low_24h?.usd}</td>
                    {/* <td className="px-4 py-2 font-semibold">
                      ${coin?.market_data.current_price.usd}
                      <span className="md:hidden block text-gray-500 text-sm">MCap: {normalizeMarketCap(coin?.market_data.market_cap.usd)}</span>
                    </td> */}

                    {/* <td className="hidden md:table-cell px-4 py-2">${coin?.market_data.market_cap.usd}</td> */}
                    <td className="hidden md:table-cell px-4 py-2 flex gap-2">
                      <button
                        className="text-white border-2 border-[#2A2E36] rounded-md p-2"
                        onClick={() => navigate(`/papertrade/app/coin/${coin.id}`)}>
                        <IoEyeOutline className="text-[18px]" />
                      </button>
                      <button className="text-white border-2 border-[#2A2E36] rounded-md p-2" onClick={() => handleDelete(coin.id, currentUser.uid)}>
                        <FaRegTrashAlt className="text-[18px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="absolute left-0 w-full bottom-4 mt-4">
          <DynamicPagination
            totalItems={watchlistData?.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
      <div className="w-[27%] lg:mx-4 mt-4 sm:mx-2 hidden lg:block">
        {MarketFetchSuccess && <BuyCoins data={data} />}
        <div className="bg-[#171A24] py-6 px-4 rounded-[12px] mt-4">
          <div className="flex justify-between items-center ">
            <div className="text-white">
              News <span className="text-[#A9A9A9]">(for watchlist cryptos)</span>
            </div>
            <div className="border-2 border-[#2A2E36] p-2 rounded cursor-pointer" onClick={() => navigate('/papertrade/app/news')}>
              <IoIosArrowRoundForward className="text-[#A9A9A9]" />
            </div>
          </div>
          {newsData &&
            newsData.slice(0, 4).map((news, index) => {
              return (
                <Link key={index} to={news?.url} target="_blank" rel="noopener noreferrer">
                  <div className="mt-2 mb-2">
                    <div className="text-[#A9A9A9] text-sm">{news?.domain}</div>
                    <div className="text-white text-sm">{news?.title}</div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
      </>}
    </section>
  );
};

export default Watchlist;
