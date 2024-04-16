import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import Cookies from "js-cookie";

const Sidebar = ({ handleLogout }) => {
  const handleLogoutClick = () => {
    Cookies.remove("email");
    handleLogout(); // Call the handleLogout function passed from App.js
  };

  return (
    <div className="SideBar">
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/plantrip">Plan Trip</Link>
        </li>
        <li>
          <Link to="/canceltrip">Cancel Trip</Link>
        </li>
        
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
        <Link to="/signin">Sign In</Link>
        </li>
        <li>
          <Link to="/signin" onClick={handleLogoutClick}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
