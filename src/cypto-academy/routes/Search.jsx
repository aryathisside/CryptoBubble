import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import Loader from "../Components/Loader";
import { debounce } from "../Utils/debounce";

const Search = () => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchData, setSearchData] = useState({});

  const navigate = useNavigate();

  const debouncedSearchResult = useCallback(
    debounce(async (search) => {
      if (search) {
        try {
          setIsLoading(true);
          const res = await fetch(`https://api.coingecko.com/api/v3/search?query=${search}`,{
            headers: {
              'x-cg-demo-api-key': process.env.COINGECKO_KEY
            }
          });

          if (!res.ok) {
            throw new Error("Something went wrong! Please try again");
          }

          const data = await res.json();

          setSearchData(data);
          setIsLoading(false);
        } catch (error) {
          setError(error.message);
        }
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearchResult(search);
  }, [search]);
  console.log("search", searchData);

  return (
    <section className="lg:px-4 py-4 lg:py-8 max-w-[1600px] font-text p-2 bg-black">
      {/* search Bar */}
      <div className="md:px-4">
        <label for="table-search" className="sr-only">
          Search
        </label>
        <div className="relative mt-1">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className=" border w-full text-sm rounded-lg  block  pl-10 p-2.5  bg-black border-[#2A2E36] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for Cryptocurrency..."
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500 text-md">Something went wrong!</p>
      ) : (
        <ul className="md:px-4 flex flex-col space-y-1 pb-12 font-text text-white">
          <li className="grid grid-cols-2 md:grid-cols-2 text-gray-500 py-3 px-1md:px-5 cursor-pointer bg-[#171A24] rounded-lg mt-4">
            <div className="flex justify-start items-center space-x-4 ">
            <p className="text-white pl-4">Name</p>
            </div>
            <div className="flex justify-end ml-auto pr-4 items-center space-x-4 w-20">
            <p className="text-white pl-4">Rank</p>
            </div>
          </li>
          {searchData !== undefined &&
            searchData?.coins?.map((coin, index) => (
              <li
                onClick={() => navigate(`/papertrade/app/coin/${coin.id}`)}
                key={index}
                style={{height:"60px"}}
                className="grid grid-cols-2 md:grid-cols-2 text-gray-500 py-2 px-1md:px-5 hover:bg-gray-900 rounded-lg cursor-pointer border-gray-800 "
              >
                <div className="flex items-center justify-start text-sm space-x-4 pl-4">
                  <img src={coin.large} alt={`${coin.name}`} className="w-7 h-7" />
                  <div className="">
                    <p className="text-white text-md font-bold ">{coin.name}</p>
                    <p className="text-white text-xs">{coin.symbol}</p>
                  </div>
                </div>
                <div className="pl-4 flex justify-end items-center space-x-4 w-20 ml-auto pr-4">
                  <p className="text-white font-medium pl-4">{coin.market_cap_rank}</p>
                </div>
              </li>
            ))}
        </ul>
      )}
    </section>
  );
};

export default Search;
