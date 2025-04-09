import { lazy, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  useFetchAvailableCoinsQuery,
  useGetLeaderboardQuery,
  useGetPortfolioDataQuery,
  useGetUserNetworthQuery,
  useGetWatchlistDataQuery
} from '../services/supabaseApi';
import { useAuth } from '../../Context/AuthContext';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

// import Logout from "../Components/Buttons/Logout";
// import ResetVirtualBalance from "../Components/ResetVirtualBalance";
const Logout = lazy(() => import('../Components/Buttons/Logout'));
const ResetVirtualBalance = lazy(() => import('../Components/ResetVirtualBalance'));

const UserProfile = () => {
  const { currentUser } = useAuth();

  const [resetModal, setResetModal] = useState(false);

  // fetch watchlist coin data
  const {
    data: watchlistData,
    error: fetchWatchlistErr,
    // isLoading: fetchWatchlistLoading,
    isSuccess: fetchWatchlistSuccess
  } = useGetWatchlistDataQuery(currentUser.uid);

  // Get user networth
  const {
    data: userNetworth,
    isSuccess: userNetworthSuccess
    // error: networthError
  } = useGetUserNetworthQuery(currentUser.uid);

  // get available coins
  const {
    data: availableUsdCoins,
    isSuccess: fetchAvailableUsdCoinsSuccess
    // error: fetchAvailableUsdCoinsError,
    // isLoading: fetchAvailableUsdCoinsLoading,
    // refetch: refetchAvailableCoins
  } = useFetchAvailableCoinsQuery(currentUser.uid);

  // get Leaderboard data
  const {
    data: leaderboard,
    // isLoading: leaderboardIsLoading,
    isSuccess: fetchLeaderboardSuccess,
    error: fetchLeaderboardError
  } = useGetLeaderboardQuery();

  const {
    data: portfolioData,
    error,
    // isLoading,
    // isFetching,
    isSuccess
    // refetch: refetchPortfolioData
  } = useGetPortfolioDataQuery(currentUser.uid);

  return (
    <section className="lg:px-4 py-2 lg:py-8 max-w-[1600px]">
      <div className="flex md:space-x-4 justify-center items-center">
        <div className="text-center overflow-hidden shadow rounded-lg relative md:mt-12 border border-[#2A2E36] md:px-12 py-4">
          <div className="px-4 py-5 sm:p-6 flex flex-col items-center">
            <div className="p-2 flex flex-col items-center space-y-4 cursor-pointer">
              <div className="bg-[#171A24] rounded-full w-24 h-24 flex items-center justify-center">
                <PermIdentityIcon sx={{ color: 'white', fontSize: '70px' }} />
              </div>
              <div>
                <div className="text-[#A9A9A9] text-sm">Name</div>
                <h2 className="text-lg font-semibold text-white font-title">{currentUser.displayName}</h2>
              </div>
              <div className="pt-4">
                <div className="text-[#A9A9A9] text-sm">Email</div>
                <h2 className="text-lg font-semibold text-white font-title">{currentUser.email}</h2>
              </div>
            </div>
            <div className="flex gap-4 my-4">
              <div className=" bg-[#171A24] py-3 px-12 rounded-[12px] border border-gray-500">
                <Link to="/change-password" className="text-white">
                  Change Your Password
                </Link>
              </div>

              {/* <div className=" bg-[#171A24] py-3 px-12 rounded-[12px] border border-gray-500">
                <button onClick={() => setResetModal(!resetModal)} className=" text-white">
                  Reset Virtual USD Balance
                </button>
              </div> */}
            </div>
            <Logout />
            <ResetVirtualBalance modal={resetModal} setModal={setResetModal} />
          </div>
        </div>
        {/* account balance information */}
        {/* <div className="mt-8 md:mt-0 w-80 m-auto md:m-0 md:w-96 h-56 lg:ml-8 bg-gradient-to-tr from-gray-900 to-gray-700  rounded-xl relative text-white shadow-2xl transition-transform transform hover:scale-110">
          <div className="w-full px-8 absolute top-8">
            <div className="flex justify-between">
              <div className="">
                <h1 className="">Name</h1>
                <p className="font-medium tracking-wide">{currentUser.displayName}</p>
              </div>
              <img
                alt="user card chip"
                className="w-14 h-14"
                src="https://img.icons8.com/offices/80/000000/sim-card-chip.png"
              />
            </div>
            <div className="pt-1">
              <h1 className="">Account Balance</h1>
              <p className="font-medium tracking-more-wider">
                ${fetchAvailableUsdCoinsSuccess && availableUsdCoins[0]?.amount}
              </p>
            </div>
            <div className="pt-6 pr-6">
              <div className="flex justify-between">
                <div className="">
                  <h1 className="font-light text-xs">Networth</h1>
                  <p className="font-medium tracking-wider text-sm">
                    {userNetworthSuccess && <span>${userNetworth[0]?.networth}</span>}
                  </p>
                </div>
           

                <div className="">
                  <p className="font-light text-xs">CVV</p>
                  <p className="font-bold tracking-more-wider text-sm">···</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* user watchlist & portfolio */}
      {/* <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-2  mt-8">
     
        <div className=" shadow-lg mx-auto rounded-2xl bg-black w-[90%]">
          <p className="text-white font-bold text-2xl md:text-3xl font-title my-4">Your Watchlist</p>

          <ul>
            {fetchWatchlistErr ? (
              <div className=" shadow-lg rounded-2xl  px-4 py-4 md:px-4 bg-gray-900 flex flex-col ;lg:justify-center ">
                <p className="text-white text-xl font-bold my-2 lg:text-center">Your watchlist is empty</p>
                <p className="text-white lg:text-center mb-5">Press the button to browse all the coins</p>
                <Link
                  to="/papertrade/app/market"
                  className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                  View Coins
                </Link>
              </div>
            ) : (
              fetchWatchlistSuccess &&
              watchlistData.slice(0, 7).map((coin, index) => (
                <li className="font-text flex items-center text-gray-200 justify-between py-3 border-b-2 border-gray-800 ">
                  <div className="flex items-center justify-start text-sm space-x-3">
                    <img src={coin.image.large} alt={`${coin.name}`} className="w-10 h-10" />
                    <div className="">
                      <p className="text-white text-xl font-bold ">{coin.name}</p>
                      <p className="text-white text-sm uppercase">{coin.symbol}</p>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-white font-semibold">
                      ${coin.market_data.current_price.usd}
                      <br />
                    </p>
                    <p
                      className={`text-right ${
                        coin?.market_data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                      } font-semibold`}>
                      {coin?.market_data.price_change_percentage_24h >= 0 && '+'}
                      {coin?.market_data.price_change_percentage_24h?.toFixed(2)}%
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className=" shadow-lg mx-auto rounded-2xl bg-black w-[90%]">
          <p className="text-white font-bold text-2xl md:text-3xl font-title my-4">Your Credits</p>

          <ul>
            {error ? (
              <div className=" shadow-lg rounded-2xl  px-4 py-4 md:px-4 bg-gray-900 flex flex-col ;lg:justify-center ">
                <p className="text-white text-xl font-bold my-2 lg:text-center">Your portfolio is empty</p>
                <p className="text-white lg:text-center mb-5">Press the button to browse all the coins</p>
                <Link
                  to="/papertrade/app/market"
                  className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                  View Coins
                </Link>
              </div>
            ) : (
              isSuccess &&
              portfolioData.slice(0, 7).map((coin, index) => (
                <li className="flex items-center font-text text-gray-200 justify-between py-3 border-b-2 border-gray-800 ">
                  <div className="flex items-center justify-start text-sm space-x-3">
                    <img src={coin.image} alt={`${coin.coinName}`} className="w-10 h-10" />
                    <div className="">
                      <p className="text-white text-xl font-bold ">{coin.coinName}</p>
                      <p className="text-white text-sm uppercase">{coin.coinSymbol}</p>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-white font-semibold text-right">
                      {coin.coinAmount} {coin.coinSymbol}
                      <br />
                    </p>
                    <p className="text-gray-400 font-semibold text-right">${coin.amount}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div> */}
      {/* leaderboard */}
      {/* <div>
        <p className="text-white font-bold text-2xl md:text-3xl font-title my-4 px-4 md:px-6 mt-6 md:mt-16">
          Global Leaderboard
        </p>

        <ul className="px-2 md:px-12 flex flex-col space-y-1 pb-12 text-white">
          Table Head
          <li className="grid grid-cols-3 font-text text-gray-500 py-2 px-1md:px-5 cursor-pointer border-b-2 border-white">
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
                className="grid grid-cols-3 text-gray-500 py-2 px-1 md:px-5 hover:bg-gray-900 rounded-lg cursor-pointer border-b-2 border-gray-800 "
              >
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
                  <p className="w-28 md:w-40 truncate text-white font-semibold">{user.username}</p>
                </div>
                <div className="flex items-center justify-end ml-auto md:ml-0 ">
                  <p className="w-28 md:w-40 break-all text-white font-semibold text-right">
                    ${user.networth}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div> */}
    </section>
  );
};

export default UserProfile;
