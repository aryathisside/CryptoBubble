import { useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import graph from '../Assets/svg/graph.svg';
import crypto from '../Assets/svg/cryptocurrency-logo.svg';
import bar from '../Assets/svg/bar-chart.svg';

import { useGetCoinsDataQuery, useGetGlobalCryptoDataQuery } from '../services/coinsDataApi';
import ErrorToast from './ErrorToast';
import Loader from './Loader';
import DynamicPagination from '../../components/common/Pagination';
import BuyCoins from './BuyCoins';
import MiniWatchlist from './MiniWatchlist';
import { MdOutlineStarBorder } from 'react-icons/md';
import percentIcon from '../Assets/svg/percent-icon.svg';
import priceIcon from '../Assets/svg/price-icon.svg';

const CoinsTable = () => {
  const navigate = useNavigate();
  const toastRef = useRef(null);

  const [currency, setCurrency] = useState('usd');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // const [page, setPage] = useState(1);

  const { data, error, isLoading, isSuccess } = useGetCoinsDataQuery({ currency, currentPage }, { pollingInterval: 60000 });

  const {
    data: globalCryptoData,
    // error: fetchGlobalCryptoError,
    isLoading: fetchGlobalCryptoLoading,
    isSuccess: fetchGlobalCryptoSuccess
  } = useGetGlobalCryptoDataQuery();

  useEffect(() => {
    if (error) {
      toastRef.current.show();
    }
  }, [error]);

  const handlePagination = (data) => {
    setCurrentPage(Number(data.selected + 1));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  const slicedData = data?.slice(0, 5) || [];

  return (
    <>
      {(isLoading || fetchGlobalCryptoLoading) ? <Loader />:
      <>
      <div className="z-10 w-full md:w-[72%]">
      
        {error && <ErrorToast message="Something Went Wrong!" ref={toastRef} />}
        <div className="bg-[#171A24] py-6 px-4 rounded-[12px] mx-3 md:mt-6 sm:mt-4 mb-2 md:mb-4">
          <div className="md:flex justify-between border-b-2 border-[#2A2E36]">
            <div>
              <p className="text-white font-bold text-xl md:text-2xl font-title lg:mt-0 mb-2 ml-3">Market</p>
              <p className="text-[#A9A9A9] text-sm  font-title lg:mt-0 mb-4 ml-3">Real time market insights and seamless trading simulation</p>
            </div>
            <div className="md:px-4" onClick={() => navigate('/papertrade/app/search')}>
              <label for="table-search" className="sr-only">
                Search
              </label>
              <div className="relative mt-1">
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
                  placeholder="Search Crypto here..."
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          <div className=" flex gap-3 md:gap-8 rounded-box justify-between w-screen w-full overflow-auto max-w-full mt-4">
            {slicedData.length > 0 ? (
              slicedData.map((coins, index) => (
                <div key={coins.id || index} className="w-full flex-1 bg-[#080808] p-3 rounded-lg">
                  <div className="flex items-center gap-1">
                    <img src={coins.image} alt={coins.name || 'cryptocurrency'} className="w-8 h-8 object-contain" />
                    <p className=" truncate text-sm text-white font-semibold break-words">{coins.name}</p>
                  </div>
                  <div className="text-white font-semibold pt-3">$ {coins.current_price}</div>
                  <div className="flex items-center text-sm justify-start gap-1 ml-auto md:ml-0 ">
                    <img src={percentIcon} alt="percent" />
                    <p className={` ${coins?.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'} font-semibold text-sm`}>
                      {coins?.price_change_percentage_24h >= 0 && '+'}
                      {coins?.price_change_percentage_24h?.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white">No data available</p>
            )}
          </div>
        </div>

        {/* 
      {fetchGlobalCryptoSuccess && (
        <div className="no-scrollbar flex flex-wrap p-4 gap-3 md:gap-8 rounded-box justify-between w-screen w-full overflow-auto max-w-full">
          <div className="w-full flex-1">
            <div className="bg-gradient-to-tr from-gray-900 to-gray-700 overflow-hidden shadow rounded-lg relative">
              <img src={bar} alt="btc logo" className="h-12 w-8 rounded-full absolute opacity-100 top-3 right-6" />
              <div className="px-4 py-5">
                <dl>
                  <dt className="font-title text-sm leading-5 font-medium text-gray-400 truncate">Total Market Cap</dt>
                  <dd className="font-text mt-1 text-xl leading-9 font-semibold text-gray-200">
                    ${globalCryptoData.data.total_market_cap.usd.toFixed(4)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="w-[47%] md:w-full md:flex-1">
            <div className="bg-gradient-to-tr from-gray-900 to-gray-700 overflow-hidden shadow rounded-lg relative">
              <img src={crypto} alt="btc logo" className="h-12 w-8 rounded-full absolute opacity-100 top-3 sm:right-6 right-3" />
              <div className="px-4 py-5">
                <dl>
                  <dt className="font-title text-sm sm:leading-5 font-medium text-gray-400 truncate">
                    {window.innerWidth < 768 ? 'Active Crypto' : 'Active Cryptocurrencies'}
                  </dt>
                  <dd className="font-text mt-1 sm:text-3xl leading-9 font-semibold text-gray-200">
                    {globalCryptoData.data.active_cryptocurrencies}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="w-[47%] md:w-full md:flex-1">
            <div className="bg-gradient-to-tr from-gray-900 to-gray-700 overflow-hidden shadow rounded-lg relative">
              <img src={graph} alt="btc logo" className="h-12 w-8 rounded-full absolute opacity-100 top-3 sm:right-6 right-3" />
              <div className="px-4 py-5">
                <dl>
                  <dt className="font-title text-sm leading-5 font-medium text-gray-400 truncate">
                    {window.innerWidth < 768 ? ' 24h Market' : ' 24h Market Cap Change'}
                  </dt>
                  <dd
                    className={`font-text mt-1 sm:text-3xl leading-9 font-semibold text-gray-200`}
                    //   ${
                    //   globalCryptoData.data.market_cap_change_percentage_24h_usd >= 0
                    //     ? "text-green-400"
                    //     : "text-red-400"
                    // }`}
                  >
                    {globalCryptoData.data.market_cap_change_percentage_24h_usd.toFixed(4)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )} */}
        {/* more global stats page */}
        {/* {fetchGlobalCryptoSuccess && (
        <Link to="/papertrade/app/market/globalStats" className="text-md  font-semibold text-green-400 px-4 underline">
          Show more global stats.
        </Link>
      )} */}
        {/* coin table */}
        <div className="bg-[#171A24] py-6 px-4 rounded-[12px] mx-3 md:mb-4 mb-3 sm:mt-3 md:mt-8">
          <div className=" mb-2">
            <button className="border-2 border-[#CFA935] text-[#CFA935] p-2 rounded">Market Cap</button>
          </div>

          <table className="w-full text-white border-collapse font-light mt-4">
            {/* Table Head */}
            <thead className="bg-[#2A2E36]">
              <tr className="text-[#A9A9A9] text-sm font-light">
                {/* Apply rounded corners based on screen size */}
                <th className="hidden lg:table-cell py-2 pl-3 lg:rounded-tl-md lg:rounded-bl-md">S.no</th>
                <th className="text-left p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="hidden lg:table-cell text-center p-2">24h Volume</th>
                <th className="hidden md:table-cell text-center p-2">24h %</th>
                <th className="hidden lg:table-cell text-center p-2">24h High</th>
                <th className="hidden lg:table-cell text-center p-2 lg:rounded-tr-md lg:rounded-br-md">24h Low</th>
          
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {isSuccess &&
                currentItems?.map((coins, index) => (
                  <tr key={index} onClick={() => navigate(`/papertrade/app/coin/${coins.id}`)} className=" hover:bg-[#080808] cursor-pointer mt-2">
                    {/* S.no */}
                    <td className="hidden lg:table-cell p-3">
                      <div className="flex items-center text-sm">
                        <MdOutlineStarBorder />
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="flex items-center space-x-2 p-3">
                      <img className="h-7 w-7 md:h-8 md:w-8 object-contain" src={coins.image} alt="crypto" loading="lazy" />
                      <div>
                        <p className="text-white font-semibold truncate text-sm">
                          {coins.name} <span className="text-[#CFA935] text-[8px] bg-[#00000033] p-1.5"> {coins.symbol.toUpperCase()}</span>
                        </p>
                        {/* <p className=' text-sm'>{`$/USD`}</p> */}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="text-center p-3">
                      <p className="flex items-center text-sm">
                        ${coins.current_price}
                        <img src={priceIcon} alt="price" className="w-4 h-4 ml-1" />
                      </p>
                    </td>

                    {/* 24h Volume */}
                    <td className="hidden lg:table-cell  text-sm p-3">${coins.total_volume}</td>

                    {/* 24h % */}
                    <td
                      className={`hidden md:table-cell text-center text-sm p-3 ${coins?.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coins?.price_change_percentage_24h >= 0 && '+'}
                      {coins?.price_change_percentage_24h?.toFixed(2)}%
                    </td>

                    {/* 24h High */}
                    <td className="hidden lg:table-cell text-center  text-sm p-3">${coins.high_24h}</td>

                    {/* 24h Low */}
                    <td className="hidden lg:table-cell text-center text-sm p-3">${coins.low_24h}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <DynamicPagination totalItems={data?.length} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          {/* pagination */}
          {/* <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        pageCount={52}
        marginPagesDisplayed={2}
        pageRangeDisplayed={1}
        onPageChange={handlePagination}
        containerClassName={`flex justify-center space-x-2 text-xs font-medium text-white`}
        pageClassName={`inline-flex items-center justify-center w-8 h-8 border text-white border-gray-100 rounded-full`}
        pageLinkClassName={`block w-8 h-8 leading-8 text-center text-white  border-green-600 rounded-full`}
        previousLinkClassName={`block w-8 h-8 leading-8 text-center text-white  bg-green-600 border-green-600 rounded-full`}
        nextLinkClassName={`block w-8 h-8 leading-8 text-center text-white  bg-green-600 border-green-600 rounded-full`}
      /> */}
        </div>
      </div>
      <div className="w-[28%] mx-3 my-4 hidden md:block">
        {isSuccess && <BuyCoins data={data} />}
        <MiniWatchlist />
      </div>
      </>}
    </>
  );
};

export default CoinsTable;
