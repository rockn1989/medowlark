import React, { useState } from 'react'

function NotifyWhenIsSeason({sku}) {

  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [email, setEmail] = useState('');
  if(registeredEmail) return (
    <i>Вам придет уведомление на  {registeredEmail}, когда начнется сезон на этот тур!</i>
  );

 function onSubmit(event) {
  event.preventDefault();
  console.log(email);
  fetch(`http://api.localhost:3033/vacation/${sku}/notify-when-in-season`, {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => {
      if(res.status < 200 || res.status > 299)
        return alert('Возникли проблемы, пожалуйста, попробуйте еще раз')
      setRegisteredEmail(email)
    });
}

  return (
    <form onSubmit={onSubmit}>
      <i>Уведомить меня, когда начнется сезон на этот тур:</i>
      <input type="email" placeholder='(ваш email)' name='email' value={email} onChange={({target: {value}}) => setEmail(value)} />
      <button type="submit">ОК</button>
    </form>
  )
}

export default NotifyWhenIsSeason;