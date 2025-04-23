import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RoomStatusPage from './pages/RoomStatusPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ErrorPage from './pages/ErrorPage';
import './styles/global.css';

const App = () => {
  const [bookings, setBookings] = useState<any[]>([]);

  const addBooking = (booking: any) => {
    setBookings((prevBookings) => [...prevBookings, booking]);
  };

  return (
    <Router>
      <Navbar />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomStatusPage addBooking={addBooking} />} />
          <Route path="/bookings" element={<BookingPage bookings={bookings} setBookings={setBookings} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;