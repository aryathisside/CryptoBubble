import React from 'react';
import logo from '../../../public/image.png';
import { IoIosSearch } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="bg-[#171A24] text-white shadow-md w-full">
      <div className=" px-[40px] py-2 flex items-center justify-between w-full h-[90px]">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-[320px] h-[50px] rounded-full" />
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-10">
          <a href="/papertrade/app" className="hover:text-gray-300">
            Home
          </a>
          <a href="/papertrade/app/market" className="hover:text-gray-300">
            Market
          </a>
          <a href="/papertrade/app/portfolio" className="hover:text-gray-300">
            Portfolio
          </a>
          <a href="/papertrade/app/watchlist" className="hover:text-gray-300">
            Watchlist
          </a>
        </nav>

        {/* Settings and User Profile */}
        <div className="flex items-center space-x-4 ">
        <button className='p-3 border-2 border-[#2A2E36] rounded-md hover:bg-gray-700'>
          <IoIosSearch className='text-[20px]' />
          </button>
          <button className='p-3 border-2 border-[#2A2E36] rounded-md hover:bg-gray-700'>
            <IoSettingsOutline className='text-[20px]'/>
          </button>
          <button className='p-3 border-2 border-[#2A2E36] rounded-md hover:bg-gray-700'>
            <FiUser className='text-[20px]'/>
          </button>
          <button className='text-[#CFA935] border-2 p-2 border-[#CFA935] rounded-md hover:bg-gray-700'>
            Crypto Simulator
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
