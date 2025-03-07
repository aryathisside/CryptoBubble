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
  const itemsPerPage = 10;

  async function handleDelete(coinId, userId) {
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
    const interval = setInterval(() => refetch(), 20000);

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
    <section className="lg:px-4 py-2 lg:py-8  max-w-[1600px] h-[100vh] p-2 flex">
      <div className="bg-[#171A24] md:max-w-[1050px] py-6 px-4 rounded-[12px] md:m-3 m-2">
        <div className="md:flex justify-between">
          <div>
            <p className="text-white font-bold text-xl md:text-2xl font-title lg:mt-0 mb-2 ml-3">WatchList</p>
            <p className="text-[#A9A9A9] text-sm  font-title lg:mt-0 mb-4 ml-3">Keep track on your favorite crypto in one place.</p>
          </div>
          <div className="md:px-4">
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
                className="w-full mb-4 sm:w-auto text-sm rounded-lg block pl-10 p-2.5 bg-[#171A24] border-2 border-[#2A2E36] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for Cryptocurrency..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        {/* <p className="text-white font-semibold text-md font-title  ml-3 mb-4">Swipe left to delete or view the coins.</p> */}
        {isLoading && <Loader />}
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
        {isSuccess && watchlistData?.length !== 0 && (
          <div fullSwipe={false} type={ListType.IOS} className="md:px-4 flex flex-col space-y-1 pb-12 text-white font-text">
            {/* Table Head */}
            <li className="grid grid-cols-3 md:grid-cols-6 text-gray-500 py-3 px-1md:px-5 cursor-pointer bg-[#2A2E36] rounded-md ">
              <div className="flex justify-start items-center space-x-4">
                <p className="text-white pl-4">S.no</p>
              </div>
              <div className="flex justify-start items-center space-x-4">
                <p className="text-white pl-4">Name</p>
              </div>
              <div className="flex items-center ml-auto md:ml-0 ">
                <p className="w-28 md:w-40  text-white">Price</p>
              </div>
              <div className="hidden md:flex items-center ml-auto md:ml-0 ">
                <p className="w-24 md:w-40  text-white">24h Change</p>
              </div>
              <div className="hidden md:flex items-center ml-auto md:ml-0 ">
                <p className="w-24 md:w-40  text-white">Market Cap</p>
              </div>
              <div className="hidden md:flex items-center  md:ml-0 ">
                <p className="w-24 md:w-40  text-white">Action</p>
              </div>
            </li>
            {isSuccess &&
              watchlistData?.length !== 0 &&
              currentItems.map((coin, index) => (
                // <SwipeableListItem trailingActions={trailingActions(coin.id, currentUser.uid, refetch)} key={index}>
                <div className="grid grid-cols-3 md:grid-cols-6 text-gray-500 py-2 px-1md:px-5 hover:bg-gray-900 rounded-lg cursor-pointer xl:w-full">
                  <div className="flex items-center space-x-2 ">
                    <p className="pl-1 text-white">#{index + 1}</p>
                  </div>
                  <div className="flex items-center space-x-2 ">
                    <img className="h-8 w-8 md:h-10 md:w-10 object-contain" src={coin.image.small} alt="cryptocurrency" loading="lazy" />
                    <div>
                      <p className=" w-64 truncate text-white break-words font-semibold">{coin.name}</p>
                      <div className="flex space-x-1">
                        <p>{`${coin.symbol}/USD`.toUpperCase()}</p>
                        {/* <p
                          className={`md:hidden w-24 md:w-40 ${
                            coin?.market_data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                          } font-semibold`}>
                          {coin?.market_data.price_change_percentage_24h >= 0 && '+'}
                          {coin?.market_data.price_change_percentage_24h?.toFixed(2)}%
                        </p> */}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center ml-auto md:ml-0 ">
                    <p className="w-28 md:w-40 text-white font-semibold">
                      ${coin?.market_data.current_price.usd}
                      <br />
                      <span className="md:hidden w-28 md:w-40 text-gray-500">MCap: {normalizeMarketCap(coin?.market_data.market_cap.usd)}</span>
                    </p>
                  </div>
                  <div className="hidden md:flex items-center ">
                    <p
                      className={`w-24 md:w-40 ${
                        coin?.market_data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                      } font-semibold`}>
                      {coin?.market_data.price_change_percentage_24h >= 0 && '+'}
                      {coin?.market_data.price_change_percentage_24h?.toFixed(2)}%
                    </p>
                  </div>
                  <div className="hidden md:flex items-center  ">
                    <p className="w-24 md:w-40  ">${coin?.market_data.market_cap.usd}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <button
                      className="text-white border-2 border-[#2A2E36] rounded-md p-2"
                      onClick={() => navigate(`/papertrade/app/coin/${coin.id}`)}>
                      <IoEyeOutline className="text-[18px]" />
                    </button>
                    <button className="text-white border-2 border-[#2A2E36] rounded-md p-2" onClick={() => handleDelete(coin.id, currentUser.uid)}>
                      <FaRegTrashAlt className="text-[18px]" />
                    </button>
                  </div>
                </div>
                // </SwipeableListItem>
              ))}
          </div>
        )}
        <DynamicPagination totalItems={watchlistData?.length} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
      <div className="flex-[1] m-3 hidden md:block">
        <div className="bg-[#171A24] py-6 px-4 rounded-[12px] mb-4">
          <div className="flex w-full gap-2 pb-4 border-b-2 border-[#2A2E36]">
            <button className="flex-1 bg-[#CFA935] text-white border-2 border-[#CFA935] rounded py-2">Buy</button>
            <button className="flex-1 text-white border-2 rounded border-[#2A2E36] py-2">Sell</button>
          </div>
          <div className="flex justify-between text-white mt-4">
            <div>
              <div className="text-sm text-[#A9A9A9]">1 BTC</div>
              <div className="text-md font-bold">$ 98,661.57</div>
            </div>
            <div>
              <div className="text-sm text-[#A9A9A9]">Available Balance</div>
              <div className="text-md font-bold"> $ 4,100,000</div>
            </div>
          </div>

          <div>
            <div className="relative py-2">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                {/* <img src={data?.image?.small} alt={data.name} className="h-5 w-5" /> */}
              </div>
              <input
                type="number"
                id="coinValue"
                name="coinValue"
                min="0"
                // value={coinValue}
                // onChange={changeCoinValue}
                className=" border   text-sm rounded-lg  block w-full pl-10 p-2.5  bg-[#171A24] border-[#2A2E36] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* <BsArrowLeftRight className="h-4 w-4 text-white m-auto hidden md:block" /> */}

            <BsArrowDownUp className="h-4 w-4 text-white m-auto" />

            {/* usd value */}
            <div className="relative py-2 ">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <img src="" alt="usd price" className="h-5 w-5" />
              </div>
              <input
                type="number"
                min="0"
                id="coinUsdValue"
                name="coinUsdValue"
                // value={coinUsdPrice}
                // onChange={changeUsdValue}
                className=" border   text-sm rounded-lg block w-full pl-10 p-2.5  bg-[#171A24] border-[#2A2E36] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <label className="flex items-center space-x-2 my-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-white appearance-none bg-[#171A24] border-2 border-[#2A2E36] rounded checked:bg-[#CFA935] checked:border-[#CFA935] focus:ring-2 focus:ring-[#2A2E36] cursor-pointer"
              />
              <span className="text-sm text-gray-300">Set Limit</span>
            </label>
          </div>
          <button className="text-white w-full flex justify-center items-center bg-[#CFA935] p-2 rounded mt-4 gap-2 font-bold">
            <FaShoppingCart />
            Buy this crypto
          </button>
        </div>
        <div className="bg-[#171A24] py-6 px-4 rounded-[12px]">
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
    </section>
  );
};

export default Watchlist;
