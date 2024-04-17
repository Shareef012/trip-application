import React, { useEffect, useState } from 'react';
import './Profile.css';
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie'

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: ''
  });

  const navigate = useNavigate();

  // Function to fetch data from the backend
  const fetchData = () => {
    fetch(`https://trip-application-server.onrender.com/personal?email=${Cookies.get("email")}`, {
        method : 'POST',
      mode: 'cors'
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
        setProfileData({
            firstname: data[0].firstname,
            lastname: data[0].lastname,
            email: data[0].email,
            mobile: data[0].mobile
        });
      })
      .catch((error) => console.log(error));
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevProfileData) => ({
      ...prevProfileData,
      [name]: value
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`https://trip-application-server.onrender.com/update-profile?firstname=${profileData.firstname}&lastname=${profileData.lastname}&mobile=${profileData.mobile}&email=${profileData.email}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(profileData)
        });
      
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      
        const data = await response.json();
        console.log('Profile update response:', data);
        if (data.redirectUrl) {
          console.log('Redirecting to:', data.redirectUrl);
    
          // Redirect the user to the specified URL
          navigate("/home");
    
          // Log a message after redirection
          console.log('Redirection completed');
        }
      } catch (error) {
        console.log('Error updating profile:', error);
      }
  };

  // Fixed photo path
  const photoPath = "trip/profile.jpeg";

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <table className='profiletable'>
          <tr>
            <th rowSpan={1}></th>
            <th>
              <img src="https://th.bing.com/th?id=OIP.ByNkifVPWm-R7eYaW4BdpgHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" alt="profile" />
            </th>
          </tr>
          <tr>
            <th>First Name</th>
            <td><input type='text' name="firstname" value={profileData.firstname} className='normal' onChange={handleInputChange} /></td>
          </tr>
          <tr>
            <th>Last Name</th>
            <td><input type='text' name="lastname" value={profileData.lastname} className='normal' onChange={handleInputChange} /></td>
          </tr>
          <tr>
            <th>Email</th>
            <td><input type='email' name='email' readOnly value={profileData.email} className='normal' /></td>
          </tr>
          <tr>
            <th>Phone Number</th>
            <td><input type='text' name='mobile' value={profileData.mobile} onChange={handleInputChange} className='normal' /></td>
          </tr>
          <tr>
            <td colSpan={1}></td>
            <td><input type='submit' name="submit" value='Update' className='bttn' /></td>
          </tr>
        </table>
      </form>
    </div>
  );
};

export default Profile;
