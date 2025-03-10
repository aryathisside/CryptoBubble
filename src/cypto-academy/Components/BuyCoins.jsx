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

const BuyCoins = ({ data }) => {

  const { currentUser } = useAuth();
  const [coinValue, setCoinValue] = useState(1);
  const [coinUsdPrice, setCoinUsdPrice] = useState(data?.market_data?.current_price.usd);
  const [orderLoading, setOrderLoading] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState({});
  const [selectedCrypto, setSelectedCrypto] = useState("");

  const availableUsdCoins = useSelector((state) => state.availableCoins);
  const dispatch = useDispatch();
  const [maxPrice, setmaxPrice] = useState(null);
  const [minPrice, setminPrice] = useState(null);
  const navigate = useNavigate();

  console.log('buy data', selectedCoin);

  useEffect(() => {
    const updatedData = selectedCrypto
      ? data.filter((coin) => coin.id === selectedCrypto)
      : data;
    setSelectedCoin(updatedData);
  }, [selectedCrypto]); 

  useEffect(() => {
    dispatch(fetchAvailableCoins(currentUser.uid));
  }, [currentUser.uid, dispatch]);

  const changeCoinValue = (e) => {
    setCoinValue(e.target.value);
    setCoinUsdPrice(data.market_data.current_price.usd * e.target.value);
  };

  const changeUsdValue = (e) => {
    setCoinUsdPrice(e.target.value);
    setCoinValue(e.target.value / data.market_data.current_price.usd);
  };

  const changemaxPrice = (e) => {
    setmaxPrice(e.target.value);
  };
  const changeminPrice = (e) => {
    setminPrice(e.target.value);
  };

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
        throw new Error(result.error || 'Failed to update transaction history.');
      }

      console.log('Transaction added successfully:', result.message);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  async function onPlaceOrder() {
    try {
      setOrderLoading(true);
      // get available coins and check if it is lesser than what we want to purchase
      let { data: availableUsdCoin } = await supabase
        .from('portfolio')
        .select('coinId,coinName,amount')
        .eq('userId', `${currentUser.uid}`)
        .eq('coinId', 'USD');

      const transaction = {
        type: 'buy',
        coinId: `${selectedCoin[0].id}`,
        symbol: `${selectedCoin[0].symbol}`,
        coinValue: `${coinValue}`,
        coinUsdPrice: `${coinUsdPrice}`,
        timestamp: new Date().toISOString()
      };

      if (coinUsdPrice > availableUsdCoin[0].amount) {
        throw new Error('Not enough coins!');
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
          .eq('coinId', `${selectedCoin[0].id}`);

        // deduct the value from virtual usd
        let updatedUsdValue = availableUsdCoin[0].amount - coinUsdPrice;

        let { data: updateUsdCoin, error: updateUsdCoinError } = await supabase
          .from('portfolio')
          .update({ amount: parseFloat(updatedUsdValue) })
          .eq('userId', `${currentUser.uid}`)
          .eq('coinId', 'USD');

        if (updateExistingCoinErr || updateUsdCoinError) {
          throw new Error('Something went wrong!');
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
        alert('Coin purchased successfully');
        navigate('/papertrade/app/portfolio');
        return;
      }

      // If coin is not already in the portfolio, add the purchased coin
      const { error: addToPortfolioError } = await supabase.from('portfolio').insert([
        {
          userId: `${currentUser.uid}`,
          coinId: `${selectedCoin[0].id}`,
          coinSymbol: `${selectedCoin[0].symbol}`,
          coinName: `${selectedCoin[0].name}`,
          image: `${selectedCoin[0].image}`,
          amount: `${coinUsdPrice}`,
          coinAmount: `${coinValue}`,
          maxPrice: maxPrice, // Store max price if provided
          minPrice: minPrice // Store min price if provided
        }
      ]);

      if (addToPortfolioError) {
        throw new Error('Something went wrong, Please try again!');
      }

      // deduct the value from virtual usd
      let updatedUsdValue = availableUsdCoin[0].amount - coinUsdPrice;
      let { error: updateUsdCoinError } = await supabase
        .from('portfolio')
        .update({ amount: updatedUsdValue })
        .eq('userId', `${currentUser.uid}`)
        .eq('coinId', 'USD');

      if (updateUsdCoinError) {
        throw new Error('Something went wrong!');
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
      // setModal(false);
      alert('Coin purchased successfully');
      navigate('/papertrade/app/portfolio');
    } catch (error) {
      setOrderLoading(false);
      alert(error);
    }
  }
  // async function onPlaceOrder() {
  //     try {
  //       setOrderLoading(true);
  //       // get available coins and check if it is lesser than what we want to purchase
  //       let { data: availableUsdCoin } = await supabase
  //         .from('portfolio')
  //         .select('coinId,coinName,amount')
  //         .eq('userId', `${currentUser.uid}`)
  //         .eq('coinId', 'USD');

  //       const transaction = {
  //         type: 'buy',
  //         coinId: data.id,
  //         coinValue: coinValue,
  //         coinUsdPrice: coinUsdPrice,
  //         timestamp: new Date().toISOString()
  //       };

  //       if (coinUsdPrice > availableUsdCoin[0].amount) {
  //         throw new Error('Not enough coins!');
  //       }

  //       // check if the coin is already purchased i.e. add the coin amount coin to our existing coin in portfolio db
  //       let { data: existingCoin } = await supabase.from('portfolio')
  //         .select('coinId,coinName,amount,coinAmount')
  //         .eq('userId', `${currentUser.uid}`)
  //         .eq('coinId', `${data.id}`);

  //       if (existingCoin.length !== 0) {
  //         let { data: updateExistingCoin, error: updateExistingCoinErr } = await supabase
  //           .from('portfolio')
  //           .update({
  //             amount: `${Number(existingCoin[0].amount) + Number(coinUsdPrice)}`,
  //             coinAmount: `${Number(existingCoin[0].coinAmount) + Number(coinValue)}`
  //           })
  //           .eq('userId', `${currentUser.uid}`)
  //           .eq('coinId', `${data.id}`);

  //         // deduct the value from virtual usd
  //         let updatedUsdValue = availableUsdCoin[0].amount - coinUsdPrice;
  //         let { data: updateUsdCoin, error: updateUsdCoinError } = await supabase
  //           .from('portfolio')
  //           .update({ amount: parseFloat(updatedUsdValue) })
  //           .eq('userId', `${currentUser.uid}`)
  //           .eq('coinId', 'USD');

  //         if (updateExistingCoinErr || updateUsdCoinError) {
  //           throw new Error('Something went wrong!');
  //         }

  //         // calculate net worth
  //         let { data: portfolioData } = await supabase.from('portfolio').select('*').eq('userId', `${currentUser.uid}`);
  //         const userNetworth = portfolioData.reduce((previousValue, currentCoin) => previousValue + currentCoin.amount, 0);

  //         await supabase
  //           .from('users')
  //           .update({ networth: parseFloat(userNetworth) })
  //           .eq('userId', `${currentUser.uid}`);

  //         // Add transaction to history
  //         await addTransactionToHistory(transaction);  // Added here

  //         setOrderLoading(false);
  //         setModal(false);
  //         alert('Coin purchased successfully');
  //         navigate('papertrade/app/portfolio');
  //         return;
  //       }

  //       // If coin is not already in the portfolio, add the purchased coin
  //       const { error: addToPortfolioError } = await supabase.from('portfolio').insert([{
  //         userId: `${currentUser.uid}`,
  //         coinId: `${data.id}`,
  //         coinSymbol: `${data.symbol}`,
  //         coinName: `${data.name}`,
  //         image: `${data.image.large}`,
  //         amount: `${coinUsdPrice}`,
  //         coinAmount: `${coinValue}`
  //       }]);

  //       if (addToPortfolioError) {
  //         throw new Error('Something went wrong, Please try again!');
  //       }

  //       // deduct the value from virtual usd
  //       let updatedUsdValue = availableUsdCoin[0].amount - coinUsdPrice;
  //       let { error: updateUsdCoinError } = await supabase.from('portfolio')
  //         .update({ amount: updatedUsdValue })
  //         .eq('userId', `${currentUser.uid}`)
  //         .eq('coinId', 'USD');

  //       if (updateUsdCoinError) {
  //         throw new Error('Something went wrong!');
  //       }

  //       // calculate net worth
  //       let { data: portfolioData } = await supabase.from('portfolio').select('*').eq('userId', `${currentUser.uid}`);
  //       const userNetworth = portfolioData.reduce((previousValue, currentCoin) => previousValue + currentCoin.amount, 0);

  //       await supabase
  //         .from('users')
  //         .update({ networth: parseFloat(userNetworth) })
  //         .eq('userId', `${currentUser.uid}`);

  //       // Add transaction to history
  //       await addTransactionToHistory(transaction);  // Added here

  //       setOrderLoading(false);
  //       setModal(false);
  //       alert('Coin purchased successfully');
  //       navigate('/papertrade/app/portfolio');

  //     } catch (error) {
  //       setOrderLoading(false);
  //       alert(error);
  //     }
  // }

  return (
    //  Large Modal
    <div className="bg-[#171A24] py-6 px-4 rounded-[12px] mb-4">
      <div className="flex w-full gap-2 pb-4 border-b-2 border-[#2A2E36]">
        <button className="flex-1 bg-[#CFA935] text-white border-2 border-[#CFA935] rounded py-2">Buy</button>
        <button className="flex-1 text-white border-2 rounded border-[#2A2E36] py-2">Sell</button>
      </div>
      <div className="flex justify-between text-white mt-4">
        <div>
          <div className="text-sm text-[#A9A9A9]">1 BTC</div>
          <div className="text-md font-bold">$ {selectedCoin[0]?.current_price}</div>
        </div>
        <div>
          <div className="text-sm text-[#A9A9A9]">Available Balance</div>
          <div className="text-md font-bold"> $ 4,100,000s</div>
        </div>
      </div>

      <div>
        <div className="relative flex py-2  border-[#2A2E36] border rounded-lg mt-3 mb-2">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <img src={selectedCoin[0]?.image} alt="coin" className="h-5 w-5" />
          </div>
          <div className='w-3/4'>
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
          <div className="w-1/4 pr-2">
            <select
              className="w-full text-sm bg-transparent border-none text-white focus:ring-0 focus:outline-none cursor-pointer"
              onChange={(e) => setSelectedCrypto(e.target.value)}
              value={selectedCrypto}
              >
              {data && data?.map((coin, index) => (
                <option key={index} value={coin.id} className="bg-[#171A24] text-white">
                   <img src={usd} alt="coin" className="h-5 w-5" />
                  <span>{`${coin.symbol}`.toUpperCase()}</span>
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* <BsArrowLeftRight className="h-4 w-4 text-white m-auto hidden md:block" /> */}

        <BsArrowDownUp className="h-4 w-4 text-white m-auto" />

        {/* usd value */}
        <div className="relative py-2 mt-2">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <img src={usd} alt="usd price" className="h-5 w-5" />
          </div>
          <input
            type="number"
            min="0"
            id="coinUsdValue"
            name="coinUsdValue"
            value={coinUsdPrice}
            onChange={changeUsdValue}
            className=" border   text-sm rounded-lg block w-full pl-10 p-3  bg-[#171A24] border-[#2A2E36] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
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
      <button className="text-white w-full flex justify-center items-center bg-[#CFA935] p-2 rounded mt-4 gap-2 font-bold" onClick={onPlaceOrder}>
        <FaShoppingCart />
        Buy this crypto
      </button>
    </div>
    // <div
    //   className={`${
    //     !modal && "hidden"
    //   } flex flex-col fixed left-0 right-0 top-[200px] md:top-0 z-50 justify-center items-center bg-black bg-opacity-50 h-auto md:h-screen`}
    //   id="large-modal"
    // >
    //   <div className="relative px-4 w-full max-w-xl h-full md:h-auto">
    //     {/* Modal content  */}
    //     <div className="relative  rounded-xl shadow bg-[#171A24]">
    //       {/* Modal header  */}
    //       <div className="flex justify-between items-center px-5 py-3 md:p-5 rounded-t-xl border-b border-gray-600 bg-[#2A2E36]">
    //         <h3 className="text-md md:text-xl font-medium  text-white">
    //           Buy {data.name} | <span className="uppercase">{data.symbol}</span>
    //         </h3>
    //         <button
    //           type="button"
    //           className="text-gray-400 bg-transparent  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white"
    //           data-modal-toggle="large-modal"
    //           onClick={() => setModal(false)}
    //         >
    //           <AiOutlineClose className="w-5 h-5" />
    //         </button>
    //       </div>
    //       {/* Modal body  */}
    //       <div className="px-6 py-3 md:p-6">
    //         <div className="md:flex justify-between">
    //           <p className="text-base leading-relaxed font-semibold text-gray-200">
    //           1 <span className="uppercase">{data.symbol}</span> ={" "}
    //           {data.market_data.current_price.usd} USD
    //           </p>

    //           <p className="text-base leading-relaxed font-semibold text-gray-200">
    //           Available Balance ={" "}
    //           {availableUsdCoins.status === "success" ? availableUsdCoins.data.amount : 0} USD
    //           </p>
    //         </div>
    //         <div className="md:flex">
    //           <div className="relative py-4">
    //             <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
    //               <img src={data?.image?.small} alt={data.name} className="h-5 w-5" />
    //             </div>
    //             <input
    //               type="number"
    //               id="coinValue"
    //               name="coinValue"
    //               min="0"
    //               value={coinValue}
    //               onChange={changeCoinValue}
    //               className=" border text-sm rounded-lg block w-full pl-10 p-2.5 bg-[#171A24] border-[#2A2E36] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
    //             />
    //           </div>

    //           <BsArrowLeftRight className="h-4 w-4 text-white m-auto hidden md:block" />

    //           <BsArrowDownUp className="h-4 w-4 text-white m-auto block md:hidden" />

    //           {/* <BsArrowDownUp className="h-4 w-4 text-white m-auto"/> */}

    //           {/* usd value */}
    //           <div className="relative py-4">
    //             <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
    //               <img src={usd} alt="usd price" className="h-5 w-5" />
    //             </div>
    //             <input
    //               type="number"
    //               min="0"
    //               id="coinUsdValue"
    //               name="coinUsdValue"
    //               value={coinUsdPrice}
    //               onChange={changeUsdValue}
    //               className=" border text-sm rounded-lg block w-full pl-10 p-2.5 bg-[#171A24] border-[#2A2E36] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
    //             />
    //           </div>
    //         </div>

    //         <div className="md:flex justify-between">
    //           <p className="text-base leading-relaxed font-semibold text-gray-200">
    //           Max Price
    //           </p>

    //           <p className="text-base leading-relaxed font-semibold text-gray-200">
    //          Min Price
    //           </p>
    //         </div>
    //         <div className="md:flex">
    //           <div className="relative py-4">
    //             <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
    //               <img src={usd} alt="usd price" className="h-5 w-5" />
    //             </div>
    //             <input
    //               type="number"
    //               id="maxPrice"
    //               name="maxPrice"
    //               min="0"
    //               value={maxPrice}
    //               onChange={changemaxPrice}
    //               className=" border text-sm rounded-lg block w-full pl-10 p-2.5 bg-[#171A24] border-[#2A2E36] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
    //             />
    //           </div>

    //           <BsArrowLeftRight className="h-4 w-4 text-white m-auto hidden md:block" />

    //           <BsArrowDownUp className="h-4 w-4 text-white m-auto block md:hidden" />

    //           {/* <BsArrowDownUp className="h-4 w-4 text-white m-auto"/> */}

    //           {/* usd value */}
    //           <div className="relative py-4">
    //             <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
    //               <img src={usd} alt="usd price" className="h-5 w-5" />
    //             </div>
    //             <input
    //               type="number"
    //               min="0"
    //               id="minPrice"
    //               name="minPrice"
    //               value={minPrice}
    //               onChange={changeminPrice}
    //               className=" border text-sm rounded-lg block w-full pl-10 p-2.5 bg-[#171A24] border-[#2A2E36] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
    //             />
    //           </div>
    //         </div>
    //       </div>
    //       {/* Modal footer  */}
    //       <div className="flex justify-center items-center  px-6 py-3 md:p-4 space-x-2 rounded-b">
    //         <button
    //           data-modal-toggle="large-modal"
    //           type="button"
    //           disabled={orderLoading}
    //           className="text-white flex items-center gap-2 bg-[#CFA935] hover:bg-[#CFA935] focus:ring-4 focus:ring-blue-800 font-medium rounded-lg px-5 py-2 text-center mb-2 border-2 border-[#CFA935]"
    //           onClick={onPlaceOrder}
    //         >
    //           <FaCartShopping />
    //           <span>{orderLoading ? `Buying ${data.name}...` : `Buy ${data.name}`}</span>
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default BuyCoins;
