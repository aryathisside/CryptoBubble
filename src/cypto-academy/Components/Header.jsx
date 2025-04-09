import React from 'react';
import logo from '../../../public/image.png';
import mobilelogo from '../../../public/cryptoBubble-mobile.png';
import { IoIosSearch } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { FiUser } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeLinkClass = 'text-[#CFA935] border-b-2 border-[#CFA935] pb-4'; // Active color
  const inactiveLinkClass = 'hover:text-[#CFA935]'; // Hover color

  return (
    <div className="bg-[#171A24] text-white shadow-md w-full sticky top-0 z-50">
      {/* Main container */}
      <div className="p-3 flex items-center justify-between w-full h-[60px] sm:h-[90px]">

        {/* Logo Section - Centered properly */}
        <div className="flex items-center" onClick={()=> navigate('/')}>
          {/* Large screen logo */}
          <img src={logo} alt="Logo" className="w-[190px] h-[35px] rounded-full hidden sm:block" />
          {/* Small screen logo */}
          <img src={mobilelogo} alt="Mobile Logo" className="h-[30px] rounded-full sm:hidden" />
        </div>

        {/* Navigation Links - Only for medium & larger screens */}
        <nav className="hidden lg:flex space-x-10">
          <Link to="/papertrade/app" className={`${location.pathname === '/papertrade/app' ? activeLinkClass : inactiveLinkClass}`}>
            Home
          </Link>
          <Link to="/papertrade/app/market" className={`${location.pathname === '/papertrade/app/market' ? activeLinkClass : inactiveLinkClass}`}>
            Market
          </Link>
          <Link
            to="/papertrade/app/portfolio"
            className={`${location.pathname === '/papertrade/app/portfolio' ? activeLinkClass : inactiveLinkClass}`}>
            Portfolio
          </Link>
          <Link
            to="/papertrade/app/watchlist"
            className={`${location.pathname === '/papertrade/app/watchlist' ? activeLinkClass : inactiveLinkClass}`}>
            Watchlist
          </Link>
        </nav>

        {/* Icons Section - Always Visible */}
        <div className="flex items-center space-x-3">
          <button className="p-2 sm:border-2 border-[#2A2E36] rounded-md hover:bg-gray-700" onClick={() => navigate('/papertrade/app/search')}>
            <IoIosSearch className="text-[20px]" />
          </button>
          {/* <button className="p-2 border-2 border-[#2A2E36] rounded-md hover:bg-gray-700 hidden sm:block">
            <IoSettingsOutline className="text-[20px]" />
          </button> */}
          <button className="p-2 sm:border-2 border-[#2A2E36] rounded-md hover:bg-gray-700" onClick={() => navigate('/papertrade/app/profile')}>
            <FiUser className="text-[20px]" />
          </button>
          <button className="text-[#CFA935] text-sm border-2 px-2 py-2 border-[#CFA935] rounded-md hover:bg-gray-700" onClick={()=> navigate('/')}>
            {window.innerWidth < 768 ? "CB" : "Crypto Bubble"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Header;
