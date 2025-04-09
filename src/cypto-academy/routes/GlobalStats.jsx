import { lazy } from 'react';

import { useGetGlobalCryptoDataQuery } from '../services/coinsDataApi';

import Loader from '../Components/Loader';
import bar from '../Assets/svg/bar-chart.svg';
import graph from '../Assets/svg/graph.svg';
import prodoct from '../Assets/svg/product-logo.svg';
import crypto from '../Assets/svg/cryptocurrency-logo.svg';
import buy from '../Assets/svg/buy-logo.svg';
// import PieChart from "../Components/PieChart";
const PieChart = lazy(() => import('../Components/PieChart'));

const GlobalStats = () => {
  const {
    data: globalCryptoData,
    // error: fetchGlobalCryptoError,
    isLoading: fetchGlobalCryptoLoading,
    isSuccess: fetchGlobalCryptoSuccess
  } = useGetGlobalCryptoDataQuery();
  return (
    <section className="lg:px-4 py-2 lg:py-8">
      {fetchGlobalCryptoLoading && <Loader />}
      {/* <p className="text-white font-bold text-2xl md:text-3xl font-title mt-4 mb-4 lg:mt-0 ml-3">Global Metrics</p> */}
      {fetchGlobalCryptoSuccess && (
        <div className="no-scrollbar flex flex-wrap p-4 gap-4 rounded-box w-screen w-full overflow-auto max-w-full">
          <div className="w-full md:w-1/3 md:flex-[2]">
            <div className="bg-gradient-to-tr from-gray-900 to-gray-700 overflow-hidden shadow rounded-lg relative">
              <img src={bar} alt="btc logo" className="h-12 w-8 rounded-full absolute opacity-100 top-3 right-6" />
              <div className="px-4 py-5">
                <dl>
                  <dt className="font-title text-sm leading-5 font-medium text-gray-400 truncate">Total Market Cap</dt>
                  <dd className="font-text mt-1 text-2xl leading-9 font-semibold text-white pt-2">
                    ${globalCryptoData.data.total_market_cap.usd.toFixed(4)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="md:w-1/6 md:flex-[1] w-[47%]">
            <div className="bg-gradient-to-tr from-gray-900 to-gray-700 overflow-hidden shadow rounded-lg relative">
              <img src={prodoct} alt="btc logo" className="h-12 w-8 rounded-full absolute opacity-100 top-3 right-6" />
              <div className="px-4 py-5">
                <dl>
                  <dt className="font-title text-sm leading-5 font-medium text-gray-400 truncate">Volume</dt>
                  <dd className="font-text mt-1 md:text-2xl leading-9 font-semibold text-white pt-2">
                  ${globalCryptoData.data.total_volume.usd.toFixed(3)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="md:w-1/6 md:flex-[1] w-[47%]">
            <div className="bg-gradient-to-tr from-gray-900 to-gray-700 overflow-hidden shadow rounded-lg relative">
              <img src={crypto} alt="btc logo" className="h-12 w-8 rounded-full absolute opacity-100 top-3 right-6" />
              <div className="px-4 py-5">
                <dl>
                  <dt className="font-title text-sm leading-5 font-medium text-gray-400 truncate">Active Cryptos</dt>
                  <dd className="font-text mt-1 md:text-2xl leading-9 font-semibold text-white pt-2">
                  {globalCryptoData.data.active_cryptocurrencies}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="md:w-1/6 md:flex-[1] w-[47%]">
            <div className="bg-gradient-to-tr from-gray-900 to-gray-700 overflow-hidden shadow rounded-lg relative">
              <img src={buy} alt="btc logo" className="h-12 w-8 rounded-full absolute opacity-100 top-3 right-6" />
              <div className="px-4 py-5">
                <dl>
                  <dt className="font-title text-sm leading-5 font-medium text-gray-400 truncate">Markets</dt>
                  <dd className="font-text mt-1 md:text-2xl leading-9 font-semibold text-white pt-2">
                  {globalCryptoData.data.markets}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="md:w-1/6 md:flex-[1] w-[47%]">
            <div className="bg-gradient-to-tr from-gray-900 to-gray-700 overflow-hidden shadow rounded-lg relative">
              <img src={graph} alt="btc logo" className="h-12 w-8 rounded-full absolute opacity-100 top-3 right-6" />
              <div className="px-4 py-5">
                <dl>
                  <dt className="font-title text-sm leading-5 font-medium text-gray-400 truncate">Total Market Cap</dt>
                  <dd
                  className={`mt-1 md:text-3xl leading-9 font-semibold pt-2 ${
                    globalCryptoData.data.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-400' : 'text-red-400'
                  } `}>
                  {globalCryptoData.data.market_cap_change_percentage_24h_usd.toFixed(4)}%
                </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 m-4 rounded-xl border border-[#2A2E36]">
        <p className="text-white font-bold text-xl md:text-2xl font-title mt-4 ml-3 pl-2">Market Dominance</p>
        {fetchGlobalCryptoSuccess && <PieChart globalCryptoData={globalCryptoData} />}
      </div>
    </section>
  );
};

export default GlobalStats;
