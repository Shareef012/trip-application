import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Sidebar from "./Sidebar";
import Home from "./Home";
import PlanTrip from "./PlanTrip";
import CancelTrip from "./CancelTrip";
import About from "./About";
import Profile from "./Profile";
import Logo from "./Logo";
import Signin from "./Signin";
import Payment from "./Payment";
import "./App.css"; // Import your CSS file
import Register from "./Register";
import Cookies from "js-cookie";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Check if the user is logged in on component mount
    setIsLoggedIn(emailCookie());
  }, []);
  const handleLogin = () =>{
    setIsLoggedIn(true);
  }
  const handleLogout = () => {
    // Update isLoggedIn state to false upon logout
    setIsLoggedIn(false);
  };

  const emailCookie = () => {
    const cookieEmail = Cookies.get("email");
    return cookieEmail !== undefined;
  };

  return (
    <Router>
      <div className="app">
        <Logo />
        <div className="container">
        <Sidebar handleLogout={handleLogout} />
          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/signin" />} />
              <Route
                path="/home"
                element={<Home />}
              />
              <Route
                path="/plantrip"
                element={ <PlanTrip /> }
              />
              <Route
                path="/canceltrip"
                element={
                 <CancelTrip />
                }
              />
              <Route path="/about" element={<About />} />
              <Route
                path="/profile"
                element={ <Profile /> }
              />
              <Route
                path="/signin"
                element={<Signin onLogin={handleLogin} />}
              />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
