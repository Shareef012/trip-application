// Register.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
      const response = await fetch('http://localhost:3001/register',{
        method : 'post',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:password,
            mobile:mobile
        })
    })

    if(response.ok){
        console.log("Registration Succesfull")
        window.location.href='/signin';
    }
    else{
        console.log("Not succesfull....");
    }
    }catch(err){
      console.log("Registration is unsuccessful......");
    }
  }


  return (
    <div className='container'>
      <h2 className=''>Register</h2>
      <form  method="post" onSubmit={handleSubmit}>
        <table className='resultTable'>
          <tbody>
            <tr>
              <th>
                <label htmlFor="firstName">First Name:</label>
              </th>
              <td>
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  className='customSelect'
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="lastName">Last Name:</label>
              </th>
              <td>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  className='customSelect'
                  onChange={(e) => setLastName(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="email">Email:</label>
              </th>
              <td>
                <input
                  type="email"
                  name="email"
                  value={email}
                  className='customSelect'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="password">Password:</label>
              </th>
              <td>
                <input
                  type="password"
                  name="password"
                  value={password}
                  className='customSelect'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="mobile">Mobile:</label>
              </th>
              <td>
                <input
                  type="text"
                  name="mobile"
                  value={mobile}
                  className='customSelect'
                  onChange={(e) => setMobile(e.target.value)}
                />
              </td>
            </tr>
            <tr>
                <td><input type='submit' value='Register' className='btn' /></td>
            </tr>
            <tr>
                <td> Already have an account? <Link to="/Signin">Login here</Link></td>
            </tr>
          </tbody>
        </table>
        
      </form>
      <p>
       
      </p>
    </div>
  );
}

export default Register;
