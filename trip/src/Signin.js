import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './signin.css';
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';

const Signin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const [redirect, setRedirect] = useState(false);

    navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
            const response = await fetch('https://trip-application-server.onrender.com/Signin', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
            });

            if (response.ok) {
                // Login successful, update state and trigger redirection
                setLoginError(null);
                Cookies.set('email', username);
                const data = await response.json();
                console.log('Profile update response:', data);
                if (data.redirectUrl) {
                  console.log('Redirecting to:', data.redirectUrl);
                  console.log('Redirection completed');
                  // Redirect the user to the specified URL
                  navigate("/home");
            
                  // Log a message after redirection
                  
                }// Set redirect to true after successful login
            } else {
                // Login failed, display error message
                setLoginError('Invalid username or password.');
            }
        
    };

    if (redirect) {
        // Redirect to home page after successful login
        return <Navigate to="/home" />;
    }

    return (
        <div className='container'>
            <form onSubmit={handleSubmit} method='post'>
                <table className='resultTable'>
                    <tr>
                        <th><label>Username: </label></th>
                        <td><input type="text" name="username" value={username} className='customSelect' onChange={(e) => setUsername(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <th><label>Password </label></th>
                        <td><input type="password" name="password" value={password} className='customSelect' onChange={(e) => setPassword(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td> <button type="submit" name="submit" value="Login" className='btn'>Signin</button></td>
                    </tr>
                    <tr>
                        <td> Don't have an account? <Link to="/register">Register Here</Link></td>
                    </tr>
                </table>
            </form>
            {loginError && <p>{loginError}</p>}
        </div>
    );
};

export default Signin;
