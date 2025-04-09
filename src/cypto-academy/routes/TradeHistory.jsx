import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import emptyWatchlistLogo from '../Assets/svg/emptyWatchlist.svg';
import DynamicPagination from '../../components/common/Pagination';
import { IoMdCloudDownload } from "react-icons/io";

const TradeHistory = () => {
  const { currentUser } = useAuth();
  const [tradeHistory, setTradeHistory] = useState([]);
  const [tradeLoading, setTradeLoading] = useState(true);
  const [tradeError, setTradeError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 10;

  const DownloadReport = async () => {
    try {
      const response = await fetch(`${process.env.SIMULATOR_API}/trading-history-report/${currentUser.uid}`, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error(response.error || 'Failed to fetch trade history.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'trade-history-report.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Revoke the object URL to free memory
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error fetching trade history:', error.message);
      setTradeError(error.message);
    }
  };

  async function getUserTradeHistory(userId) {
    try {
      const response = await fetch(`${process.env.SIMULATOR_API}/get-trade-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch trade history.');
      }
      console.log('Trade history:', result.history);
      // return result.history; // Returns the trade history array
      setTradeHistory(result.history);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching trade history:', error.message);
      setTradeError(error.message);
    } finally {
      setTradeLoading(false);
    }
  }
  useEffect(() => {
    getUserTradeHistory(currentUser.uid);
  }, []);

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tradeHistory?.slice(indexOfFirstItem, indexOfLastItem);

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

  return (
    <section className="lg:px-4 py-2 lg:py-8  w-full p-2 flex">
      <div className="bg-[#171A24] w-full py-6 px-4 rounded-[12px] m-3">
        <div className="md:flex justify-between items-center">
          <div>
            <p className="text-white font-bold text-xl md:text-2xl font-title lg:mt-0 mb-2 ml-3">Trade History</p>
            <p className="text-[#A9A9A9] text-sm  font-title lg:mt-0 mb-4 ml-3">Keep track on your favorite crypto in one place.</p>
          </div>
          <div className="flex items-start gap-2 sm:gap-0">
            <div className="md:px-4">
              <label for="table-search" className="sr-only">
                Search
              </label>
              <div className="relative mt-1" onClick={() => navigate('/papertrade/app/search')}>
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
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
                  placeholder="Search crypto here..."
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
            </div>
            <button className="flex gap-2 text-[#CFA935] border-2 px-4 py-2 mt-2 border-[#CFA935] rounded-md hover:bg-gray-700 leading-none h-auto" onClick={()=>DownloadReport()}>
            {window.innerWidth < 768 ? <IoMdCloudDownload /> : <><IoMdCloudDownload /> Download</>}

              
            </button>
          </div>
        </div>

        <ul className=" font-text flex flex-col space-y-1 pb-4 text-white">
          {/* Table Head */}
          <li className="grid grid-cols-2 md:grid-cols-5 py-2 px-1md:px-5 cursor-pointer bg-[#2A2E36] py-2 rounded-md text-[#A9A9A9]">
            <div className="flex justify-start items-center space-x-4">
              <p className=" pl-4">Crypto Name</p>
            </div>
            <div className="hidden md:flex justify-start items-center space-x-4">
              <p className="pl-4">Buy/Sell</p>
            </div>

            <div className="flex justify-center md:justify-start items-center space-x-4">
              <p className="">Price</p>
            </div>
            <div className="hidden md:flex justify-center md:justify-start items-center space-x-4">
              <p className="">Amount</p>
            </div>
            <div className="hidden md:flex items-center justify-start  ml-auto md:ml-0 ">
              <p className="w-28 md:w-40 text-left px-3">Time</p>
            </div>
          </li>
          {tradeHistory &&
            currentItems.map((coin, index) => {
              // const coinPercentageChange = percentageChange(coin.coinId, coin.coinValue, coin.coinUsdPrice);
              return (
                <li
                  key={index}
                  onClick={() => navigate(`/papertrade/app/coin/${coin.coinId}`)}
                  style={{ height: '60px' }}
                  className="grid grid-cols-2 md:grid-cols-5 text-gray-500 py-2 px-2 md:px-5 hover:bg-gray-900 cursor-pointer border-gray-800 ">
                  <div className="flex justify-start items-center md:space-x-4">
                    {/* <img className="h-8 w-8 md:h-10 md:w-10 object-contain" src={coin.image} alt="cryptocurrency" loading="lazy" /> */}
                    <div>
                      <p className=" w-24 md:w-64 text-white break-words text-md">
                        {capitalizeFirstLetter(coin.coinId)} <span className="text-[#CFA935] text-sm">{`${coin.symbol}`.toUpperCase()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:flex justify-start items-center space-x-4">
                    <p className="pl-1">{coin?.type}</p>
                  </div>

                  <div className="flex items-center justify-start ml-auto md:ml-0 ">
                    <p className="w-28 md:w-40 text-white font-semibold text-left break-words">
                      {coin.coinValue ? coin.coinValue : <span>${coin.coinUsdPrice}</span>} {coin.coinValue && coin.symbol}
                      <br />
                    </p>
                  </div>
                  <div className="hidden md:flex justify-start items-center space-x-4">
                    <p className="w-28 md:w-40 text-gray-500 text-left ">{coin.coinValue && <span>${coin.coinUsdPrice}</span>}</p>
                  </div>
                  <div className="hidden md:flex justify-start items-center space-x-4">
                    <p className="pl-1">{formatDate(coin?.timestamp)}</p>
                  </div>
                </li>
              );
            })}
          {tradeHistory && tradeHistory.length === 0 && (
            <div className=" shadow-lg rounded-2xl  px-4 py-4 md:px-4 flex flex-col lg:justify-center align-center text-center max-w-xl m-auto">
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
        <DynamicPagination totalItems={tradeHistory?.length} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
      {/* </div> */}
    </section>
  );
};

export default TradeHistory;
