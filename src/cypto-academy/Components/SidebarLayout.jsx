import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router";

import Sidebar from "./Sidebar";
import TabNavigation from "./TabNavigation";
import { Suspense } from "react";
import Loader from "./Loader";
import Header from "./Header";

const SidebarLayout = () => {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState("");

  useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location]);

  return (
    <div className="bg-black ">
      {/* desktop dasboard */}

      <div className="">
      <Header />
        {/* <Sidebar active={currentLocation?.slice(5) === "" ? `home` : currentLocation?.slice(5)} /> */}
        {/* page transitions */}
        <motion.div
          intial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: "-100%" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="main flex flex-col flex-grow lg:ml-0 transition-all duration-150 ease-in bg-black"
        >
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </motion.div>
      </div>
      <TabNavigation />
    </div>
  );
};

export default SidebarLayout;
