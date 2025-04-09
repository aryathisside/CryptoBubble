import { Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import SidebarLayout from "./SidebarLayout";
import NotFound404 from "../../cypto-academy/routes/NotFound404";
// import Login from "../../cypto-academy/routes/Login";
// import Signup from "../../cypto-academy/routes/Signup";
// import ResetPassword from "../../cypto-academy/routes/ResetPassword";
// import ForgotPassword from "../../cypto-academy/routes/ForgotPassword";
// import CoinMarket from "../../cypto-academy/routes/CoinMarket";
import CoinMarket from "../../cypto-academy/routes/CoinMarket";
// import News from "../../cypto-academy/routes/News";
import CurrencyDetailsPage from "../../cypto-academy/routes/CurrencyDetailsPage";
import Watchlist from "../../cypto-academy/routes/Watchlist";
import Portfolio from "../../cypto-academy/routes/Portfolio";
import Dashboard from "../../cypto-academy/routes/Dashboard";
import UserProfile from "../../cypto-academy/routes/UserProfile";
import Search from "../../cypto-academy/routes/Search";
// import AiPredections from "../../cypto-academy/routes/AiPredections";
import Learn from "../../cypto-academy/routes/Learn";
import Leaderboard from "../../cypto-academy/routes/Leaderboard";
import MoreMobileNavPage from "../../cypto-academy/routes/MoreMobileNavPage";
import FAQ from "../../cypto-academy/routes/FAQ";
import GlobalStats from "../../cypto-academy/routes/GlobalStats";
import VirtualUsdPage from "../../cypto-academy/routes/VirtualUsdPage";
import Loader from "./Loader";
import NewsPage from "../routes/NewsPage";
import TradeHistory from "../routes/TradeHistory";

// const Login = lazy(() => import("../../cypto-academy/routes/Login"));
// const Signup = lazy(() => import("../../cypto-academy/routes/Signup"));
// const ResetPassword = lazy(() => import("../../cypto-academy/routes/ResetPassword"));
// const ForgotPassword = lazy(() => import("../../cypto-academy/routes/ForgotPassword"));

// const CoinMarket = lazy(() => import("../../cypto-academy/routes/CoinMarket"));
// const News = lazy(() => import("../../cypto-academy/routes/News"));
// const CurrencyDetailsPage = lazy(() => import("../../cypto-academy/routes/CurrencyDetailsPage"));
// const Watchlist = lazy(() => import("../../cypto-academy/routes/Watchlist"));
// const Portfolio = lazy(() => import("../../cypto-academy/routes/Portfolio"));
// const Dashboard = lazy(() => import("../../cypto-academy/routes/Dashboard"));
// const UserProfile = lazy(() => import("../../cypto-academy/routes/UserProfile"));
// const Search = lazy(() => import("../../cypto-academy/routes/Search"));
// const AiPredections = lazy(() => import("../../cypto-academy/routes/AiPredections"));
// const Learn = lazy(() => import("../../cypto-academy/routes/Learn"));
// const Leaderboard = lazy(() => import("../../cypto-academy/routes/Leaderboard"));
// const MoreMobileNavPage = lazy(() => import("../../cypto-academy/routes/MoreMobileNavPage"));
// const FAQ = lazy(() => import("../../cypto-academy/routes/FAQ"));
// const GlobalStats = lazy(() => import("../../cypto-academy/routes/GlobalStats"));
// const VirtualUsdPage = lazy(() => import("../../cypto-academy/routes/VirtualUsdPage"));

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    // <div className="App scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100 bg-black">
    <AnimatePresence mode={"wait"}>
      <Routes location={location} key={location.pathname}>
        {/* <Route
          path="/papertrade"
          element={
            <Suspense fallback={<Loader />}>
              <Login />
            </Suspense>
          }
        /> */}
        <Route
          element={
            <ProtectedRoute>
              
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/papertrade/app" element={<Dashboard />} />
          <Route path="/papertrade/app/market" element={<CoinMarket />} />
          <Route path="/papertrade/app/search" element={<Search />} />
          <Route path="/papertrade/app/leaderboard" element={<Leaderboard />} />
          {/* <Route path="/app/ai" element={<AiPredections />} /> */}
          <Route path="/papertrade/app/coin/USD" element={<VirtualUsdPage />} />
          <Route path="/papertrade/app/coin/:id" element={<CurrencyDetailsPage />} />
          {/* <Route path="/papertrade/app/news" element={<News />} /> */}
          <Route path="/papertrade/app/watchlist" element={<Watchlist />} />
          <Route path="/papertrade/app/news" element={<NewsPage />} />
          <Route path="/papertrade/app/tradeHistory" element={<TradeHistory />} />
          <Route path="/papertrade/app/portfolio" element={<Portfolio />} />
          <Route path="/papertrade/app/learn" element={<Learn />} />
          <Route path="/papertrade/app/profile" element={<UserProfile />} />
          <Route path="/papertrade/app/more" element={<MoreMobileNavPage />} />
          <Route path="/papertrade/app/faq" element={<FAQ />} />
          <Route path="/papertrade/app/market/globalStats" element={<GlobalStats />} />
        </Route>
        {/* <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/market"
          element={
            <ProtectedRoute>
              <CoinMarket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/ai"
          element={
            <ProtectedRoute>
              <AiPredections />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/coin/USD"
          element={
            <ProtectedRoute>
              <VirtualUsdPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/coin/:id"
          element={
            <ProtectedRoute>
              <CurrencyDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/news"
          element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/learn"
          element={
            <ProtectedRoute>
              <Learn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/more"
          element={
            <ProtectedRoute>
              <MoreMobileNavPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/faq"
          element={
            <ProtectedRoute>
              <FAQ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/market/globalStats"
          element={
            <ProtectedRoute>
              <GlobalStats />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/papertrade/signup"
          element={
            <Suspense fallback={<Loader />}>
              <Signup />
            </Suspense>
          }
        />
        <Route
          path="/papertrade/resetPassword"
          element={
            <Suspense fallback={<Loader />}>
              <ResetPassword />
            </Suspense>
          }
        />
        <Route
          path="/papertrade/forgotPassword"
          element={
            <Suspense fallback={<Loader />}>
              <ForgotPassword />
            </Suspense>
          }
        /> */}
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </AnimatePresence>
    // </div>
  );
};

export default AnimatedRoutes;
