import React, { useEffect, useState } from 'react';
import newsImage from '../Assets/images/PiNetwork.png';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowRoundForward } from 'react-icons/io';
import DynamicPagination from '../../components/common/Pagination';
import Loader from '../Components/Loader';

const NewsPage = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;


  async function getSimulatorNews() {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.SIMULATOR_API}/getNews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch trade history.');
      }

      console.log('news :', result?.data?.results);
      setNewsData(result?.data?.results);
      setCurrentPage(1);
      setLoading(false);
      //   return result.history; // Returns the trade history array
    } catch (error) {
        console.error('Error fetching trade history:', error.message);
      return [];
    }
  }

  useEffect(() => {
    getSimulatorNews();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsData?.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="bg-[#171A24] md:max-w-full py-6 px-4 rounded-[12px] m-4">
        <div className="md:flex justify-between">
          <div>
            <p className="text-white font-bold text-xl md:text-2xl font-title lg:mt-0 mb-2 ml-3">News</p>
            <p className="text-[#A9A9A9] text-sm  font-title lg:mt-0 ml-3">Stay up to date with all the crypto news in the world.</p>
          </div>
          {/* <div className="md:px-4">
            <label for="table-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"></path>
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="w-full mb-4 sm:w-auto text-sm rounded-lg block pl-10 p-2.5 bg-[#171A24] border-2 border-[#2A2E36] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for Cryptocurrency..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div> */}
        </div>
      </div>
      {/* <div className="md:px-4 mb-2 ml-2">
        <button className="border-2 border-[#CFA935] text-[#CFA935] p-2 rounded">Market Cap</button>
      </div> */}
      {loading && <Loader />}
      {!loading && <> 
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 m-4">
       {currentItems?.map((news, index) => (
          <div key={index} className="flex flex-col rounded-xl">
            <img src={newsImage} alt="crypto" className="w-full h-auto rounded-2xl" />
            <div className="text-white mt-2">{news?.source?.title}</div>
            <div className="text-[#A9A9A9] text-sm mt-2 mb-2 line-clamp-2">{news?.title}</div>
            <Link to={news?.url} target="_blank" rel="noopener noreferrer" className="text-[#CFA935] hover:underline">
              Read more &gt;&gt;
            </Link>
          </div>
        ))}
      </div>
      <DynamicPagination totalItems={newsData?.length} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </>}
    </div>
  );
};

export default NewsPage;
