import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: ''
  });

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const email = Cookies.get('email');
      if (!email) {
        console.log("The Email Cookie is Missing, please sign in");
        navigate("/signin");
        return;
      }

      const response = await fetch(`https://trip-application-server.onrender.com/profile-data?email=${email}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        if (Array.isArray(responseData) && responseData.length > 0) {
          const userData = responseData[0];
          console.log("the response data is .....\n"+responseData[0]);
          console.log("Profile Data:", JSON.stringify(userData));
          console.log("The user data is new: ", JSON.stringify(userData[0]));
          setProfileData({
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            mobile: userData.mobile
          });
          if (userData.redirectUrl) {
            console.log("Redirecting to ... " + userData.redirectUrl);
          }
        } else {
          console.log("No profile data received from the server");
        }
      } else {
        console.error("Failed to fetch profile data. Response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching or parsing profile data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevProfileData) => ({
      ...prevProfileData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://trip-application-server.onrender.com/update-profile?firstname=${profileData.firstname}&lastname=${profileData.lastname}&mobile=${profileData.mobile}&email=${profileData.email}`, {
        method: 'POST',
        mode: 'cors',
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
        navigate("/home");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const photoPath = "trip/profile.jpeg";

  return (
    <div>
      <form onSubmit={handleSubmit} method='post'>
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
