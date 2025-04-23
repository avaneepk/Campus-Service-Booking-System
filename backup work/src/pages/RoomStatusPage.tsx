import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import TimePicker from 'react-time-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css';

interface RoomStatusPageProps {
  addBooking: (booking: { name: string; type: string; date: string; startTime: string; endTime: string }) => void;
}

// Define all spaces grouped by sections
const spacesBySection = {
  "Table Tennis Tables": [
    { id: 1, name: 'Table Tennis Table 1', type: 'Table Tennis' },
    { id: 2, name: 'Table Tennis Table 2', type: 'Table Tennis' },
    { id: 3, name: 'Table Tennis Table 3', type: 'Table Tennis' },
  ],
  "Pool Tables": [
    { id: 4, name: 'Pool Table 1', type: 'Pool' },
  ],
  "Board Games": Array.from({ length: 10 }, (_, i) => ({
    id: 5 + i,
    name: `Board Game ${i + 1}`,
    type: 'Board Game',
  })),
  "Sauna Rooms": [
    { id: 15, name: 'Sauna Room 1', type: 'Sauna' },
    { id: 16, name: 'Sauna Room 2', type: 'Sauna' },
  ],
  "Student Rooms": Array.from({ length: 10 }, (_, i) => ({
    id: 17 + i,
    name: `Student Room ${i + 1}`,
    type: 'Student Room',
  })),
};

const RoomStatusPage: React.FC<RoomStatusPageProps> = ({ addBooking }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [bookedSpaces, setBookedSpaces] = useState<{ name: string; date: string; startTime: string; endTime: string }[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>(
    Object.keys(spacesBySection).reduce((acc, section) => ({ ...acc, [section]: false }), {})
  );
  const navigate = useNavigate();

  // Load bookings from local storage on component mount
  useEffect(() => {
    const storedBookings = localStorage.getItem('bookedSpaces');
    if (storedBookings) {
      setBookedSpaces(JSON.parse(storedBookings));
    }
  }, []);

  // Save bookings to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('bookedSpaces', JSON.stringify(bookedSpaces));
  }, [bookedSpaces]);

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleBook = (space: { name: string; type: string }) => {
    if (!selectedDate || !startTime || !endTime) {
      alert('Please select a date, start time, and end time before booking.');
      return;
    }

    const now = new Date();
    const selectedDateTime = new Date(selectedDate);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startDateTime = new Date(selectedDateTime);
    startDateTime.setHours(startHours, startMinutes);

    const endDateTime = new Date(selectedDateTime);
    endDateTime.setHours(endHours, endMinutes);

    // Prevent booking in the past
    if (startDateTime < now) {
      alert('You cannot book a space in the past.');
      return;
    }

    // Validate that the end time is after the start time
    if (endDateTime <= startDateTime) {
      alert('End time must be after the start time.');
      return;
    }

    // Check if the space is already booked for the selected time range
    const isOverlapping = bookedSpaces.some(
      (booking) =>
        booking.name === space.name &&
        booking.date === selectedDate.toDateString() &&
        ((startTime >= booking.startTime && startTime < booking.endTime) || // Overlaps with existing booking
          (endTime > booking.startTime && endTime <= booking.endTime) || // Overlaps with existing booking
          (startTime <= booking.startTime && endTime >= booking.endTime)) // Fully overlaps
    );

    if (isOverlapping) {
      alert('This space is already booked for the selected time range. Please choose a different time.');
      return;
    }

    // Add the booking
    const booking = {
      name: space.name,
      type: space.type,
      date: selectedDate.toDateString(),
      startTime,
      endTime,
    };
    setBookedSpaces((prev) => [...prev, booking]);
    addBooking(booking);
    alert(`You have booked: ${space.name} on ${selectedDate.toDateString()} from ${startTime} to ${endTime}`);
  };

  return (
    <div className="room-status-container">
      <h1>Available Spaces</h1>
      <button onClick={() => navigate('/')} className="go-back-button">Go Back to Main Page</button>
      <div className="calendar-container">
        <h2>Select a Date</h2>
        <Calendar
          onChange={(value) => setSelectedDate(value instanceof Date ? value : null)}
          value={selectedDate}
          minDate={new Date()} // Disable previous dates
        />
      </div>
      <div className="time-picker-container">
        <h2>Select Start Time</h2>
        <TimePicker
          onChange={setStartTime}
          value={startTime}
          disableClock={true}
          format="HH:mm"
        />
      </div>
      <div className="time-picker-container">
        <h2>Select End Time</h2>
        <TimePicker
          onChange={setEndTime}
          value={endTime}
          disableClock={true}
          format="HH:mm"
        />
      </div>
      {Object.entries(spacesBySection).map(([section, spaces]) => (
        <div key={section} className="section">
          <h2 onClick={() => toggleSection(section)} className="section-heading">
            {section} {collapsedSections[section] ? '▼' : '▲'}
          </h2>
          {!collapsedSections[section] && (
            <ul className="spaces-list">
              {spaces.map((space) => (
                <li key={space.id} className="space-item">
                  <strong>{space.name}</strong> ({space.type}) -{' '}
                  <button onClick={() => handleBook(space)} className="book-button">Book Now</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default RoomStatusPage;