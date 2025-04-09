import { useRef, useState } from "react";
import { useNavigate } from "react-router";

import ErrorToast from "../ErrorToast";
import { useAuth } from "../../../Context/AuthContext";
import useDataStore from '../../../store/useDataStore';
const Logout = () => {
  const { logout } = useDataStore();
  let navigate = useNavigate();

  const toastRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);

  async function logoutHandler() {
    try {
      await logout();
      console.log("logged out user successfully");
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
      toastRef.current.show();
      console.log(error);
    }
  }
  return (
    <>
      <ErrorToast message={errorMessage} ref={toastRef} />
      <button
        type="button"
        onClick={logoutHandler}
        className="text-[#FF3333] my-2 font-semibold rounded-lg text-md px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 font-text"
      >
        Log Out
      </button>
    </>
  );
};

export default Logout;
