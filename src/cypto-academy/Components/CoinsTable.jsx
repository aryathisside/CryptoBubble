import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import  graph  from '../Assets/svg/graph.svg'
import crypto from "../Assets/svg/cryptocurrency-logo.svg";
import bar from "../Assets/svg/bar-chart.svg"

import { useGetCoinsDataQuery, useGetGlobalCryptoDataQuery } from "../services/coinsDataApi";
import ErrorToast from "./ErrorToast";
import Loader from "./Loader";

const CoinsTable = () => {
  const navigate = useNavigate();
  const toastRef = useRef(null);

  const [currency, setCurrency] = useState("usd");

  const [page, setPage] = useState(1);

  const { data, error, isLoading, isSuccess } = useGetCoinsDataQuery(
    { currency, page },
    { pollingInterval: 300000 }
  );

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
    setPage(Number(data.selected + 1));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

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
    <div className="z-10 w-full">
      {(isLoading || fetchGlobalCryptoLoading) && <Loader />}
      {error && <ErrorToast message="Something Went Wrong!" ref={toastRef} />}
      {fetchGlobalCryptoSuccess && (
      <div className="no-scrollbar flex flex-wrap p-4 gap-3 md:gap-8 rounded-box justify-between w-screen w-full overflow-auto max-w-full">
      <div className="w-full flex-1">
        <div className="bg-gradient-to-tr from-gray-900 to-gray-700 overflow-hidden shadow rounded-lg relative">
          <img
            src={bar}
            alt="btc logo"
            className="h-12 w-8 rounded-full absolute opacity-100 top-3 right-6"
          />
          <div className="px-4 py-5">
            <dl>
              <dt className="font-title text-sm leading-5 font-medium text-gray-400 truncate">
                Total Market Cap
              </dt>
              <dd className="font-text mt-1 text-xl leading-9 font-semibold text-gray-200">
                ${globalCryptoData.data.total_market_cap.usd.toFixed(4)}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    
      <div className="w-[47%] md:w-full md:flex-1">
        <div className="bg-gradient-to-tr from-gray-900 to-gray-700 overflow-hidden shadow rounded-lg relative">
          <img
            src={crypto}
            alt="btc logo"
            className="h-12 w-8 rounded-full absolute opacity-100 top-3 sm:right-6 right-3"
          />
          <div className="px-4 py-5">
            <dl>
              <dt className="font-title text-sm sm:leading-5 font-medium text-gray-400 truncate">
               
                {window.innerWidth < 768 ? "Active Crypto" : "Active Cryptocurrencies"}
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
          <img
            src={graph}
            alt="btc logo"
            className="h-12 w-8 rounded-full absolute opacity-100 top-3 sm:right-6 right-3"
          />
          <div className="px-4 py-5">
            <dl>
              <dt className="font-title text-sm leading-5 font-medium text-gray-400 truncate">
               
                {window.innerWidth < 768 ? " 24h Market" : " 24h Market Cap Change"}
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
    
      )}
      {/* more global stats page */}
      {fetchGlobalCryptoSuccess && (
        <Link
          to="/papertrade/app/market/globalStats"
          className="text-md  font-semibold text-green-400 px-4 underline"
        >
          Show more global stats.
        </Link>
      )}
      {/* coin table */}

      <ul className="md:px-4 flex flex-col space-y-1 pb-12 font-text text-white p-2">
        {/* Table Head */}
        <li className="grid grid-cols-3 md:grid-cols-5 text-gray-500 py-3 px-1md:px-5 cursor-pointer bg-[#171A24] rounded-lg">
          <div className="flex justify-start items-center space-x-4 w-20">
            <p className="text-white pl-4">S.no</p>
          </div>
          <div className="flex justify-start items-center space-x-4">
            <p className="text-white pl-4">Name</p>
          </div>
          <div className="flex items-center justify-end ml-auto md:ml-0 ">
            <p className="w-28 md:w-40  text-white">Price</p>
          </div>
          <div className="hidden md:flex items-center justify-end ml-auto md:ml-0 ">
            <p className="w-24 md:w-40  text-white">24h Change</p>
          </div>
          <div className="hidden md:flex items-center justify-end ml-auto md:ml-0 ">
            <p className="w-24 md:w-40  text-white">Market Cap</p>
          </div>
        </li>
        {/* coin prices */}
        {isSuccess &&
          data?.map((coins, index) => (
            <li
              key={index}
              onClick={() => navigate(`/papertrade/app/coin/${coins.id}`)}
              className="grid grid-cols-3 md:grid-cols-5 text-gray-500 py-2 px-1md:px-5 hover:bg-gray-900 rounded-lg cursor-pointer border-gray-800 "
            >
              <div className="w-20 flex items-center">
              <p className="pl-4 text-white">#{index + 1}</p>
              </div>
              <div className="flex items-center space-x-2 ">
                
                <img
                  className="h-8 w-8 md:h-10 md:w-10 object-contain"
                  src={coins.image}
                  alt="cryptocurrency"
                  loading="lazy"
                />
                <div>
                  <p className=" w-64 truncate text-white font-semibold break-words">
                    {coins.name}
                  </p>
                  <div className="flex space-x-1">
                    <p>{ `${coins.symbol}/usd`.toUpperCase()}</p>
                    {/* <p
                      className={`md:hidden w-24 md:w-40 ${
                        coins?.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"
                      } font-semibold`}
                    >
                      {coins?.price_change_percentage_24h >= 0 && "+"}
                      {coins?.price_change_percentage_24h?.toFixed(2)}%
                    </p> */}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end ml-auto md:ml-0 ">
                <p className="w-28 md:w-40 text-white font-semibold">
                  ${coins.current_price}
                  <br />
                  <span className="md:hidden w-28 md:w-40 text-gray-500">
                    MCap: {normalizeMarketCap(coins.market_cap)}
                  </span>
                </p>
              </div>
              <div className="hidden md:flex items-center justify-end ml-auto md:ml-0 ">
                <p
                  className={`w-24 md:w-40 ${
                    coins?.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"
                  } font-semibold`}
                >
                  {coins?.price_change_percentage_24h >= 0 && "+"}
                  {coins?.price_change_percentage_24h?.toFixed(2)}%
                </p>
              </div>
              <div className="hidden md:flex items-center justify-end ml-auto md:ml-0 ">
                <p className="w-24 md:w-40  ">${coins.market_cap}</p>
              </div>
            </li>
          ))}
      </ul>
      {/* pagination */}
      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        breakLabel={"..."}
        pageCount={52}
        marginPagesDisplayed={2}
        pageRangeDisplayed={1}
        onPageChange={handlePagination}
        containerClassName={`flex justify-center space-x-2 text-xs font-medium text-white`}
        pageClassName={`inline-flex items-center justify-center w-8 h-8 border text-white border-gray-100 rounded-full`}
        pageLinkClassName={`block w-8 h-8 leading-8 text-center text-white  border-green-600 rounded-full`}
        previousLinkClassName={`block w-8 h-8 leading-8 text-center text-white  bg-green-600 border-green-600 rounded-full`}
        nextLinkClassName={`block w-8 h-8 leading-8 text-center text-white  bg-green-600 border-green-600 rounded-full`}
      />
    </div>
  );
};

export default CoinsTable;
