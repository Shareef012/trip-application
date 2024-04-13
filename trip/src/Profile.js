import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: ''
  });

  // Function to fetch data from the backend
  const fetchData = () => {
    fetch("http://localhost:3001/personal", {
        method : 'GET',
      mode: 'cors',
      credentials: 'include'
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
        const response = await fetch(`http://localhost:3001/update-profile?firstname=${profileData.firstname}&lastname=${profileData.lastname}&mobile=${profileData.mobile}&email=${profileData.email}`, {
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
      } catch (error) {
        console.error('Error updating profile:', error);
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
