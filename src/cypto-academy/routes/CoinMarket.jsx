import { lazy } from "react";
import { BsArrowDownUp } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";
import MiniWatchlist from "../Components/MiniWatchlist";

// import { useAuth } from "../Context/AuthContext";

// import CoinsTable from "../Components/CoinsTable";
const CoinsTable = lazy(() => import("../Components/CoinsTable"));

const CoinMarket = () => {
  // const { currentUser } = useAuth();
  return (
    <section className="lg:px-4 py-2 lg:py-8 max-w-full flex">
      {/* <p className="font-title text-white font-bold text-2xl md:text-3xl font-title mt-4 lg:mt-0 ml-3">
        Cryptocurrency Prices
      </p> */}
      <CoinsTable />
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
              <MiniWatchlist/>
              {/* <div className="bg-[#171A24] py-6 px-4 rounded-[12px]">
                <div className="flex justify-between items-center ">
                  <div className="text-white">
                    News <span className="text-[#A9A9A9]">(for watchlist cryptos)</span>
                  </div>
                  <div className="border-2 border-[#2A2E36] p-2 rounded">
                    <IoIosArrowRoundForward className="text-[#A9A9A9]" />
                  </div>
                 
                </div>
                <div className='mt-2 mb-2'>
                    <div className="text-[#A9A9A9] text-sm">5 Days ago</div>
                    <div className='text-white text-sm'>Pi Network’s Open Mainnet is now live, marking a major milestone after ...</div>
                  </div>
      
                  <div className='mt-2 mb-2'>
                    <div className="text-[#A9A9A9] text-sm">5 Days ago</div>
                    <div className='text-white text-sm'>Pi Network’s Open Mainnet is now live, marking a major milestone after ...</div>
                  </div>
              </div> */}
            </div>
    </section>
  );
};

export default CoinMarket;
