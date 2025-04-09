import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { AiOutlineClose } from 'react-icons/ai';
import { BsArrowDownUp, BsArrowLeftRight } from 'react-icons/bs';

import usd from '../Assets/svg/USD.svg';
import { useAuth } from '../../Context/AuthContext';
import { supabase } from '../Utils/init-supabase';
import { fetchAvailableCoins } from '../Features/availableCoins';
import { FaCartShopping } from 'react-icons/fa6';
import { FaShoppingCart } from 'react-icons/fa';
import { useGetCoinsDataQuery } from '../services/coinsDataApi';
import { toast } from 'react-toastify';

const BuySingleCoinModal = ({ data, modal, setModal }) => {
  // const [currency, setCurrency] = useState('usd');
  // const [currentPage, setCurrentPage] = useState(1);

  // // const [page, setPage] = useState(1);

  // const { data, error, isLoading, isSuccess } = useGetCoinsDataQuery({ currency, currentPage }, { pollingInterval: 300000 });

  const { currentUser } = useAuth();
  const [coinValue, setCoinValue] = useState(1);
  const [coinUsdPrice, setCoinUsdPrice] = useState(Number(data?.market_data?.current_price.usd));
  const [orderLoading, setOrderLoading] = useState(false);
  //   const [selectedCoin, setSelectedCoin] = useState(data[0]);
  //   const [selectedCrypto, setSelectedCrypto] = useState('');

  const availableUsdCoins = useSelector((state) => state.availableCoins);
  const dispatch = useDispatch();
  const [maxPrice, setmaxPrice] = useState(null);
  const [minPrice, setminPrice] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [tab, setTab] = useState(1);
  const [availabeCoinAmt, setAvailabeCoinAmt] = useState(0);
  const navigate = useNavigate();

  console.log('buy data', data);

  // async function getCoinsData() {
  //   try {
  //     const response = await fetch(`${process.env.SIMULATOR_API}/coins/markets`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     const result = await response.json();

  //     if (!response.ok) {
  //       throw new Error(result.error || 'Failed to fetch trade history.');
  //     }
  //     console.log('Trade history:', result);
  //     // return result.history; // Returns the trade history array
  //     // setTradeHistory(result.history);
  //     // setCurrentPage(1);
  //   } catch (error) {
  //     console.error('Error fetching trade history:', error.message);
  //     // setTradeError(error.message);
  //   } finally {
  //     // setTradeLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   getCoinsData();
  // }, []);

  useEffect(() => {
    dispatch(fetchAvailableCoins(currentUser.uid));
  }, [currentUser.uid, dispatch]);

  const changeCoinValue = (e) => {
    setCoinValue(Number(e.target.value));
    setCoinUsdPrice(Number(data.market_data.current_price.usd * e.target.value));
  };

  const changeUsdValue = (e) => {
    setCoinUsdPrice(Number(e.target.value));
    setCoinValue(Number(e.target.value / data.market_data.current_price.usd));
  };

  const changemaxPrice = (e) => {
    setmaxPrice(Number(e.target.value));
  };
  const changeminPrice = (e) => {
    setminPrice(Number(e.target.value));
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    dispatch(fetchAvailableCoins(currentUser.uid));
    // get amount of coin that you have purchased
    async function coinAmount() {
      let {
        data: availableCoinAmount
        // , error
      } = await supabase.from('portfolio').select('coinName,coinAmount').eq('userId', `${currentUser.uid}`).eq('coinId', `${data.id}`);
      if (availableCoinAmount.length !== 0) {
        setAvailabeCoinAmt(availableCoinAmount[0].coinAmount);
      }
    }
    coinAmount();
  }, [currentUser.uid, data.id, dispatch]);

  // async function addTransactionToHistory(transaction) {
  //   // Fetch current history and append new transaction
  //   let { data: userData, error: fetchUserError } = await supabase
  //     .from('users')
  //     .select('history')
  //     .eq('userId', `${currentUser.uid}`)
  //     .single();

  //   if (fetchUserError) {
  //     throw new Error('Failed to fetch user history.');
  //   }

  //   const updatedHistory = userData?.history ? [...userData.history, transaction] : [transaction];

  //   // Update user's history
  //   const { error: updateHistoryError } = await supabase
  //     .from('users')
  //     .update({ history: updatedHistory })
  //     .eq('userId', `${currentUser.uid}`);

  //   if (updateHistoryError) {
  //     throw new Error('Failed to update transaction history.');
  //   }
  // }
  async function addTransactionToHistory(transaction) {
    try {
      const response = await fetch(`${process.env.SIMULATOR_API}/save-trade-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser.uid, // Ensure `currentUser.uid` is available
          transaction: transaction
        })
      });

      const result = await response.json();

      if (!response.ok) {
        // throw new Error(result.error || 'Failed to update transaction history.');
        toast.error(result.error || 'Failed to update transaction history.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setOrderLoading(false);
        return;
        
      }

      console.log('Transaction added successfully:', result.message);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  async function onPlaceSellOrder() {
    try {
      setOrderLoading(true);
      // get available coins and check if it coin amount is more than what we want to sell
         if(coinValue <= 0 || coinUsdPrice <= 0) {
              toast.error('Please Enter a Valid Coin Value!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
              setOrderLoading(false);
              return;
            }

      if (coinValue > availabeCoinAmt) {
        // throw new Error('Not enough coins!');
        toast.error('Not enough coins!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setOrderLoading(false);
        return;
      }

      // check if the coin is already purchased i.e. add the coin amount  to our existing coin in portfolio db

      // update the sold coin to database
      const portfolioUsdAmount = data.market_data.current_price.usd * (availabeCoinAmt - coinValue);
      const updatedCoinAmount = availabeCoinAmt - coinValue;

      const {
        // data: removefromPortfolio,
        error: removefromPortfolioError
      } = await supabase
        .from('portfolio')
        .update([
          {
            amount: `${portfolioUsdAmount.toFixed(3)}`,
            coinAmount: `${updatedCoinAmount.toFixed(3)}`
          }
        ])
        .eq('userId', `${currentUser.uid}`)
        .eq('coinId', `${data.id}`);

      if (removefromPortfolioError) {
        // throw new Error('Something went wrong, Please try again!');
        toast.error('Something went wrong, Please try again!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setOrderLoading(false);
        return;
      }

      // add the value to virtual usd
      let updatedUsdValue = availableUsdCoins.data.amount + coinUsdPrice;

      let {
        // data: updateUsdCoin,
        error: updateUsdCoinError
      } = await supabase.from('portfolio').update({ amount: updatedUsdValue }).eq('userId', `${currentUser.uid}`).eq('coinId', 'USD');

      if (updateUsdCoinError) {
        // throw new Error('Something went wrong!');
        toast.error('Something went wrong!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setOrderLoading(false);
        return;
      }

      // delete the portfolio from db if the coinValue is 0
      if (updatedCoinAmount === 0) {
        // const {data: deleteRow, error: errorRow } =
        await supabase.from('portfolio').delete().eq('userId', `${currentUser.uid}`).eq('coinId', `${data.id}`);
      }

      // Add transaction to history
      const transaction = {
        type: 'sell',
        coinId: `${data.id}`,
        symbol: `${data.symbol}`,
        coinValue: `${coinValue}`,
        coinUsdPrice: `${coinUsdPrice}`,
        timestamp: new Date().toISOString()
      };

      await addTransactionToHistory(transaction); // Added here

      // calculate networth
      let { data: portfolioData } = await supabase.from('portfolio').select('*').eq('userId', `${currentUser.uid}`);

      const userNetworth = portfolioData.reduce((previousValue, currentCoin) => previousValue + currentCoin.amount, 0);

      const { data: updateNetworth, error: updateErr } = await supabase
        .from('users')
        .update({ networth: parseFloat(userNetworth) })
        .eq('userId', `${currentUser.uid}`);

      setOrderLoading(false);
      setModal(false);
      toast.success("Coin Sold Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      // alert('Coin Sold Successfully');
      navigate('/papertrade/app/portfolio');
    } catch (error) {
      setOrderLoading(false);
      // alert(error);
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }

  async function onPlaceOrder() {
    try {
      setOrderLoading(true);
      // get available coins and check if it is lesser than what we want to purchase
         if(coinValue <= 0 || coinUsdPrice <= 0) {
              toast.error('Please Enter a Valid Coin Value!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
              setOrderLoading(false);
              return;
            }
            
      let { data: availableUsdCoin } = await supabase
        .from('portfolio')
        .select('coinId,coinName,amount')
        .eq('userId', `${currentUser.uid}`)
        .eq('coinId', 'USD');

      const transaction = {
        type: 'buy',
        coinId: `${data.id}`,
        symbol: `${data.symbol}`,
        coinValue: `${coinValue}`,
        coinUsdPrice: `${coinUsdPrice}`,
        timestamp: new Date().toISOString()
      };

      if (coinUsdPrice > availableUsdCoin[0].amount) {
        // throw new Error('Not enough coins!');
        toast.error('Not enough coins!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setOrderLoading(false);
        return;
      }

          if (isChecked && (minPrice <= 0 || maxPrice <= 0 || minPrice >= data?.market_data?.current_price?.usd)) {
             // throw new Error('Please Enter a Valid Limit!');
             toast.error('Minimum price must be less than the current market price.', {
               position: "top-right",
               autoClose: 3000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "dark",
             });
             setOrderLoading(false);
             return;
           }
   
           if (isChecked && (minPrice <= 0 || maxPrice <= 0 || maxPrice <= data?.market_data?.current_price?.usd)) {
             // throw new Error('Please Enter a Valid Limit!');
             toast.error('Maximum price must be greater than the current market price.', {
               position: "top-right",
               autoClose: 3000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "dark",
             });
             setOrderLoading(false);
             return;
           }

      // check if the coin is already purchased i.e. add the coin amount coin to our existing coin in portfolio db
      let {
        data: existingCoin
        // error: existingCoinErr
      } = await supabase.from('portfolio').select('coinId,coinName,amount,coinAmount').eq('userId', `${currentUser.uid}`).eq('coinId', `${data.id}`);

      if (existingCoin.length !== 0) {
        console.log('running this');
        let { data: updateExistingCoin, error: updateExistingCoinErr } = await supabase
          .from('portfolio')
          .update({
            amount: `${Number(existingCoin[0].amount) + Number(coinUsdPrice)}`,
            coinAmount: `${Number(existingCoin[0].coinAmount) + Number(coinValue)}`,
            maxPrice: maxPrice ?? existingCoin[0].maxPrice, // Keep existing value if not provided
            minPrice: minPrice ?? existingCoin[0].minPrice // Keep existing value if not provided
          })
          .eq('userId', `${currentUser.uid}`)
          .eq('coinId', `${data.id}`);

        // deduct the value from virtual usd
        let updatedUsdValue = availableUsdCoin[0].amount - coinUsdPrice;

        let { data: updateUsdCoin, error: updateUsdCoinError } = await supabase
          .from('portfolio')
          .update({ amount: parseFloat(updatedUsdValue) })
          .eq('userId', `${currentUser.uid}`)
          .eq('coinId', 'USD');

        if (updateExistingCoinErr || updateUsdCoinError) {
          // throw new Error('Something went wrong!');
          toast.error('Something went wrong!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setOrderLoading(false);
          return;
        }

        // calculate net worth
        let { data: portfolioData } = await supabase.from('portfolio').select('*').eq('userId', `${currentUser.uid}`);
        const userNetworth = portfolioData.reduce((previousValue, currentCoin) => previousValue + currentCoin.amount, 0);

        await supabase
          .from('users')
          .update({ networth: parseFloat(userNetworth) })
          .eq('userId', `${currentUser.uid}`);

        // Add transaction to history
        await addTransactionToHistory(transaction); // Added here

        setOrderLoading(false);
        setModal(false);
        // alert('Coin purchased successfully');
        toast.success('Coin purchased successfully', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        navigate('/papertrade/app/portfolio');
        return;
      }

      // If coin is not already in the portfolio, add the purchased coin
      const { error: addToPortfolioError } = await supabase.from('portfolio').insert([
        {
          userId: `${currentUser.uid}`,
          coinId: `${data.id}`,
          coinSymbol: `${data.symbol}`,
          coinName: `${data.name}`,
          image: `${data.image.large}`,
          amount: `${coinUsdPrice}`,
          coinAmount: `${coinValue}`,
          maxPrice: maxPrice, // Store max price if provided
          minPrice: minPrice // Store min price if provided
        }
      ]);

      if (addToPortfolioError) {
        // throw new Error('Something went wrong, Please try again!');
        toast.error('Something went wrong, Please try again!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setOrderLoading(false);
        return;
      }

      // deduct the value from virtual usd
      let updatedUsdValue = availableUsdCoin[0].amount - coinUsdPrice;
      let { error: updateUsdCoinError } = await supabase
        .from('portfolio')
        .update({ amount: updatedUsdValue })
        .eq('userId', `${currentUser.uid}`)
        .eq('coinId', 'USD');

      if (updateUsdCoinError) {
        // throw new Error('Something went wrong!');
        toast.error('Something went wrong!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setOrderLoading(false);
        return;
      }

      // calculate net worth
      let { data: portfolioData } = await supabase.from('portfolio').select('*').eq('userId', `${currentUser.uid}`);
      const userNetworth = portfolioData.reduce((previousValue, currentCoin) => previousValue + currentCoin.amount, 0);

      await supabase
        .from('users')
        .update({ networth: parseFloat(userNetworth) })
        .eq('userId', `${currentUser.uid}`);

      // Add transaction to history
      await addTransactionToHistory(transaction); // Added here

      setOrderLoading(false);
      setModal(false);
      // alert('Coin purchased successfully');
      toast.success('Coin purchased successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      navigate('/papertrade/app/portfolio');
    } catch (error) {
      setOrderLoading(false);
      // alert(error);
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }

  return (
    //  Large Modal
    <div
      className={`${
        !modal && 'hidden'
      } flex flex-col fixed left-0 right-0 top-[20px] md:top-0 z-50 justify-center items-center bg-black bg-opacity-50 h-full md:h-screen`}
      id="large-modal">
      <div className="relative px-4 w-full max-w-xl h-full md:h-auto">
        <div className="bg-[#171A24] py-6 px-4 rounded-[12px] mb-4">
          <button
            type="button"
            className="flex justify-end text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto hover:bg-gray-600 hover:text-white"
            data-modal-toggle="large-modal"
            onClick={() => setModal(false)}>
            <AiOutlineClose className="w-5 h-5" />
          </button>
          <div className="flex w-full gap-2 pb-4 border-b-2 border-[#2A2E36]">
            <button
              className={`flex-1 py-2 border-2 rounded ${
                tab === 1 ? 'bg-[#CFA935] text-white border-[#CFA935]' : 'bg-transparent text-white border-[#2A2E36]'
              }`}
              onClick={() => setTab(1)}>
              Buy
            </button>

            {/* Sell Button */}
            <button
              className={`flex-1 py-2 border-2 rounded ${
                tab === 2 ? 'bg-[#CFA935] text-white border-[#CFA935]' : 'bg-transparent text-white border-[#2A2E36]'
              }`}
              onClick={() => setTab(2)}>
              Sell
            </button>
          </div>
          {tab === 1 ? (
            <div>
              <div className="flex justify-between text-white mt-4">
                <div>
                  <div className="text-sm text-[#A9A9A9]">1{`${data?.symbol}`.toUpperCase()}</div>
                  <div className="text-md font-bold">$ {data.market_data.current_price.usd}</div>
                </div>
                <div>
                  <div className="text-sm text-[#A9A9A9]">Available Balance</div>
                  <div className="text-md font-bold"> $ {availableUsdCoins.status === 'success' ? availableUsdCoins.data.amount : 0}</div>
                </div>
              </div>

              <div>
                <div className="relative flex py-2 buy-border border rounded-lg mt-3 mb-2">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <img src={data?.image?.small} alt="coin" className="h-5 w-5" />
                  </div>
                  <div className="w-3/4">
                    <input
                      type="text"
                      id="coinValue"
                      name="coinValue"
                      min="0"
                      value={coinValue}
                      onChange={changeCoinValue}
                      className=" text-sm block w-full pl-12 py-2 bg-[#171A24] placeholder-gray-400 text-white border-none focus:outline-none"
                    />
                  </div>
                  {/* <div className="w-1/4 pr-2">
                <select
                  className="w-full text-sm bg-transparent border-none text-white focus:ring-0 focus:outline-none cursor-pointer"
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  value={selectedCrypto}>
                  {data &&
                    data?.map((coin, index) => (
                      <option key={index} value={coin.id} className="bg-[#171A24] text-white">
                        <img src={usd} alt="coin" className="h-5 w-5" />
                        <span>{`${coin.symbol}`.toUpperCase()}</span>
                      </option>
                    ))}
                </select>
              </div> */}
                </div>

                {/* <BsArrowLeftRight className="h-4 w-4 text-white m-auto hidden md:block" /> */}

                <BsArrowDownUp className="h-4 w-4 text-white m-auto" />

                {/* usd value */}
                <div>
                  <div className="relative flex py-2 mt-2 buy-border border rounded-lg mt-3 mb-2">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <img src={usd} alt="usd price" className="h-5 w-5" />
                    </div>
                    <div>
                      <input
                        type="text"
                        min="0"
                        id="coinUsdValue"
                        name="coinUsdValue"
                        value={coinUsdPrice}
                        onChange={changeUsdValue}
                        className="text-sm block w-full pl-12 py-2  bg-[#171A24] placeholder-gray-400 text-white border-none focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <label className="flex items-center space-x-2 my-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-white appearance-none bg-[#171A24] border-2 buy-border rounded checked:bg-[#CFA935] checked:border-[#CFA935] focus:ring-2 focus:ring-[#2A2E36] cursor-pointer"
                  />
                  <span className="text-sm text-gray-300">Set Limit</span>
                </label>
                {isChecked && (
                  <div>
                    <div className="flex justify-between">
                      <p className="text-base leading-relaxed font-semibold text-gray-200">Take Profit</p>

                      <p className="text-base leading-relaxed font-semibold text-gray-200">Set Stop loss</p>
                    </div>
                    <div className="md:flex gap-2">
                      <div className="relative py-4">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                          <img src={usd} alt="usd price" className="h-5 w-5" />
                        </div>
                        <input
                          type="number"
                          id="maxPrice"
                          name="maxPrice"
                          min="0"
                          value={maxPrice}
                          onChange={changemaxPrice}
                          className=" border text-sm rounded-lg block w-full pl-10 p-2.5 bg-[#171A24] buy-border placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <BsArrowLeftRight className="h-4 w-4 text-white m-auto hidden md:block" />

                      <BsArrowDownUp className="h-4 w-4 text-white m-auto block md:hidden" />

                      {/* <BsArrowDownUp className="h-4 w-4 text-white m-auto"/> */}

                      {/* usd value */}
                      <div className="relative py-4">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                          <img src={usd} alt="usd price" className="h-5 w-5" />
                        </div>
                        <input
                          type="number"
                          min="0"
                          id="minPrice"
                          name="minPrice"
                          value={minPrice}
                          onChange={changeminPrice}
                          className=" border text-sm rounded-lg block w-full pl-10 p-2.5 bg-[#171A24] buy-border placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                className="text-white w-full flex justify-center items-center bg-[#CFA935] p-2 rounded mt-4 gap-2 font-bold"
                onClick={onPlaceOrder}
                disabled={orderLoading}>
                <FaShoppingCart />
                {/* Buy this crypto */}
                <span>{orderLoading ? `Buying this crypto` : `Buy this crypto`}</span>
              </button>
            </div>
          ) : (
            <div>
              {' '}
              <div className="flex justify-between text-white mt-4">
                <div>
                  <div className="text-sm text-[#A9A9A9]">1{`${data?.symbol}`.toUpperCase()}</div>
                  <div className="text-md font-bold">$ {data.market_data.current_price.usd}</div>
                </div>
                <div>
                  <div className="text-sm text-[#A9A9A9]">Available Balance</div>
                  <div className="text-md font-bold"> $ {availableUsdCoins.status === 'success' ? availableUsdCoins.data.amount : 0}</div>
                </div>
              </div>
              <div>
                <div className="relative flex py-2  buy-border border rounded-lg mt-3 mb-2">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <img src={data?.image?.small} alt="coin" className="h-5 w-5" />
                  </div>
                  <div className="w-3/4">
                    <input
                      type="text"
                      id="coinValue"
                      name="coinValue"
                      min="0"
                      value={coinValue}
                      onChange={changeCoinValue}
                      className=" text-sm block w-full pl-12 py-2 bg-[#171A24] placeholder-gray-400 text-white border-none focus:outline-none"
                    />
                  </div>
                  {/* <div className="w-1/4 pr-2">
                <select
                  className="w-full text-sm bg-transparent border-none text-white focus:ring-0 focus:outline-none cursor-pointer"
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  value={selectedCrypto}>
                  {data &&
                    data?.map((coin, index) => (
                      <option key={index} value={coin.id} className="bg-[#171A24] text-white">
                        <img src={usd} alt="coin" className="h-5 w-5" />
                        <span>{`${coin.symbol}`.toUpperCase()}</span>
                      </option>
                    ))}
                </select>
              </div> */}
                </div>

                {/* <BsArrowLeftRight className="h-4 w-4 text-white m-auto hidden md:block" /> */}

                <BsArrowDownUp className="h-4 w-4 text-white m-auto" />

                {/* usd value */}
                <div>
                  <div className="relative flex py-2 mt-2 buy-border border rounded-lg mt-3 mb-2">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <img src={usd} alt="usd price" className="h-5 w-5" />
                    </div>
                    <div>
                      <input
                        type="text"
                        min="0"
                        id="coinUsdValue"
                        name="coinUsdValue"
                        value={coinUsdPrice}
                        onChange={changeUsdValue}
                        className="text-sm block w-full pl-12 py-2  bg-[#171A24] placeholder-gray-400 text-white border-none focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="relative  py-2 mt-2">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <img src={usd} alt="usd price" className="h-5 w-5" />
              </div>
              <div>
                <input
                  type="text"
                  min="0"
                  id="coinUsdValue"
                  name="coinUsdValue"
                  value={coinUsdPrice}
                  onChange={changeUsdValue}
                  className=" border   text-sm rounded-lg block w-full pl-10 p-3  bg-[#171A24] border-[#2A2E36] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div> */}
                <label className="flex items-center space-x-2 my-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-white appearance-none bg-[#171A24] border-2 buy-border rounded checked:bg-[#CFA935] checked:border-[#CFA935] focus:ring-2 focus:ring-[#2A2E36] cursor-pointer"
                  />
                  <span className="text-sm text-gray-300">Set Limit</span>
                </label>
                {isChecked && (
                  <div>
                    <div className="flex justify-between">
                      <p className="text-base leading-relaxed font-semibold text-gray-200">Take Profit</p>

                      <p className="text-base leading-relaxed font-semibold text-gray-200">Set Stop loss</p>
                    </div>
                    <div className="md:flex gap-2">
                      <div className="relative py-4">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                          <img src={usd} alt="usd price" className="h-5 w-5" />
                        </div>
                        <input
                          type="number"
                          id="maxPrice"
                          name="maxPrice"
                          min="0"
                          value={maxPrice}
                          onChange={changemaxPrice}
                          className=" border text-sm rounded-lg block w-full pl-10 p-2.5 bg-[#171A24] buy-border placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <BsArrowLeftRight className="h-4 w-4 text-white m-auto hidden md:block" />

                      <BsArrowDownUp className="h-4 w-4 text-white m-auto block md:hidden" />

                      {/* <BsArrowDownUp className="h-4 w-4 text-white m-auto"/> */}

                      {/* usd value */}
                      <div className="relative py-4">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                          <img src={usd} alt="usd price" className="h-5 w-5" />
                        </div>
                        <input
                          type="number"
                          min="0"
                          id="minPrice"
                          name="minPrice"
                          value={minPrice}
                          onChange={changeminPrice}
                          className=" border text-sm rounded-lg block w-full pl-10 p-2.5 bg-[#171A24] buy-border placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                className="text-white w-full flex justify-center items-center bg-[#CFA935] p-2 rounded mt-4 gap-2 font-bold"
                onClick={onPlaceSellOrder}
                disabled={orderLoading}>
                <FaShoppingCart />
                {/* Buy this crypto */}
                <span>{orderLoading ? `Selling this crypto` : `Sell this crypto`}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuySingleCoinModal;
