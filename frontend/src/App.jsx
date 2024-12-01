import React, { useState, useEffect } from "react";
import axios from "axios";
import FlowChart from "./components/FlowChart";
import LoginSignup from "./components/LoginSignup";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/status`,
          { withCredentials: true }
        );
        if (response.status === 200) setLoggedIn(true);
      } catch {
        setLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setLoggedIn(false);
    } catch (error) {
      alert("Error logging out");
    }
  };

  return (
    <div className="flex flex-col h-dvh w-dvw text-[#153448]">
      {loggedIn ? (
        <>
        <div className="flex justify-end">
          <button onClick={handleLogout} className="logout-btn mr-0" >
            Logout
          </button>
        </div>
        <div className="h-dvh w-dvw text-[#153448]">
        <div className="w-[350px] md:w-[650px] h-[600px] mx-auto">
        <h1 className="text-xl md:text-3xl text-center font-bold">
         Automated Email Sequencer
       </h1>
      <FlowChart />
     </div>
    </div>
          {/* <FlowChart /> */}
        </>
      ) : (
        <LoginSignup setLoggedIn={setLoggedIn} />
      )}
    </div>
  );
}

export default App;
