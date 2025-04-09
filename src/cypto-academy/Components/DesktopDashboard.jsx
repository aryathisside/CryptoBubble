import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useGetTrendingCoinDataQuery } from '../services/coinsDataApi';
// import { useGetNewsQuery } from "../services/NewsApi";
import { useFetchAvailableCoinsQuery, useGetLeaderboardQuery, useGetUserNetworthQuery, useGetWatchlistDataQuery } from '../services/supabaseApi';

import Loader from './Loader';
import { supabase } from '../Utils/init-supabase';
import { useAuth } from '../../Context/AuthContext';
import { CiEdit } from "react-icons/ci";
import { LiaCoinsSolid } from "react-icons/lia";
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoEyeOutline } from "react-icons/io5";

const DesktopDashboard = ({ userNetworth: networth, availableCoins }) => {
  const { currentUser } = useAuth();

  // fetch trending coin data
  const {
    data: trendingCoins,
    // error,
    isLoading,
    // isFetching,
    isSuccess
    // refetch
  } = useGetTrendingCoinDataQuery();

  // fetch watchlist coin data
  const {
    data: watchlistData,
    error: fetchWatchlistErr,
    isLoading: fetchWatchlistLoading,
    isSuccess: fetchWatchlistSuccess,
    refetch: refetchWatchList
  } = useGetWatchlistDataQuery(currentUser.uid);

  // Get user networth
  const {
    data: userNetworth,
    isSuccess: userNetworthSuccess,
    isLoading: userNetworthLoading,
    refetch: refetchUserNetworth
    // error: networthError
  } = useGetUserNetworthQuery(currentUser.uid);

  // // get news
  // const {
  //   data: news,
  //   isSuccess: fetchNewsSuccess,
  //   // error: fetchNewsError,
  //   isLoading: fetchNewsLoading
  // } = useGetNewsQuery();

  // get available coins
  const {
    data: availableUsdCoins,
    isSuccess: fetchAvailableUsdCoinsSuccess,
    // error: fetchAvailableUsdCoinsError,
    isLoading: fetchAvailableUsdCoinsLoading,
    refetch: refetchAvailableCoins
  } = useFetchAvailableCoinsQuery(currentUser.uid);

  // get Leaderboard data
  const {
    data: leaderboard,
    isLoading: leaderboardIsLoading,
    isSuccess: fetchLeaderboardSuccess,
    error: fetchLeaderboardError
  } = useGetLeaderboardQuery();

  async function handleDelete(coinId, userId) {
    try {
      const {
        // data,
        error
      } = await supabase.from('watchlist').delete().eq('coinId', `${coinId}`).eq('userId', `${userId}`);
      if (error) {
        throw new Error(error);
      }else{
        refetchWatchList();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const demoImage = 'https://source.unsplash.com/fsSGgTBoX9Y';

  const location = useLocation();
  const navigate = useNavigate();

  console.log("data", watchlistData);

  const AddInitialBalance = async () => {
    try {
      // Check if the user exists in Supabase
      const { data: existingUser, error: fetchError } = await supabase.from('users').select('*').eq('userId', currentUser.uid);

      if (fetchError) {
        console.error('Error fetching user data:', fetchError);
        throw new Error('Failed to fetch user data.');
      }

      if (!existingUser || existingUser.length === 0) {
        // Add new user to the database
        const { data: networth, error: userError } = await supabase.from('users').insert([
          {
            userId: currentUser.uid,
            username: currentUser.displayName || 'User', // Replace with proper username
            email: currentUser.email
          }
        ]);

        if (userError) {
          console.error('Error inserting user data:', userError);
          throw new Error('Failed to add user data.');
        }

        // Add initial coins
        const { data: userCoin, error: coinError } = await supabase.from('portfolio').insert([
          {
            userId: currentUser.uid,
            coinId: 'USD',
            coinName: 'Virtual USD',
            image: 'https://img.icons8.com/fluency/96/000000/us-dollar-circled.png',
            amount: 100000,
            coinSymbol: 'vusd'
          }
        ]);

        if (coinError) {
          console.error('Error adding coins:', coinError);
          throw new Error('Failed to add initial coins.');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await AddInitialBalance();
      refetchAvailableCoins();
      refetchUserNetworth();
    };
    fetchData();
  }, [location?.state]);

  console.log("Trending coins", trendingCoins);

  return (
    <>
      {/* loading State */}
      {(isLoading ||
        fetchWatchlistLoading ||
        // fetchNewsLoading ||
        fetchAvailableUsdCoinsLoading ||
        leaderboardIsLoading ||
        userNetworthLoading) && <Loader />}
      {/* credit card */}
      <div className="w-full  rounded-2xl crypto-bg">
        <div className="p-4 sm:p-6 w-full">
          <p className="text-[#CFA935] text-md sm:text-[24px]">Welcome,</p>
          <p className="text-white font-bold text-xl sm:text-2xl md:text-3xl font-title pt-2 sm:pt-6 md:pt-3 mb-4">{currentUser.displayName}</p>
          <div className="flex flex-wrap  gap-4 sm:gap-6 sm:pt-2">
            <div className="bg-[black] w-full sm:w-[300px] p-4 rounded-md sm:rounded-xl">
              <p className="text-[#A9A9A9]">Account Balance</p>
              <div className="font-text mt-1 text-2xl sm:text-3xl leading-7 sm:leading-9 font-semibold text-white">
                ${fetchAvailableUsdCoinsSuccess && availableUsdCoins[0]?.amount.toFixed(5)}
              </div>
            </div>
            <div className="bg-[black] w-full sm:w-[300px] p-4 rounded-md sm:rounded-xl">
              <p className="text-[#A9A9A9]">Networth</p>
              <div className="font-text mt-1 text-2xl sm:text-3xl leading-7 sm:leading-9 font-semibold text-white">
                {userNetworthSuccess && <span>${userNetworth[0]?.networth.toFixed(5)}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-2  mt-8">
        <div className=" shadow-lg rounded-2xl bg-black w-full">
          {/* <p className="font-tile text-white font-bold text-2xl md:text-3xl font-title my-4">Trending Coins</p> */}

          {isSuccess && (
            <div className="bg-[#000000] rounded-xl w-full">
              {/* Table Header */}
              <div className="bg-[#171A24] px-6 py-3 rounded-t-xl border-t-2 border-x-2 border-[#2A2E36]">
                <h2 className="text-white font-semibold text-md sm:text-[24px]">Trending Coins</h2>
              </div>

              {/* Table */}
              <div className="w-full">
                <table className="w-full border-2 border-[#2A2E36]">
                  {/* Table Head */}
                  <thead>
                    <tr className="text-left text-white text-sm bg-[#171A24]">
                      <th className="pl-6 py-3 font-semibold">S.No.</th>
                      <th className="pl-6 py-3 font-semibold">Name</th>
                      <th className="pl-6 py-3 font-semibold">Price</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {trendingCoins.coins.slice(0,10).map((coin, index) => (
                      <tr key={index} className=" hover:bg-[#1A1D25] transition">
                        {/* S.No */}
                        <td className="pl-6 py-4 text-white font-medium">#{index + 1}</td>

                        {/* Coin Name */}
                        <td className="pl-6 py-4 flex items-center space-x-3">
                          <img src={coin.item.large} alt={`${coin.item.name}`} className="w-8 h-8 rounded-md" />
                          <div>
                            <p className="text-white font-semibold text-sm">{coin.item.name}</p>
                            <p className="text-gray-400 text-sm">{coin.item.symbol}/USD</p>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="pl-6 py-4 text-white font-medium text-sm">${coin.item?.data?.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        {/* watchlist data */}
        <div className="shadow-lg rounded-2xl bg-black w-full">
  {/* Watchlist Header */}
  <div className="bg-[#171A24] px-6 py-3 rounded-t-xl border-t-2 border-x-2 border-[#2A2E36]">
    <h2 className="text-white font-semibold text-md sm:text-[24px]">Your Watchlist</h2>
  </div>

  {/* Show message if watchlist is empty */}
  {fetchWatchlistErr ? (
    <div className="shadow-lg px-4 py-4 md:px-4 bg-gray-900 flex flex-col lg:justify-center font-text">
      <p className="text-white text-xl font-bold my-2 lg:text-center">Your watchlist is empty</p>
      <p className="text-white lg:text-center mb-5">Press the button to browse all the coins</p>
      <Link
        to="/papertrade/app/market"
        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        View Coins
      </Link>
    </div>
  ) : (
    <div className="overflow-x-auto">
       <table className="w-full border-2 border-[#2A2E36]">
        {/* Table Head */}
        <thead className="bg-[#171A24] text-white">
          <tr className="text-sm text-left">
            <th className="px-6 py-3 font-semibold">S.No.</th>
            <th className="px-6 py-3 font-semibold">Name</th>
            <th className="px-6 py-3 font-semibold">Price</th>
            <th className="px-6 py-3 font-semibold">Change%</th>
            <th className="px-6 py-3 font-semibold">Action</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {fetchWatchlistSuccess &&
            watchlistData.slice(0, 10).map((coin, index) => (
              <tr key={index} className=" hover:bg-[#1A1D25] transition">
                {/* S.No */}
                <td className="px-6 py-4 text-white font-medium">#{index + 1}</td>

                {/* Coin Name */}
                <td className="px-6 py-4 flex items-center space-x-3">
                  <img src={coin.image.large} alt={coin.name} className="w-8 h-8 rounded-md" />
                  <div>
                    <p className="text-white font-semibold text-sm">{coin?.name}</p>
                    <p className="text-gray-400 text-sm">{coin?.symbol.toUpperCase()}/USD</p>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-6 py-4 text-white font-medium text-sm">
                  ${coin.market_data.current_price.usd.toLocaleString()}
                </td>

                {/* 24h Change */}
                <td
                  className={`px-6 py-4 font-semibold text-sm ${
                    coin?.market_data.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {coin?.market_data.price_change_percentage_24h >= 0 && "+"}
                  {coin?.market_data.price_change_percentage_24h?.toFixed(2)}%
                </td>
                <td className='px-6 py-4 flex gap-2'>
                  <button className='text-white border-2 border-[#2A2E36] rounded-md p-1.5' onClick={()=> navigate(`/papertrade/app/coin/${coin.id}`)}>
                                                        <IoEyeOutline className='text-[18px]' />
                                                        </button>
                                       <button className='text-white border-2 border-[#2A2E36] rounded-md p-1.5'  onClick={() => handleDelete(coin.id, currentUser.uid)}>
                                                        <FaRegTrashAlt className='text-[18px]' />
                                                        </button>
                                    
                  {/* <button className='text-white border-2 border-[#2A2E36] rounded-md p-2'>
                  <CiEdit className='text-[18px]' />
                  </button>
                  <button className='text-[#CFA935] border-2 border-[#CFA935] rounded-md p-2 flex items-center gap-2'>
                  <LiaCoinsSolid className='text-[18px]' /> 
                  <span>Sell</span>
                  </button> */}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )}
</div>

      </div>
{/*   
      <div>
        <p className="text-white font-bold text-2xl md:text-3xl font-title my-4 px-4 mt-10 md:mt-10">Global Leaderboard</p>

        <ul className="px-2 font-text md:px-12 flex flex-col space-y-1 pb-12 text-white">
    
          <li className="grid grid-cols-3 text-gray-500 py-2 px-1md:px-5 cursor-pointer border-b-2 border-white">
            <div className="">
              <p className="text-white pl-4">Rank</p>
            </div>
            <div className="flex items-center justify-start ml-auto md:ml-0 ">
              <p className="w-28 md:w-40  text-white break-all text-left">Player</p>
            </div>
            <div className="flex items-center justify-end ml-auto md:ml-0 ">
              <p className="w-24 md:w-40  text-white text-right mr-2">Networth</p>
            </div>
          </li>
          {fetchLeaderboardError ? (
            <p className="text-red-500 text-xl">Something went wrong</p>
          ) : (
            fetchLeaderboardSuccess &&
            leaderboard.slice(0, 5).map((user, index) => (
              <li
                key={index}
                className="grid grid-cols-3 text-gray-500 py-2 px-1 md:px-5 hover:bg-gray-900 rounded-lg cursor-pointer border-b-2 border-gray-800 ">
                <div className="flex items-center space-x-2 ">
                  <p className="pl-1">{index + 1}</p>
                  {index + 1 === 1 && (
                    <img
                      src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-trophy-reward-and-badges-justicon-flat-justicon-1.png"
                      alt="gold trophy"
                      className="w-8 h-8"
                    />
                  )}
                  {index + 1 === 2 && (
                    <img
                      src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-trophy-baseball-justicon-flat-justicon.png"
                      alt="silver trophy"
                      className="w-8 h-8"
                    />
                  )}
                  {index + 1 === 3 && (
                    <img
                      src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-trophy-reward-and-badges-justicon-flat-justicon-4.png"
                      alt="3rd rank trophy"
                      className="w-8 h-8"
                    />
                  )}
                </div>
                <div className="flex items-center justify-start ml-auto md:ml-0 ">
                  <p className="w-28 md:w-40 truncate text-white font-medium">{user.username}</p>
                </div>
                <div className="flex items-center justify-end ml-auto md:ml-0 ">
                  <p className="w-28 md:w-40 break-all text-white font-medium text-right">${user.networth}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div> */}
      {/*News*/}
      {/* <p className="text-white font-bold text-2xl md:text-3xl font-title my-4 px-4">
        Today Top Headlines
      </p>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 px-8 pt-4">
        {fetchNewsSuccess &&
          news?.slice(0, 6).map((news) => (
            <a
              className="relative block p-8 overflow-hidden border border-gray-100 rounded-lg"
              href={news.url}
              rel="noreferrer"
              target="_blank"
            >
              <span className="absolute inset-x-0 bottom-0 h-2  bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

              <div className="justify-between sm:flex">
                <div>
                  <h5 className="font-title text-lg font-bold text-white">{news.name}</h5>
                  <p className="font-title mt-2 text-xs font-medium text-gray-300">
                    By {news.provider[0].name}
                  </p>
                </div>

                <div className="flex-shrink-0 hidden ml-3 sm:block">
                  <img
                    className="object-cover w-16 h-16 rounded-lg shadow-sm"
                    src={news?.image?.thumbnail?.contentUrl || demoImage}
                    alt="News cover"
                  />
                </div>
              </div>

              <div className="font-text mt-4 sm:pr-8">
                <p className="text-sm text-gray-400 line-clamp-4">{news.description}</p>
              </div>

              <dl className="font-text flex mt-6">
                <div className="flex flex-col-reverse">
                  <dt className="text-sm font-medium text-gray-500">Published</dt>
                  <dd className="text-xs text-gray-300">{news.datePublished.substring(0, 10)}</dd>
                </div>
              </dl>
            </a>
          ))}
      </div> */}
    </>
  );
};

export default DesktopDashboard;
