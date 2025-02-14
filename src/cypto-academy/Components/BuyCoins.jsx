import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { AiOutlineClose } from "react-icons/ai";
import { BsArrowDownUp, BsArrowLeftRight } from "react-icons/bs";

import usd from "../Assets/svg/USD.svg";
import { useAuth } from "../../Context/AuthContext";
import { supabase } from "../Utils/init-supabase";
import { fetchAvailableCoins } from "../Features/availableCoins";
import { FaCartShopping } from 'react-icons/fa6';

const BuyCoins = ({ data, modal, setModal }) => {
  const { currentUser } = useAuth();
  const [coinValue, setCoinValue] = useState(1);
  const [coinUsdPrice, setCoinUsdPrice] = useState(data.market_data.current_price.usd);
  const [orderLoading, setOrderLoading] = useState(false);

  const availableUsdCoins = useSelector((state) => state.availableCoins);
  const dispatch = useDispatch();

  const navigate = useNavigate();

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

  async function onPlaceOrder() {
    try {
      setOrderLoading(true);
      // get available coins and check if it is lesser than what we want to purchase
      let { data: availableUsdCoin } = await supabase
        .from("portfolio")
        .select("coinId,coinName,amount")
        .eq("userId", `${currentUser.uid}`)
        .eq("coinId", "USD");

      if (coinUsdPrice > availableUsdCoin[0].amount) {
        throw new Error("Not enough coins!");
      }

      // check if the coin is already purchased i.e. add the coin amount coin to our existing coin in portfolio db
      let {
        data: existingCoin
        // error: existingCoinErr
      } = await supabase
        .from("portfolio")
        .select("coinId,coinName,amount,coinAmount")
        .eq("userId", `${currentUser.uid}`)
        .eq("coinId", `${data.id}`);

      if (existingCoin.length !== 0) {
        console.log("running this");
        let { data: updateExistingCoin, error: updateExistingCoinErr } = await supabase
          .from("portfolio")
          .update({
            amount: `${Number(existingCoin[0].amount) + Number(coinUsdPrice)}`,
            coinAmount: `${Number(existingCoin[0].coinAmount) + Number(coinValue)}`
          })
          .eq("userId", `${currentUser.uid}`)
          .eq("coinId", `${data.id}`);

        // deduct the value from virtual usd
        let updatedUsdValue = availableUsdCoin[0].amount - coinUsdPrice;

        let { data: updateUsdCoin, error: updateUsdCoinError } = await supabase
          .from("portfolio")
          .update({ amount: parseFloat(updatedUsdValue) })
          .eq("userId", `${currentUser.uid}`)
          .eq("coinId", "USD");

        // calculate networth
        let { data: portfolioData } = await supabase
          .from("portfolio")
          .select("*")
          .eq("userId", `${currentUser.uid}`);

        const userNetworth = portfolioData.reduce(
          (previousValue, currentCoin) => previousValue + currentCoin.amount,
          0
        );

        const { data: updateNetworth, error: updateErr } = await supabase
          .from("users")
          .update({ networth: parseFloat(userNetworth) })
          .eq("userId", `${currentUser.uid}`);

        console.log(updateNetworth, userNetworth, portfolioData, updateUsdCoin);

        if (updateExistingCoin) {
          setOrderLoading(false);
          setModal(false);
          alert("Coin purchased successfully");
          navigate("papertrade/app/portfolio");
          return;
        }
        if (updateExistingCoinErr) {
          throw new Error("Something went wrong, Please try again!");
        }
      } else {
        console.log("running that");
        // if not already present add the purchased coin to database
        const {
          // data: addToPortfolio,
          error: addToPortfolioError
        } = await supabase.from("portfolio").insert([
          {
            userId: `${currentUser.uid}`,
            coinId: `${data.id}`,
            coinSymbol: `${data.symbol}`,
            coinName: `${data.name}`,
            image: `${data.image.large}`,
            amount: `${coinUsdPrice}`,
            coinAmount: `${coinValue}`
          }
        ]);

        if (addToPortfolioError) {
          throw new Error("Something went wrong, Please try again!");
        }

        // deduct the value from virtual usd
        let updatedUsdValue = availableUsdCoin[0].amount - coinUsdPrice;

        let {
          // data: updateUsdCoin,
          error: updateUsdCoinError
        } = await supabase
          .from("portfolio")
          .update({ amount: updatedUsdValue })
          .eq("userId", `${currentUser.uid}`)
          .eq("coinId", "USD");

        if (updateUsdCoinError) {
          throw new Error("Something went wrong!");
        }

        // calculate networth
        let { data: portfolioData } = await supabase
          .from("portfolio")
          .select("*")
          .eq("userId", `${currentUser.uid}`);

        const userNetworth = portfolioData.reduce(
          (previousValue, currentCoin) => previousValue + currentCoin.amount,
          0
        );

        const { data: updateNetworth, error: updateErr } = await supabase
          .from("users")
          .update({ networth: parseFloat(userNetworth) })
          .eq("userId", `${currentUser.uid}`);

        console.log(updateNetworth, userNetworth);
        setOrderLoading(false);
        setModal(false);
        alert("Coin purchased successfully");
        navigate("/papertrade/app/portfolio");
      }
    } catch (error) {
      setOrderLoading(false);
      alert(error);
    }
  }
  return (
    //  Large Modal
    <div
      className={`${
        !modal && "hidden"
      } flex flex-col fixed left-0 right-0 top-[200px] md:top-0 z-50 justify-center items-center bg-black bg-opacity-50 h-auto md:h-screen`}
      id="large-modal"
    >
      <div className="relative px-4 w-full max-w-xl h-full md:h-auto">
        {/* Modal content  */}
        <div className="relative  rounded-xl shadow bg-[#171A24]">
          {/* Modal header  */}
          <div className="flex justify-between items-center px-5 py-3 md:p-5 rounded-t-xl border-b border-gray-600 bg-[#2A2E36]">
            <h3 className="text-md md:text-xl font-medium  text-white">
              Buy {data.name} | <span className="uppercase">{data.symbol}</span>
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white"
              data-modal-toggle="large-modal"
              onClick={() => setModal(false)}
            >
              <AiOutlineClose className="w-5 h-5" />
            </button>
          </div>
          {/* Modal body  */}
          <div className="px-6 py-3 md:p-6">
            <div className="md:flex justify-between">
            <p className="text-base leading-relaxed font-semibold text-gray-200">
              1 <span className="uppercase">{data.symbol}</span> ={" "}
              {data.market_data.current_price.usd} USD
            </p>

            <p className="text-base leading-relaxed font-semibold text-gray-200">
              Available Balance ={" "}
              {availableUsdCoins.status === "success" ? availableUsdCoins.data.amount : 0} USD
            </p>
            </div>
            <div className="md:flex">

            <div className="relative py-4">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <img src={data?.image?.small} alt={data.name} className="h-5 w-5" />
              </div>
              <input
                type="number"
                id="coinValue"
                name="coinValue"
                min="0"
                value={coinValue}
                onChange={changeCoinValue}
                className=" border text-sm rounded-lg block w-full pl-10 p-2.5 bg-[#171A24] border-[#2A2E36] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
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
                id="coinUsdValue"
                name="coinUsdValue"
                value={coinUsdPrice}
                onChange={changeUsdValue}
                className=" border text-sm rounded-lg block w-full pl-10 p-2.5 bg-[#171A24] border-[#2A2E36] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            </div>
          </div>
          {/* Modal footer  */}
          <div className="flex justify-center items-center  px-6 py-3 md:p-4 space-x-2 rounded-b">
            <button
              data-modal-toggle="large-modal"
              type="button"
              disabled={orderLoading}
               className="text-white flex items-center gap-2 bg-[#CFA935] hover:bg-[#CFA935] focus:ring-4 focus:ring-blue-800 font-medium rounded-lg px-5 py-2 text-center mb-2 border-2 border-[#CFA935]"
              onClick={onPlaceOrder}
            >
              <FaCartShopping />
              <span>{orderLoading ? `Buying ${data.name}...` : `Buy ${data.name}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCoins;
