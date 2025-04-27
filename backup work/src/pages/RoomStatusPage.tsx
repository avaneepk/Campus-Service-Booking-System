import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ReactModal from 'react-modal';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/global.css'; 


interface RoomStatusPageProps {
  addBooking: (booking: { name: string; type: string; date: string; startTime: string; endTime: string }) => void;
}

const spacesBySection = {
  "Table Tennis Tables": [
    { id: 1, name: 'Table Tennis Table 1', type: 'Table Tennis', image: '/images/table-tennis-1.jpg' },
    { id: 2, name: 'Table Tennis Table 2', type: 'Table Tennis', image: '/images/table-tennis-2.jpg' },
    { id: 3, name: 'Table Tennis Table 3', type: 'Table Tennis', image: '/images/table-tennis-3.jpg' },
  ],
  "Pool Tables": [
    { id: 4, name: 'Pool Table 1', type: 'Pool', image: '/images/pool-table-1.jpg' },
  ],
  "Board Games": Array.from({ length: 10 }, (_, i) => ({
    id: 5 + i,
    name: `Board Game ${i + 1}`,
    type: 'Board Game',
    image: `/images/board-game-${i + 1}.jpg`,
  })),
};

const RoomStatusPage: React.FC<RoomStatusPageProps> = ({ addBooking }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookedSpaces, setBookedSpaces] = useState<{ name: string; date: string; startTime: string; endTime: string }[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<{ name: string; image: string } | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<{ hour: string } | null>(null);

  // Load username and bookings from local storage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const storedBookings = localStorage.getItem('bookedSpaces');
    if (storedBookings) {
      setBookedSpaces(JSON.parse(storedBookings));
    }

    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Replace with actual API call
  }, []);

  // Save bookings to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('bookedSpaces', JSON.stringify(bookedSpaces));
  }, [bookedSpaces]);

  const generateAllHours = () => {
    return Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  };

  const isHourDisabled = (hour: string): boolean => {
    if (!selectedDate) return false;

    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();

    if (isToday) {
      const currentHour = now.getHours();
      const hourNumber = parseInt(hour.split(':')[0], 10);
      return hourNumber < currentHour; // Disable hours in the past
    }

    return false;
  };

  const isHourBooked = (hour: string): boolean => {
    if (!selectedDate || !selectedFacility) return false;

    return bookedSpaces.some(
      (booking) =>
        booking.name === selectedFacility.name &&
        booking.date === selectedDate.toDateString() &&
        booking.startTime === hour
    );
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleBook = (hour: string) => {
    if (!selectedDate || !selectedFacility) {
      alert('Please select a facility and date before booking.');
      return;
    }

    if (isHourDisabled(hour)) {
      alert('You cannot book a past hour.');
      return;
    }

    if (isHourBooked(hour)) {
      alert('This hour is already booked.');
      return;
    }

    // Open confirmation modal
    setPendingBooking({ hour });
    setIsModalOpen(true);
  };

  const confirmBooking = () => {
    if (!selectedDate || !selectedFacility || !pendingBooking) return;

    const booking = {
      name: selectedFacility.name,
      type: 'Facility',
      date: selectedDate.toDateString(),
      startTime: pendingBooking.hour,
      endTime: `${(parseInt(pendingBooking.hour.split(':')[0]) + 1).toString().padStart(2, '0')}:00`, // Add 1 hour
    };

    setBookedSpaces((prev) => [...prev, booking]);
    addBooking(booking);
    alert(`You have booked: ${selectedFacility.name} on ${selectedDate.toDateString()} from ${pendingBooking.hour} to ${booking.endTime}`);
    setIsModalOpen(false);
    setPendingBooking(null);
  };

  const handleCancelBooking = (hour: string) => {
    if (!selectedDate || !selectedFacility) return;

    const updatedBookings = bookedSpaces.filter(
      (booking) =>
        !(
          booking.name === selectedFacility.name &&
          booking.date === selectedDate.toDateString() &&
          booking.startTime === hour
        )
    );

    setBookedSpaces(updatedBookings);
    alert(`Booking for ${selectedFacility.name} at ${hour} on ${selectedDate.toDateString()} has been canceled.`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="room-status-container">
      <h1>{username ? `Hello, ${username}` : 'Welcome to the Campus Booking Management System!'}</h1>
      <div className="calendar-container">
        <div className="calendar">
          <h2>Select a Date</h2>
          <Calendar
            onChange={(value) => handleDateChange(value as Date)}
            value={selectedDate}
            minDate={new Date()} // Disable previous dates
          />
        </div>
        <div className="hours-container">
          <h2>All Hours</h2>
          <div className="hours-grid">
            {generateAllHours().map((hour) => (
              <div
                key={hour}
                className={`hour-square ${isHourDisabled(hour) ? 'disabled' : ''} ${isHourBooked(hour) ? 'booked' : ''}`}
                onClick={() => !isHourDisabled(hour) && !isHourBooked(hour) && handleBook(hour)}
              >
                {hour}
                {isHourBooked(hour) && (
                  <button
                    className="cancel-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelBooking(hour);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="facilities-container">
        {Object.entries(spacesBySection).map(([section, spaces]) => (
          <div key={section} className="facility-section">
            <h2>{section}</h2>
            <div className="facility-list">
              {spaces.map((space) => (
                <div
                  key={space.id}
                  className={`facility-item ${selectedFacility?.name === space.name ? 'selected' : ''}`}
                  onClick={() => setSelectedFacility(space)}
                >
                  <h3>{space.name}</h3>
                  <p>{space.type}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ReactModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <h2>Confirm Booking</h2>
        <p>Are you sure you want to book this time slot?</p>
        <button onClick={confirmBooking}>Confirm</button>
        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
      </ReactModal>
    </div>
  );
};

export default RoomStatusPage;