import { Link } from 'react-router-dom';

import { AiOutlineBarChart, AiOutlineSearch } from 'react-icons/ai';
import { RiHome2Fill, RiBarChart2Line } from 'react-icons/ri';
import { MdOutlineDashboard, MdOutlineMoreHoriz, MdOutlineStarBorder } from 'react-icons/md';
import { IoEyeOutline } from 'react-icons/io5';
import { Tooltip } from '@mui/material';

const TabNavigation = () => {
  return (
    <div className="  w-full h-[200px] lg:hidden z-50 ">
      <section id="bottom-navigation" className="block fixed inset-x-0 bottom-0 z-10 bg-[#171A24]">
        <div id="tabs" className="flex justify-between items-center">
        <Tooltip title="Home" arrow>
          <Link to="/papertrade/app" className="w-full focus:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <div className="inline-block p-2 hover:bg-[#2A2E36] rounded-full transition duration-300">
              <RiHome2Fill className="text-white w-7 h-7 mb-1" />
            </div>
          </Link>
          </Tooltip>

          <Tooltip title="Market" arrow>
          <Link to="/papertrade/app/market" className="w-full focus:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <div className="inline-block p-2 hover:bg-[#2A2E36] rounded-full transition duration-300">
              <AiOutlineBarChart className="text-white w-7 h-7 mb-1" />
            </div>
          </Link>
          </Tooltip>

          <Tooltip title="Portfolio" arrow>
          <Link to="/papertrade/app/portfolio" className="w-full focus:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <div className="inline-block p-2 hover:bg-[#2A2E36] rounded-full transition duration-300">
              <RiBarChart2Line className="text-white w-7 h-7 mb-1" />
            </div>
          </Link>
          </Tooltip>

          <Tooltip title="Watchlist" arrow>
          <Link to="/papertrade/app/watchlist" className="w-full focus:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <div className="inline-block p-2 hover:bg-[#2A2E36] rounded-full transition duration-300">
              <IoEyeOutline className="text-white w-7 h-7 mb-1" />
            </div>
          </Link>
          </Tooltip>
        </div>
      </section>
    </div>
  );
};

export default TabNavigation;
