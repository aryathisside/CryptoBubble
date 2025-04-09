import { lazy } from 'react';
import { BsArrowDownUp } from 'react-icons/bs';
import { FaShoppingCart } from 'react-icons/fa';
import { IoIosArrowRoundForward } from 'react-icons/io';
import MiniWatchlist from '../Components/MiniWatchlist';
import CryptoNews from '../Components/CryptoNews';
import BuyCoins from '../Components/BuyCoins';

// import { useAuth } from "../Context/AuthContext";

// import CoinsTable from "../Components/CoinsTable";
const CoinsTable = lazy(() => import('../Components/CoinsTable'));

const CoinMarket = () => {
  // const { currentUser } = useAuth();
  return (
    <section className="lg:px-4 py-2 lg:py-8 max-w-full ">
      <div className="md:flex">
        {/* <p className="font-title text-white font-bold text-2xl md:text-3xl font-title mt-4 lg:mt-0 ml-3">
        Cryptocurrency Prices
      </p> */}
        <CoinsTable />
      
      </div>
      <CryptoNews />
    </section>
  );
};

export default CoinMarket;
