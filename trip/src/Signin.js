import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './signin.css';
import Cookies from 'js-cookie';

const Signin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const [redirect, setRedirect] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/Signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (response.ok) {
                // Login successful, update state and trigger redirection
                setLoginError(null);
                Cookies.set('email', username);
                setRedirect(true); // Set redirect to true after successful login
            } else {
                // Login failed, display error message
                setLoginError('Invalid username or password.');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setLoginError('Something went wrong. Please try again.');
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
