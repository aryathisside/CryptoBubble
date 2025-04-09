import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { supabase } from '../Utils/init-supabase';
import { BsArrowDownUp } from 'react-icons/bs';
import { FaShoppingCart } from 'react-icons/fa';
import { IoIosArrowRoundForward } from 'react-icons/io';
import MiniWatchlist from '../Components/MiniWatchlist';
import { LuNotebookText } from 'react-icons/lu';
import BuyCoins from '../Components/BuyCoins';
import { useGetCoinsDataQuery } from '../services/coinsDataApi';
import {
  useFetchAvailableCoinsQuery,
  useGetPortfolioCoinDataQuery,
  useGetPortfolioDataQuery,
  useGetUserNetworthQuery
} from '../services/supabaseApi';

import emptyWatchlistLogo from '../Assets/svg/emptyWatchlist.svg';
import priceIcon from '../Assets/svg/price-icon.svg';

import Loader from '../Components/Loader';
import { useAuth } from '../../Context/AuthContext';
import digital from '../Assets/svg/money-logo.svg';
import saving from '../Assets/svg/wallet-logo.svg';
import dollar from '../Assets/svg/dollar-logo.svg';
import profit from '../Assets/svg/profit-loss-logo.svg';

const Portfolio = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [totalreturns, setreturns] = useState(0);
  const [returnsPercent, setreturnsPercent] = useState(0);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [profitLossPercent, setProfitLossPercent] = useState(0);

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
  } = useGetPortfolioCoinDataQuery(currentUser.uid, { pollingInterval: 60000 });

  const {
    data,
    error: MarketFetcherror,
    isLoading: MarketFetchLoading,
    isSuccess: MarketFetchSuccess
  } = useGetCoinsDataQuery({ pollingInterval: 60000 });

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

  async function getTotalInvestment(userId) {
    try {
      const response = await fetch(`${process.env.SIMULATOR_API}/getProfitNLoss/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
        // body: JSON.stringify({
        //   userId: userId
        // })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch trade history.');
      }
      console.log('returnsss', result);
      setTotalInvestment(result?.total_investment);
      setTotalProfitLoss(result?.pnl);
      setProfitLossPercent(result?.percent_change);
      // setTradeHistory(result.history);
      // setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching trade history:', error.message);
      // setTradeError(error.message);
    } finally {
      // setTradeLoading(false);
    }
  }

  useEffect(() => {
    refetchPortfolioData();
    refetchNetworth();
    refetchPortfolioCoinData();
    refetchAvailableCoins();
    getTotalInvestment(currentUser.uid);
  }, []);

  const calculatePnL = () => {
    if (!portfolioData || !portfolioCoinData) {
      console.error('Portfolio data not available yet.');
      return;
    }

    let totalValue = 0;
    let totalPortfolioVal = 0;

    portfolioData.forEach((item) => {
      const coinData = portfolioCoinData.find((coin) => coin.id === item.coinId);
      if (!coinData) return;

      totalValue += item.amount;
      totalPortfolioVal += item.coinAmount * coinData.market_data.current_price.usd;
    });

    const returns = totalPortfolioVal - totalValue;
    const returnsPer = totalValue > 0 ? (returns / totalValue) * 100 : 0;

    setreturns(returns);
    setreturnsPercent(returnsPer);
    console.log(returns, returnsPer);
  };

  useEffect(() => {
    if (isSuccess && fetchPortfolioCoinDataSuccess && portfolioData && portfolioCoinData) {
      calculatePnL();
    }
  }, [portfolioData, portfolioCoinData, isSuccess, fetchPortfolioCoinDataSuccess]); // Add dependencies


  return (
    <section className="lg:px-8 p-3">
      {isLoading || fetchPortfolioCoinDataLoading || fetchAvailableUsdCoinsLoading ? (
        <Loader />
      ) : (
        <div className="md:flex gap-4">
          <div className="w-full lg:w-[70%] flex-shrink-0">
            <div className="bg-[#171A24] py-4 px-3 rounded-[12px] sm:m-0 lg:m-3 w-full">
              <div className="md:flex justify-between items-center pb-4 border-b-2 border-[#2A2E36]">
                <div>
                  <p className="text-white font-bold text-xl font-title mt-2 lg:mt-0 md:px-3">Portfolio</p>
                  <p className="text-[#A9A9A9] text-sm  font-title lg:mt-0 mb-4 md:ml-3">Real time market insights and seamless trading simulation</p>
                </div>
                <button
                  className="flex bg-[#CFA935] text-white font-semibold border-2 border-[#CFA935] rounded p-2 items-center gap-2"
                  onClick={() => navigate('/papertrade/app/tradeHistory')}>
                  <LuNotebookText /> Trade History
                </button>
              </div>

              {error && <p className="text-red-400 text-xl">Something went wrong!</p>}
              {/* available coin and networth */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4  pt-4 px-2">
                <div className="w-full md:flex-1 p-2 bg-[#080808] overflow-hidden shadow rounded-lg">
                  <div className="flex items-center p-2 gap-3">
                    <img src={saving} alt="btc logo" className="h-8 w-8 rounded-lg" />
                    <div className="text-white text-sm">Available Balance</div>
                  </div>
                  <div className="font-text mt-1 text-xl pl-2 leading-9 font-semibold text-white">
                    {' '}
                    ${fetchAvailableUsdCoinsSuccess && availableUsdCoins[0]?.amount.toFixed(5)}
                  </div>
                </div>
                <div className="w-full md:flex-1 p-2 bg-[#080808] overflow-hidden shadow rounded-lg">
                  <div className="flex items-center p-2 gap-3">
                    <img src={digital} alt="btc logo" className="h-8 w-8 rounded-lg" />
                    <div className="text-white text-sm">Total Investment</div>
                  </div>
                  <div className="font-text mt-1 text-xl pl-2 leading-9 font-semibold text-white"> ${totalInvestment.toFixed(2)}</div>
                </div>
                <div className="w-full md:flex-1 p-2 bg-[#080808] overflow-hidden shadow rounded-lg">
                  <div className="flex items-center p-2 gap-3">
                    <img src={dollar} alt="btc logo" className="h-8 w-8 rounded-lg" />
                    <div className="text-white text-sm">Total Return</div>
                  </div>
                  <div className="font-text mt-1 text-xl pl-2 leading-9 font-semibold text-white">
                    {' '}
                    ${totalreturns.toFixed(3)}
                    <p className={` ${returnsPercent >= 0 ? 'text-green-400' : 'text-red-400'} text-[16px] `}>{returnsPercent.toFixed(2)}%</p>
                  </div>
                </div>
                <div className="w-full md:flex-1 p-2 bg-[#080808] overflow-hidden shadow rounded-lg">
                  <div className="flex items-center p-2 gap-3">
                    <img src={profit} alt="btc logo" className="h-8 w-8 rounded-lg" />
                    <div className="text-white text-sm">All time Profit/Loss</div>
                  </div>
                  <div className="font-text mt-1 text-xl pl-2 leading-9 font-semibold text-white">
                    {' '}
                    ${totalProfitLoss.toFixed(2)}
                    <p className={` ${totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'} text-[16px]`}>{profitLossPercent.toFixed(2)}%</p>
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
            <div className="bg-[#171A24] py-4 px-3 rounded-[12px] lg:mx-3 mt-4 w-full">
              <div className="pl-2 text-white font-bold text-lg">Crypto Allocations</div>
              <div className="overflow-x-auto px-1">
                <table className="w-full text-white border-collapse font-light mt-4">
                  <thead className="bg-[#2A2E36]">
                    <tr className="text-[#A9A9A9] text-sm font-light">
                      <th className="p-2 text-left rounded-tl-md rounded-bl-md">Pair/Holdings</th>
                      <th className="hidden md:table-cell p-2 text-left">Price</th>

                      <th className="hidden lg:table-cell p-2  text-center">Holding Assets</th>
                      <th className="hidden md:table-cell p-2 text-center">Total Asset Value</th>
                      <th className="p-2 text-center rounded-tr-md rounded-br-md">Profit/Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isSuccess &&
                      fetchPortfolioCoinDataSuccess &&
                      portfolioData.map((coin, index) => {
                        const coinPercentageChange = percentageChange(coin.coinId, coin.coinAmount, coin.amount);
                        return (
                          <tr
                            key={index}
                            onClick={() => navigate(`/papertrade/app/coin/${coin.coinId}`)}
                            className="hover:bg-[#080808] cursor-pointer">
                            <td className="flex items-center space-x-2 p-3 text-left">
                              <img className="h-7 w-7 md:h-8 md:w-8 object-contain" src={coin.image} alt="crypto" loading="lazy" />
                              <div>
                                <p className="text-white font-semibold truncate text-sm">
                                  {coin.coinName}{' '}
                                  <span className="text-[#CFA935] text-[8px] bg-[#00000033] p-1.5"> {coin.coinSymbol.toUpperCase()}</span>
                                </p>
                                {/* <p className=' text-sm'>{`$/USD`}</p> */}
                              </div>
                            </td>
                            <td className="hidden md:table-cell p-2 text-center">
                              <p className="flex items-center text-sm">
                                ${portfolioCoinData.find((item) => item.id === coin.coinId)?.market_data?.current_price?.usd ?? 'N/A'}
                                <img src={priceIcon} alt="price" className="w-4 h-4 ml-1" />
                              </p>
                            </td>

                            <td className="hidden lg:table-cell py-2 px-4 text-center">
                              {coin.coinAmount ? (
                                <>
                                  <span className="font-semibold">
                                    {coin.coinAmount} {coin.coinSymbol.toUpperCase()}
                                  </span>
                                  <br />
                                </>
                              ) : (
                                <span className="font-semibold">${coin.amount}</span>
                              )}
                            </td>
                            <td className="hidden md:table-cell py-2 px-4 text-center">
                              <span className="">${coin.amount}</span>
                            </td>

                            <td className="py-2 px-4 text-center">
                              <p className="flex items-center justify-center text-sm block md:hidden">
                                ${coin?.amount}
                                <img src={priceIcon} alt="price" className="w-4 h-4 ml-1" />
                              </p>
                              {coinPercentageChange && (
                                <p className={`font-semibold ${coinPercentageChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {coinPercentageChange >= 0 && '+'}
                                  {coinPercentageChange.toFixed(2)}%
                                </p>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {portfolioData && portfolioData.length === 0 && (
                  <div className="rounded-2xl px-4 py-4 md:px-4 flex flex-col justify-center items-center text-center max-w-xl m-auto">
                    <img src={emptyWatchlistLogo} alt="empty watchlist" />
                    <p className="text-white text-xl font-bold my-2">Your portfolio is empty</p>
                    <p className="text-gray-300 mb-5">Press the button to browse all the coins</p>
                    <Link
                      to="/papertrade/app/market"
                      className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                      View Coins
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-[30%] m-3 hidden lg:block">
            {MarketFetchSuccess && <BuyCoins data={data} />}
            <MiniWatchlist />
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
