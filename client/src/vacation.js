import React from 'react'
import NotifyWhenIsSeason from './notify-when-is-season';

function Vacation({vacation}) {
  return (
    <div key={vacation.sku}>
      <h3>{vacation.name}</h3>
      <p>{vacation.description}</p>
      <span className="price">{vacation.price}</span>
      {!vacation.inSeason && 
        <div>
          <p><i>Этот тур временно вне сезона</i></p>
          <NotifyWhenIsSeason sku={vacation.sku} />
        </div>
      }
    </div> 
  )
}

export default Vacation;