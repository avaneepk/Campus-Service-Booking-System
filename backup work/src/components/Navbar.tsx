import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Campus Booking</h1>
      <ul>
        <li><Link to="/bookings">Manage Bookings</Link></li>
        <li><Link to="/rooms">View Room Status</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;