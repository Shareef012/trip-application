// Logo.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

const Logo = () => {
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
        <Link to="/signin">Sign In</Link>
      </div>
    </div>
  );
};

export default Logo;
