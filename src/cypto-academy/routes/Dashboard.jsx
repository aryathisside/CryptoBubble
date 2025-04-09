import { lazy } from "react";
import { useLocation } from "react-router";

// import DesktopDashboard from "../Components/DesktopDashboard";
const DesktopDashboard = lazy(() => import("../Components/DesktopDashboard"));

const Dashboard = () => {
  const location = useLocation();

  return (
    <section className="lg:px-6 p-2 lg:py-8">
      {/* <p className="text-white font-bold text-2xl md:text-3xl font-title pt-6 md:pt-0 mb-4 ml-3 px-2 md:px-4">
        Welcome to Dashboard
      </p> */}

      <DesktopDashboard userNetworth={location.state?.userNetworth}
        availableCoins={location.state?.availableCoins} />
    </section>
  );
};

export default Dashboard;
