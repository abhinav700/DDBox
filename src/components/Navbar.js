import React from 'react';
// import Identicon from 'react-identicons';
import box from '../box.png'

const Navbar = (props) => {
  return (
    <div><nav className="navbar navbar-dark bg-dark p-0 text-monospace">
    <a
      className="navbar-brand col-sm-3 col-md-2 mr-0"
      href="http://www.dappuniversity.com/bootcamp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={box} width="30" height="30" className="align-top" alt="" />
      DDBox
    </a>
    <ul className="navbar-nav px-3">
      {
        props.account
        // <Identicon string={props.account} size='25'/>:"0X0"
      }
    </ul>
  </nav></div>
  )
}

export default Navbar