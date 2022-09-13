import React, { useState, useEffect } from 'react';
import Vacation from "./vacation";

function Vacations() {
  const [vacations, setVacations] = useState([]);

  useEffect(() => {
    fetch('http://api.localhost:3033/vacations')
      .then(res => {
        if (res.ok) {
          return  res.json();
        }

        return Promise.reject({
          status: res.status,
          statusText: res.statusText
        });
      })
      .then(setVacations)
      .catch(err => {
        console.log(err);
      })
  }, []);
  
  return (
    <>
     <h2>Туры</h2> 
     <div className="vacations">
        {
          vacations.map(vacation => {
           return <Vacation key={vacation.sku} vacation={vacation}/>
          })
        }
     </div>
    </>
  )
}

export default Vacations;