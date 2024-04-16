import React from "react";
import { useState, useEffect } from "react";
import './CancelTrip.css';


const CancelTrip = () => {
  const [records, setRecords] = useState([]);

  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === name) {
        return cookieValue;
      }
    }
    return null;
  }


  const fetchData = () => {
    fetch("http://localhost:3001/data", {
      mode: 'cors',
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRecords(data[0]);
      })
      .catch((error) => console.log(error));
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = (flightname) =>{
    const cookieName = getCookie('email');
    fetch(`http://localhost:3001/datadelete?cookiename=${cookieName}&flightname=${flightname}`,{
      method :"POST",
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({cookiename: cookieName,
        flightname: flightname,
        _method: 'DELETE'}
      )
    }).then(response => {
      if(response) {
        console.log(response.json.status);
        fetchData();
      }

    })
  }

  return (
    <div>
      <table className="canceltable">
      {records.map((list, index) => (
        <tbody className="cancelcard">
          
            <React.Fragment key={index}>
              <tr>
                <th>Flight Name</th>
                <td>{list.flightname}</td>
              </tr>
              <tr>
                <th>From Location</th>
                <td>{list.from_location}</td>
              </tr>
              <tr>
                <th>To Location</th>
                <td>{list.to_location}</td> {/* Corrected to use td */}
              </tr>
              <tr>
                <th>Cost</th>
                <td>{list.cost}</td> {/* Corrected to use td */}
              </tr>
              <tr>
                <th>No of Tickets</th>
                <td>{list.numtickets}</td> {/* Corrected to use td */}
              </tr>
              <tr>
                <th>Trip Type</th>
                <td>{list.triptype}</td>
              </tr>
              {list.triptype === "return" && (
                <tr>
                  <th>Return Date</th>
                  <td>{list.returndate}</td>
                </tr>
              )}
            </React.Fragment>
            <tr>
              <td colSpan="2">
                <button onClick={() => handleCancel(list.flightname)}>Cancel Trip</button>
              </td>
            </tr>
        </tbody>
        ))}
      </table>{" "}
    </div>
  );
};
export default CancelTrip;
