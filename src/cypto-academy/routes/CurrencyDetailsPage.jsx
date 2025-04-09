import { lazy, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { supabase } from '../Utils/init-supabase';

import { useGetCoinDataQuery, useGetHistoricalDataQuery } from '../services/coinsDataApi';

import { HistoricalChart, HistoricalLineChart } from '../Components/CoinChart';
import ErrorToast from '../Components/ErrorToast';
import Loader from '../Components/Loader';
import { useAuth } from '../../Context/AuthContext';
import { IoEyeOutline } from 'react-icons/io5';
import { FaCartShopping } from 'react-icons/fa6';
import { LiaCoinsSolid } from 'react-icons/lia';
import graph from '../Assets/svg/graph.svg';
import product from '../Assets/svg/product-logo.svg';
import dollor from '../Assets/svg/dollar-graph-logo.svg';
import highGraph from '../Assets/svg/graph-high-logo.svg';
import lowGraph from '../Assets/svg/graph-low-logo.svg';
import { useGetWatchlistDataQuery } from '../services/supabaseApi';
import MiniWatchlist from '../Components/MiniWatchlist';
import { BsArrowDownUp } from 'react-icons/bs';
import { FaShoppingCart } from 'react-icons/fa';
import CoinDetail from '../Components/CoinDetail';
import BuySingleCoin from './BuySingleCoin';
import { toast } from 'react-toastify';

// import BuyCoins from "../Components/BuyCoins";
// import SellCoins from "../Components/SellCoins";
// import CoinStats from "../Components/CoinStats";
const BuyCoins = lazy(() => import('../Components/BuyCoins'));
const SellCoins = lazy(() => import('../Components/SellCoins'));
const CoinStats = lazy(() => import('../Components/CoinStats'));
const BuySingleCoinModal = lazy(()=> import('../Components/BuySingleCoinModal'))

const CurrencyDetailsPage = () => {
  const { id } = useParams();
  const toastRef = useRef(null);
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const [addToGun, setAddToGun] = useState(false);
  const [chartDays, setChartDays] = useState('365');
  const [candleStickChart, setCandleStickChart] = useState(true);

  const [gunError, setGunError] = useState(false);
  const [gunErrorMessage, setGunErrorMessage] = useState('');

  const [toggleBuyCoinsModal, setToggleBuyCoinsModal] = useState(false);
  const [toggleSellCoinsModal, setToggleSellCoinsModal] = useState(false);

  const { data, error, isLoading, isSuccess } = useGetCoinDataQuery(id, { pollingInterval: 60000 });

  const {
    data: chartData,
    error: fetchChartDataError,
    isLoading: isChartLoading,
    isSuccess: chartDataSuccess
  } = useGetHistoricalDataQuery({
    id,
    chartDays
  });

  const { refetch } = useGetWatchlistDataQuery(currentUser.uid);

  useEffect(() => {
    if (error || fetchChartDataError) {
      toastRef.current?.show();
    }
  }, [error, fetchChartDataError]);

  async function watchlistHandler(e) {
    e.preventDefault();
    setGunError(false);
    setGunErrorMessage('');

    setAddToGun(true);
    let { data: watchlist, error } = await supabase
      .from('watchlist')
      .select('coinId,userId')
      .eq('userId', `${currentUser.uid}`)
      .eq('coinId', `${data.id}`);

    if (watchlist.length === 0) {
      const { data: updateWatchlistData, error } = await supabase.from('watchlist').upsert([{ coinId: data.id, userId: currentUser.uid }]);

      console.log('added to db/watchlist successfully');
      refetch();
      navigate('/papertrade/app/watchlist');
      setAddToGun(false);
    } else {
      // setGunErrorMessage('already added to watchlist');
      toast.success("Already added to watchlist", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setGunError(true);
      setTimeout(() => {
        setGunError(false);
      }, 1500);
      setAddToGun(false);
      return;
    }
    // if(watchlist.includes(data.id)){
    //   setGunErrorMessage('already added to watchlist')
    //   setGunError(true)
    //   setTimeout(() => {
    //     setGunError(false)
    //   }, 1500);
    //   return
    // }
  }

  useEffect(() => {}, []);

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

  useEffect(() => {
    if (error) {
      toast.error("Something Went Wrong!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  }, [error]);

  return (
    <section className="lg:px-8 p-3">
       {(isLoading || isChartLoading) ? <Loader />:
      <div className="lg:flex">
        {isSuccess && <BuySingleCoinModal data={data} modal={toggleBuyCoinsModal} setModal={setToggleBuyCoinsModal} />}
        {/* {isSuccess && <SellCoins data={data} modal={toggleSellCoinsModal} setModal={setToggleSellCoinsModal} />} */}
        {/* prettier-ignore */}
       

        {/* {error && <ErrorToast message="Something Went Wrong!" ref={toastRef} />} */}

        {/* {gunError && (
          <p
            className="absolute left-1/2 -translate-x-1/2 top-5 p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800  font-semibold"
            role="alert">
            {gunErrorMessage ? gunErrorMessage : 'Something went wrong!'}
          </p>
        )} */}
        <div className="w-full lg:w-[70%] bg-[#171A24] pt-3 sm:pt-0  px-4 rounded-[12px] md:m-3">
          {isSuccess && (
            <div className="mt-6">
              {/* back button */}
              <Link
                to="/papertrade/app/market"
                className="md:hidden border-2 border-white w-10 h-10 rounded-full flex justify-center items-center mb-2 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6  text-white "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div className="flex justify-between">
                <p className="text-white font-bold text-xl font-title lg:mt-0 mb-2">Market Stats</p>
                <div>
                  <button
                    type="button"
                    onClick={watchlistHandler}
                    className="text-white hover:bg-[#2A2E36] focus:ring-4 focus:ring-blue-800 font-medium rounded-lg md:px-5 px-3 py-2 text-center mb-2 border-2 border-[#2A2E36]">
                    {addToGun ? (
                      <div>
                        <svg
                          role="status"
                          className="inline mr-3 w-4 h-4 text-white animate-spin"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                          />
                        </svg>
                        {/* <span>Adding to Watchlist...</span> */}
                      </div>
                    ) : (
                      <span className="md:flex md:items-center md:gap-2">
                        <IoEyeOutline />
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    className=" lg:hidden text-white bg-[#CFA935] font-medium rounded-lg px-3 py-2 text-center ml-2 mb-2"
                    onClick={() => setToggleBuyCoinsModal(true)}
                  >
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
              <div className="md:flex  md:space-x-8 justify-between pb-6 gap-8">
                {/* coin data */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <img src={data?.image?.large} className="w-10" alt={data?.name} />
                    <div>
                      <p className="text-white font-title md:text-md font-bold">{data?.name}</p>
                      <p className="text-gray-300 md:text-md text-sm  font-semibold">Rank #{data?.market_data?.market_cap_rank}</p>
                    </div>
                  </div>
                  <p className="text-[#A9A9A9] text-sm mt-2">
                    The live {data.name} price today is ${data.market_data.current_price.usd} USD. We update our{' '}
                    <span className="uppercase">{data.symbol}</span> to USD price in real-time. {data.name} is
                    <span className={`font-bold  ${data?.market_data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'} px-1`}>
                      {data?.market_data.price_change_percentage_24h >= 0 && '+'}
                      {data.market_data.price_change_percentage_24h.toFixed(3)}%
                    </span>
                    in the last 24 hours.
                  </p>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-4">
                    <div className="text-white font-semibold">$ {data?.market_data?.current_price?.usd}</div>
                    <div className="text-[#A9A9A9] text-sm">{data?.name} Price (USD)</div>
                  </div>
                  <div className="text-[#A9A9A9] text-sm border-b-4 border-[#CFA935] pb-3 flex gap-2 items-center">
                    <BsArrowDownUp /> All Time High/Low Price
                  </div>
                  <div className="flex justify-between text-white mt-2">
                    <div>
                      <span className="text-[#A9A9A9] text-sm">Low:</span> $216.57
                    </div>
                    <div>
                      <span className="text-[#A9A9A9] text-sm">High:</span> ${data.market_data.ath.usd}
                    </div>
                  </div>
                </div>
                {/* <div className="mt-4 mx-2 md:mx-4 flex space-x-2 md:gap-4 gap-2">
              <button
                type="button"
                onClick={watchlistHandler}
                className="text-white hover:bg-[#2A2E36] focus:ring-4 focus:ring-blue-800 font-medium rounded-lg md:px-5 px-3 py-2 text-center mb-2 border-2 border-[#2A2E36]">
                {addToGun ? (
                  <div>
                    <svg
                      role="status"
                      className="inline mr-3 w-4 h-4 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Adding to Watchlist...</span>
                  </div>
                ) : (
                  <span className="md:flex md:items-center md:gap-2">
                    <IoEyeOutline /> <span className="md:block hidden"> Watchlist</span>
                  </span>
                )}
              </button>

              <button
                type="button"
                className="text-white flex items-center gap-2 bg-[#CFA935] hover:bg-[#CFA935] focus:ring-4 focus:ring-blue-800 font-medium rounded-lg md:px-5 px-3 py-2 text-center mb-2 border-2 border-[#CFA935]"
                onClick={() => setToggleBuyCoinsModal(true)}>
                <FaCartShopping />
                <span className="md:block hidden"> Buy</span>
              </button>

              <button
                type="button"
                className="text-[#CFA935] flex items-center gap-2 hover:bg-[#CFA935] hover:text-white focus:ring-4 focus:ring-blue-800 font-medium rounded-lg md:px-5 px-3 py-2 text-center mb-2 border-2 border-[#CFA935]"
                onClick={() => setToggleSellCoinsModal(true)}>
                <LiaCoinsSolid className="text-[18px]" />
                <span className="md:block hidden"> Sell</span>
              </button>
            </div> */}
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="no-scrollbar flex flex-wrap md:gap-8 gap-3 justify-between rounded-box w-screen w-full overflow-auto max-w-full pt-8">
              <div className="w-[47%] md:flex-1 p-2 bg-[#080808] overflow-hidden shadow rounded-lg">
                <div className="flex items-center p-2 gap-3">
                  <img src={dollor} alt="btc logo" className="h-8 w-8 rounded-lg" />
                  <div className="text-white">Market Cap</div>
                </div>
                <div className="font-text mt-1 text-xl pl-2 leading-9 font-semibold text-white">${data?.market_data?.market_cap?.usd}</div>
              </div>
              <div className="md:w-full md:flex-1 w-[47%] p-2  bg-[#080808]  overflow-hidden shadow rounded-lg">
                <div className="flex items-center p-2 gap-3">
                  <img src={product} alt="btc logo" className="h-8 w-8 rounded-lg" />
                  <div className="text-white">Volume</div>
                </div>
                <div className="font-text mt-1 text-xl pl-2 leading-9 font-semibold text-white">
                  {' '}
                  {normalizeMarketCap(data.market_data.total_volume.usd)}
                </div>
              </div>
              <div className="md:w-full md:flex-1 w-[47%] p-2  bg-[#080808]  overflow-hidden shadow rounded-lg">
                <div className="flex items-center p-2 gap-3">
                  <img src={highGraph} alt="btc logo" className="h-8 w-8 rounded-lg" />
                  <div className="text-white">24h High</div>
                </div>
                <div className="font-text mt-1 text-xl pl-2 leading-9 font-semibold text-white">
                  {' '}
                  {data.market_data.high_24h?.usd}
                </div>
              </div>
              <div className="md:w-full md:flex-1 w-[47%] p-2  bg-[#080808]  overflow-hidden shadow rounded-lg">
                <div className="flex items-center p-2 gap-3">
                  <img src={lowGraph} alt="btc logo" className="h-8 w-8 rounded-lg" />
                  <div className="text-white">24 Low</div>
                </div>
                <div className="font-text mt-1 text-xl pl-2 leading-9 font-semibold text-white">
                {data.market_data.low_24h?.usd}
                </div>
              </div>
              {/* <div className="md:w-full md:flex-1 w-[47%]">
              <div className="bg-gradient-to-tr from-gray-900 to-gray-700 overflow-hidden shadow rounded-lg relative">
                <img src={graph} alt="btc logo" className="h-12 w-8 rounded-full absolute opacity-100 top-3 md:right-6 right-3" />
                <div className="px-4 py-5">
                  <dl>
                    <dt className="font-title text-sm leading-5 font-medium text-gray-400 truncate"></dt>

                    <dd
                      className={`font-text mt-1 leading-9 font-semibold pt-2 text-left text-xl md:text-3xl font-bold ${
                        data?.market_data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                      } `}>
                      {data?.market_data.price_change_percentage_24h >= 0 && '+'}
                      {data.market_data.price_change_percentage_24h.toFixed(3)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="md:w-full md:flex-1 w-[47%]">
              <div className="bg-gradient-to-tr from-gray-900 to-gray-700 overflow-hidden shadow rounded-lg relative">
                <img src={product} alt="btc logo" className="h-12 w-8 rounded-full absolute opacity-100 top-3 md:right-6 right-3" />
                <div className="px-4 py-5">
                  <dl>
                    <dt className="font-title text-sm leading-5 font-medium text-gray-400 truncate">Volume</dt>
                    <dd className="font-text mt-1 text-xl md:text-3xl leading-9 font-semibold text-white pt-2">
                      {normalizeMarketCap(data.market_data.total_volume.usd)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div> */}
            </div>
          )}
          {/* 
      <div className="mt-4 mx-2 md:mx-4 flex space-x-2">
        <button
          type="button"
          onClick={watchlistHandler}
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-800 font-medium rounded-lg px-5 py-2 text-center mr-2 mb-2 text-"
        >
          {addToGun ? (
            <div>
              <svg
                role="status"
                className="inline mr-3 w-4 h-4 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              <span>Adding to Watchlist...</span>
            </div>
          ) : (
            <span>Watchlist</span>
          )}
        </button>

        <button
          type="button"
          className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-green-800 font-medium rounded-lg px-8 py-2 text-center mr-2 mb-2 text-"
          onClick={() => setToggleBuyCoinsModal(true)}
        >
          Buy
        </button>

        <button
          type="button"
          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-red-800 font-medium rounded-lg px-8 py-2  text-center mr-2 mb-2 text-"
          onClick={() => setToggleSellCoinsModal(true)}
        >
          Sell
        </button>
      </div> */}
          <div className="p-2 md:p-4 border-2 border-[#2A2E36] rounded-xl mt-6">
            <div className="md:flex items-center justify-between">
              {isSuccess && (
                <p className="text-white font-semibold text-sm md:text-xl font-title my-4 ml-2 md:ml-4">
                  {data.name} to <span className="uppercase">USD</span>{' '}Chart
                </p>
              )}

              <div className="mb-6 ml-2 md:ml-4 inline-flex  rounded-md shadow-sm" role="group">
                <button
                  onClick={() => setChartDays(() => '1')}
                  type="button"
                  className="py-2 px-1 md:px-4 font-text text-xs md:text-sm font-semibold  rounded-l-lg border  focus:z-10 focus:ring-2  bg-gray-900 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
                  24 Hours
                </button>
                <button
                  onClick={() => setChartDays(() => '30')}
                  type="button"
                  className="py-2 px-1 md:px-4 font-text text-xs md:text-sm font-semibold  border  focus:z-10 focus:ring-2  bg-gray-900 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
                  30 Days
                </button>
                <button
                  onClick={() => setChartDays(() => '90')}
                  type="button"
                  className="py-2 px-1 md:px-4 font-text text-xs md:text-sm font-semibold   border  focus:z-10 focus:ring-2  bg-gray-900 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
                  3 Months
                </button>
                <button
                  onClick={() => setChartDays(() => '365')}
                  type="button"
                  className="py-2 px-1 md:px-4 font-text text-xs md:text-sm font-semibold   border  focus:z-10 focus:ring-2  bg-gray-900 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
                  1 Year
                </button>
                <button
                  onClick={() => setCandleStickChart(!candleStickChart)}
                  type="button"
                  className="py-2 px-1 md:px-4 font-text text-xs md:text-sm font-semibold  rounded-r-md border  focus:z-10 focus:ring-2  bg-gray-900 border-gray-600 text-white hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white">
                  {candleStickChart ? (
                    <img
                      src="https://img.icons8.com/color-glass/96/000000/area-chart.png"
                      className="inline-block w-5 h-5 "
                      alt="line chart button"
                    />
                  ) : (
                    <img
                      src="https://img.icons8.com/color/48/000000/candle-sticks.png"
                      className="inline-block w-5 h-5 "
                      alt="candlestick chart button"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* <HistoricalChart id={id} /> */}
            {/* prettier-ignore */}
            <div className="flex flex-col w-full">
 


            {isSuccess && chartDataSuccess && candleStickChart && <HistoricalChart id={id} data={chartData} days={chartDays} />}
            </div>
            {/* prettier-ignore */}
            {isSuccess && chartDataSuccess && !candleStickChart && <HistoricalLineChart id={id} data={chartData} days={chartDays} name={data.name} />}

            {/* {isSuccess && <CoinStats data={data} />} */}
          </div>
        </div>
        <div className="w-[30%] m-3 hidden lg:block">
          {isSuccess && <BuySingleCoin data={data} />}
          <MiniWatchlist />
        </div>
      </div>}
      {isSuccess && <CoinDetail data={data} coinDetail={data?.symbol} />}
    </section>
  );
};

export default CurrencyDetailsPage;
