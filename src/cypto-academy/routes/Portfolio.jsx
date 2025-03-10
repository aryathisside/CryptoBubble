import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { supabase } from '../Utils/init-supabase';
import { BsArrowDownUp } from 'react-icons/bs';
import { FaShoppingCart } from 'react-icons/fa';
import { IoIosArrowRoundForward } from 'react-icons/io';
import MiniWatchlist from '../Components/MiniWatchlist';
import { LuNotebookText } from 'react-icons/lu';

import {
  useFetchAvailableCoinsQuery,
  useGetPortfolioCoinDataQuery,
  useGetPortfolioDataQuery,
  useGetUserNetworthQuery
} from '../services/supabaseApi';

import emptyWatchlistLogo from '../Assets/svg/emptyWatchlist.svg';

import Loader from '../Components/Loader';
import { useAuth } from '../../Context/AuthContext';
import digital from '../Assets/svg/digital-economy-logo.svg';
import saving from '../Assets/svg/saving.svg';

const Portfolio = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const {
    data: portfolioData,
    error,
    isLoading,
    // isFetching,
    isSuccess,
    refetch: refetchPortfolioData
  } = useGetPortfolioDataQuery(currentUser.uid);

  const {
    data: portfolioCoinData,
    // error: fetchPortfolioCoinDataError,
    isLoading: fetchPortfolioCoinDataLoading,
    isSuccess: fetchPortfolioCoinDataSuccess,
    refetch: refetchPortfolioCoinData
  } = useGetPortfolioCoinDataQuery(currentUser.uid, { pollingInterval: 20000 });

  //   async function getUserTradeHistory(userId) {
  //     try {
  //         const { data, error } = await supabase
  //             .from("users")
  //             .select("history")
  //             .eq("userId", userId)

  //         if (error) {
  //             throw new Error(error.message);
  //         }
  //         console.log(data[0]);
  //         return data; // Returns the trade history array
  //     } catch (error) {
  //         console.error("Error fetching trade history:", error.message);
  //         return [];
  //     }
  // }



  // get available coins
  const {
    data: availableUsdCoins,
    isSuccess: fetchAvailableUsdCoinsSuccess,
    // error: fetchAvailableUsdCoinsError,
    isLoading: fetchAvailableUsdCoinsLoading,
    refetch: refetchAvailableCoins
  } = useFetchAvailableCoinsQuery(currentUser.uid);

  // get coin percentage change
  function percentageChange(coinId, coinAmount, amount) {
    const coinData = portfolioCoinData.filter((coin) => coin.id === coinId);

    if (coinData.length !== 0) {
      const currentCoinPrice = coinData[0]?.market_data.current_price.usd;
      const oneCoinAmount = amount / coinAmount;
      const coinPercentageChange = ((currentCoinPrice - oneCoinAmount) / currentCoinPrice) * 100;

      return coinPercentageChange;
    }
    return;
  }

  // Get user networth
  const {
    data: userNetworth,
    isSuccess: userNetworthSuccess,
    // error: networthError,
    refetch: refetchNetworth
  } = useGetUserNetworthQuery(currentUser.uid);

  useEffect(() => {
    refetchPortfolioData();
    refetchNetworth();
    refetchPortfolioCoinData();
    refetchAvailableCoins();
  }, []);

  return (
    <section className="lg:px-8 p-3">
      <div className="flex gap-4">
        <div className="md:w-[1050px] flex-shrink-0">
          <div className="bg-[#171A24] py-4 px-3 rounded-[12px] m-3 w-full">
            <div className="md:flex justify-between items-center pb-4 border-b-2 border-[#2A2E36]">
              <div>
                <p className="text-white font-bold text-xl font-title mt-2 lg:mt-0 md:px-3">Portfolio</p>
                <p className="text-[#A9A9A9] text-sm font-title lg:mt-0 md:ml-3 ">Real time market insights and seamless trading simulation</p>
              </div>
              <button className="flex bg-[#CFA935] text-white font-semibold border-2 border-[#CFA935] rounded p-2 items-center gap-2"
             onClick={() => navigate('/papertrade/app/tradeHistory')}>
                <LuNotebookText /> Trade History
              </button>
            </div>
            {(isLoading || fetchPortfolioCoinDataLoading || fetchAvailableUsdCoinsLoading) && <Loader />}
            {error && <p className="text-red-400 text-xl">Something went wrong!</p>}
            {/* available coin and networth */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4  pt-4 px-2">
              <div className="w-full md:flex-1 p-2 bg-[#080808] overflow-hidden shadow rounded-lg">
                <div className="flex items-center p-2 gap-3">
                  <img src={saving} alt="btc logo" className="h-8 w-8 rounded-full" />
                  <div className="text-white">Available Balance</div>
                </div>
                <div className="font-text mt-1 text-xl pl-2 leading-9 font-semibold text-white">
                  {' '}
                  ${userNetworthSuccess && userNetworth[0]?.networth}
                </div>
              </div>
              <div className="w-full md:flex-1 p-2 bg-[#080808] overflow-hidden shadow rounded-lg">
                <div className="flex items-center p-2 gap-3">
                  <img src={digital} alt="btc logo" className="h-8 w-8 rounded-full" />
                  <div className="text-white">Virtual USD</div>
                </div>
                <div className="font-text mt-1 text-xl pl-2 leading-9 font-semibold text-white">
                  {' '}
                  ${fetchAvailableUsdCoinsSuccess && availableUsdCoins[0]?.amount}
                </div>
              </div>
              {/* <div className="w-full flex-1">
              <div className="  bg-gradient-to-tr from-gray-900 to-gray-700   overflow-hidden shadow rounded-lg w-full relative sm:mx-3 mt-1 ">
                <img src={digital} alt="btc logo" className="h-12 w-8 rounded-full absolute opacity-100 top-3 right-6" />
                <div className="px-4 md:py-5 py-2 sm:p-6">
                  <dl>
                    <dt className="font-title text-sm leading-5 font-medium text-gray-400 truncate">Virtual USD</dt>
                    <div className="font-text mt-1 text-md md:text-3xl leading-9 font-semibold pt-2 text-white">
                      ${fetchAvailableUsdCoinsSuccess && availableUsdCoins[0]?.amount}
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="w-full flex-1">
              <div className="  bg-gradient-to-tr from-gray-900 to-gray-700   overflow-hidden shadow rounded-lg w-full relative sm:mx-3 mt-1 ">
                <img src={saving} alt="btc logo" className="h-12 w-8 rounded-full absolute opacity-100 top-3 right-6" />
                <div className="px-4 py-2 md:py-5 sm:p-6">
                  <dl>
                    <dt className="font-title text-sm leading-5 font-medium text-gray-400 truncate">Networth</dt>
                    <dd className="mt-1 font-text text-md md:text-3xl leading-9 font-semibold text-white pt-2">
                      ${userNetworthSuccess && userNetworth[0]?.networth}
                    </dd>
                  </dl>
                </div>
              </div>
            </div> */}
            </div>
          </div>

          {/* portfolio Table */}
          <div className="bg-[#171A24] py-4 px-3 rounded-[12px] m-3 w-full">
            <ul className="md:px-4 font-text flex flex-col space-y-1 pb-12 pt-4 text-white">
              {/* Table Head */}
              <li className="grid grid-cols-4 text-gray-500 py-2 px-1md:px-5 cursor-pointer bg-[#2A2E36] py-2 rounded-md">
                <div className="flex justify-start items-center space-x-4">
                  <p className="text-white pl-4">S.no</p>
                </div>
                <div className="flex justify-start items-center space-x-4">
                  <p className="text-white pl-4">Name</p>
                </div>

                <div className="flex justify-center md:justify-start items-center space-x-4">
                  <p className="text-white ">% Change</p>
                </div>

                <div className="flex items-center justify-start  ml-auto md:ml-0 ">
                  <p className="w-28 md:w-40  text-white text-left px-3">Holdings</p>
                </div>
              </li>
              {isSuccess &&
                fetchPortfolioCoinDataSuccess &&
                portfolioData.map((coin, index) => {
                  const coinPercentageChange = percentageChange(coin.coinId, coin.coinAmount, coin.amount);
                  return (
                    <li
                      key={index}
                      onClick={() => navigate(`/papertrade/app/coin/${coin.coinId}`)}
                      className="grid grid-cols-4 text-gray-500 py-2 px-1md:px-5 hover:bg-gray-900 cursor-pointer border-gray-800 ">
                      <div className="flex justify-start items-center space-x-4">
                        <p className="pl-1">{index + 1}</p>
                      </div>
                      <div className="flex justify-start items-center md:space-x-4">
                        <img className="h-8 w-8 md:h-10 md:w-10 object-contain" src={coin.image} alt="cryptocurrency" loading="lazy" />
                        <div>
                          <p className=" w-24 md:w-64 text-white break-words">{coin.coinName}</p>
                          <div className="flex space-x-1">
                            <p>{`${coin.coinSymbol}/usd`.toUpperCase()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center md:justify-start items-center space-x-4">
                        {coinPercentageChange && (
                          <p className={`text-center  ${coinPercentageChange >= 0 ? 'text-green-400' : 'text-red-400'} font-semibold`}>
                            {coinPercentageChange >= 0 && '+'}
                            {coinPercentageChange.toFixed(2)}%
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-start ml-auto md:ml-0 ">
                        <p className="w-28 md:w-40 text-white font-semibold text-left break-words">
                          {coin.coinAmount ? coin.coinAmount : <span>${coin.amount}</span>} {coin.coinAmount && coin.coinSymbol.toUpperCase()}
                          <br />
                          <span className="w-28 md:w-40 text-gray-500 text-left ">{coin.coinAmount && <span>${coin.amount}</span>}</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
              {portfolioData && portfolioData.length === 0 && (
                <div className=" rounded-2xl  px-4 py-4 md:px-4 flex flex-col lg:justify-center align-center text-center max-w-xl m-auto">
                  <img src={emptyWatchlistLogo} alt="empty watchlist" />
                  <p className="text-white text-xl font-bold my-2 lg:text-center">Your portfolio is empty</p>
                  <p className="text-gray-300 lg:text-center mb-5">Press the button to browse all the coins</p>
                  <Link
                    to="/papertrade/app/market"
                    className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                    View Coins
                  </Link>
                </div>
              )}
            </ul>
          </div>
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
          <MiniWatchlist />
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
