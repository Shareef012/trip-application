// Logo.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';
import Cookies from 'js-cookie';


const Logo = () => {
  const emailCookie = Cookies.get('email');
  return (
    <div className="header">
      <div className="left-content">
        <img
          src="https://imgs.search.brave.com/BPob-LQV3K78T0Ax_nW3yX8sMgEWOWDryaIP7j8A_10/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzEzLzQzLzg2/LzM2MF9GXzMxMzQz/ODY3OV80cm92VUlF/WktiQzZ4b29UdE1u/ZDA0Z1ZjYnBSQXA1/NC5qcGc"
          alt="Company Logo"
          className="logo"
        />
        <h1>SKS</h1>
      </div>
      <div className="right-content">
        {emailCookie ? (
          // Render welcome message with cookie value if 'email' cookie exists
          <p>Welcome {emailCookie}</p>
        ) : (
          // Render a link to the Sign In page if 'email' cookie does not exist
          <Link to="/signin">Sign In</Link>
        )}
      </div>
    </div>
  );
};

export default Logo;
