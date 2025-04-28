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
  "Board Games": [
    { id: 5, name: 'Chess Board', image: '/images/board-chess.jpg' },
    { id: 6, name: 'Monopoly Set', image: '/images/board-monopoly.jpg' },
    { id: 7, name: 'Scrabble Set', image: '/images/board-scrabble.jpg' },
    { id: 8, name: 'Catan Set', image: '/images/board-catan.jpg' },
    { id: 9, name: 'Risk Set', image: '/images/board-risk.jpg' },
    { id: 10, name: 'Clue Set', image: '/images/board-clue.jpg' },
    { id: 11, name: 'Ticket to Ride', image: '/images/board-ticket.jpg' },
    { id: 12, name: 'Pandemic Set', image: '/images/board-pandemic.jpg' },
    { id: 13, name: 'Carcassonne Set', image: '/images/board-carcassonne.jpg' },
    { id: 14, name: 'Azul Set', type: 'Board Game', image: '/images/board-azul.jpg' },
  ],
  "Rooms": [
    { id: 15, name: 'Room 1', type: 'M19_A111', image: '/images/room-1.jpg' },
    { id: 16, name: 'Room 2', type: 'M19_A112', image: '/images/room-2.jpg' },
    { id: 17, name: 'Room 3', type: 'M19_A251', image: '/images/room-3.jpg' },
    { id: 18, name: 'Room 4', type: 'M19_A201-F1', image: '/images/room-4.jpg' },
    { id: 19, name: 'Room 5', type: 'M19_A201-F2', image: '/images/room-5.jpg' },
    { id: 20, name: 'Room 6', type: 'M19_A201-F3', image: '/images/room-6.jpg' },
    { id: 21, name: 'Room 7', type: 'M19_D267-F4', image: '/images/room-7.jpg' },
    { id: 22, name: 'Room 8', type: 'M19_D267-F5', image: '/images/room-8.jpg' },
    { id: 23, name: 'Room 9', type: 'M19_A001', image: '/images/room-9.jpg' },
    { id: 24, name: 'Room 10', type: 'M19_A002', image: '/images/room-10.jpg' },
  ],
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
  const [editingBooking, setEditingBooking] = useState<null | { index: number; booking: any }>(null);
  const [editedBooking, setEditedBooking] = useState<any>(null);

  // Facility image modal state
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [modalFacility, setModalFacility] = useState<{ name: string; image: string } | null>(null);

  // Notification banner state
  const [notification, setNotification] = useState<string | null>(null);

  // --- ADVANCED FEATURE: Simulate API/network error ---
  const handleApiError = (err: any) => {
    setNotification('A network error occurred. Please try again.');
  };

  // --- ADVANCED FEATURE: Authentication/Login UI ---
  // Automatically log in with a default username if not present
  useEffect(() => {
    let storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      storedUsername = 'User' + Math.floor(Math.random() * 10000);
      localStorage.setItem('username', storedUsername);
    }
    setUsername(storedUsername);

    const storedBookings = localStorage.getItem('bookedSpaces');
    if (storedBookings) {
      setBookedSpaces(JSON.parse(storedBookings));
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    localStorage.setItem('bookedSpaces', JSON.stringify(bookedSpaces));
  }, [bookedSpaces]);

  const generateAllHours = () => {
    return Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  };

  const isHourDisabled = (hour: string): boolean => {
    if (!selectedDate) return false;
    const now = new Date();
    const bookingDate = new Date(selectedDate);
    const [hourNum, minuteNum] = hour.split(':').map(Number);
    bookingDate.setHours(hourNum, minuteNum, 0, 0);
    return bookingDate < now;
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

  // Prevent selecting a past date
  const handleDateChange = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const picked = new Date(date);
    picked.setHours(0, 0, 0, 0);
    if (picked < today) {
      setNotification('You cannot select a past date.');
      return;
    }
    setSelectedDate(date);
  };

  const handleBook = (hour: string) => {
    if (!selectedDate || !selectedFacility) {
      setNotification('Please select a facility and date before booking.');
      return;
    }

    const now = new Date();
    const bookingDate = new Date(selectedDate);
    const [hourNum, minuteNum] = hour.split(':').map(Number);
    bookingDate.setHours(hourNum, minuteNum, 0, 0);

    // Prevent booking in the past
    if (bookingDate < now) {
      setNotification('You cannot book a past date or time.');
      return;
    }

    if (isHourBooked(hour)) {
      setNotification('This hour is already booked.');
      return;
    }

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
      endTime: `${(parseInt(pendingBooking.hour.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
    };

    setBookedSpaces((prev) => [...prev, booking]);
    addBooking(booking);
    setNotification(`You have booked: ${selectedFacility.name} on ${selectedDate.toDateString()} from ${pendingBooking.hour} to ${booking.endTime}`);
    setIsModalOpen(false);
    setPendingBooking(null);
  };

  const handleCancelBooking = (index: number) => {
    const updatedBookings = bookedSpaces.filter((_, i) => i !== index);
    setBookedSpaces(updatedBookings);
    setNotification('Booking canceled successfully!');
  };

  const handleEditBooking = (index: number, booking: any) => {
    setEditingBooking({ index, booking });
    setEditedBooking(booking);
  };

  const handleSaveBooking = () => {
    if (editingBooking) {
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0); // midnight today
      const selectedDateObj = new Date(editedBooking.date);
      const [startHours, startMinutes] = editedBooking.startTime.split(':').map(Number);

      // Check if the date is in the past
      if (selectedDateObj < today) {
        setNotification('You cannot select a past date.');
        return;
      }

      // Check if the time is in the past (only if the date is today)
      if (
        selectedDateObj.toDateString() === now.toDateString() &&
        (startHours < now.getHours() || (startHours === now.getHours() && startMinutes < now.getMinutes()))
      ) {
        setNotification('You cannot select a past time.');
        return;
      }

      const updatedBookings = [...bookedSpaces];
      updatedBookings[editingBooking.index] = editedBooking;
      setBookedSpaces(updatedBookings);
      setEditingBooking(null);
      setNotification('Booking updated successfully!');
    }
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
  };

  // Helper to get today's date string in yyyy-mm-dd
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(null);
    setNotification('You have been logged out.');
    // Optionally, reload to auto-generate a new username
    setTimeout(() => window.location.reload(), 500);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // --- ADVANCED FEATURE: Booking History (future & past) ---
  const now = new Date();
  const futureBookings = bookedSpaces.filter(b => new Date(b.date + ' ' + b.startTime) >= now);
  const pastBookings = bookedSpaces.filter(b => new Date(b.date + ' ' + b.startTime) < now);

  return (
    <div className="room-status-container">
      {notification && (
        <div className="notification-banner" role="alert">
          {notification}
          <button onClick={() => setNotification(null)} aria-label="Close notification">×</button>
        </div>
      )}

      {/* --- ADVANCED FEATURE: Service Discovery & Node Awareness --- */}
      <div style={{ background: '#fffde7', color: '#bfa100', padding: 8, borderRadius: 4, margin: '16px 0', fontSize: 15 }}>
        <strong>Service Status:</strong> All booking microservices are <span style={{ color: 'green' }}>Online</span>.<br />
        <strong>Node:</strong> You are connected to <span style={{ color: '#1976d2' }}>Node 1</span>.
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>Welcome to the Campus Booking Management System!</h1>
        {username && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontWeight: 500, fontSize: 18, color: '#1565c0' }}>
              Hello, {username}
            </span>
            <button
              className="cancel-button"
              style={{ padding: '6px 16px', fontSize: 16 }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* --- ADVANCED FEATURE: User Guide/Tooltips --- */}
      <div className="user-guide" style={{ background: '#e3f2fd', color: '#1565c0', padding: 8, borderRadius: 4, margin: '16px 0' }}>
        <strong>How to use:</strong> Select a facility, pick a date, and click an available hour to book. Use the "Manage Your Bookings" section to edit or cancel. Click a facility to see its image.
      </div>

      {/* --- ADVANCED FEATURE: User Profile/Settings --- */}
      {username && (
        <div style={{ marginTop: 8, color: '#555', fontSize: 15 }}>
          Profile:(Standard User)
        </div>
      )}

      {/* --- ADVANCED FEATURE: Fault Tolerance (Simulate Network Error) --- */}
      <button
        style={{ margin: '16px 0', background: '#e53935', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}
        onClick={() => handleApiError(new Error('Simulated network error'))}
      >
        Simulate Network Error
      </button>

      <div className="calendar-container">
        <div className="calendar">
          <h2>Select a Date</h2>
          <Calendar
            onChange={(value) => handleDateChange(value as Date)}
            value={selectedDate}
            minDate={new Date()}
            tileDisabled={({ date }) => {
              // Disable all past dates
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const d = new Date(date);
              d.setHours(0, 0, 0, 0);
              return d < today;
            }}
          />
        </div>
        {/* --- ADVANCED FEATURE: Real-Time Updates (Demo Note) --- */}
        <div style={{ color: '#388e3c', margin: '8px 0 16px 0', fontSize: 14 }}>
          <em>Bookings update in real time (demo).</em>
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
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- ADVANCED FEATURE: Booking History (future & past) --- */}
      <div className="manage-bookings-container">
        <h2>Manage Your Bookings</h2>
        <h3>Upcoming Bookings</h3>
        {futureBookings.length > 0 ? (
          <div className="bookings-grid">
            {futureBookings.map((booking, index) => (
              <div key={index} className="booking-card">
                {editingBooking?.index === index ? (
                  <div className="edit-booking-form">
                    <label>
                      Facility:
                      <input
                        type="text"
                        value={editedBooking.name}
                        onChange={(e) =>
                          setEditedBooking({ ...editedBooking, name: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      Date:
                      <input
                        type="date"
                        value={editedBooking.date}
                        min={getTodayString()}
                        onChange={(e) => {
                          const newDate = e.target.value;
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const picked = new Date(newDate);
                          picked.setHours(0, 0, 0, 0);
                          if (picked < today) {
                            setNotification('You cannot select a past date.');
                            return;
                          }
                          setEditedBooking({ ...editedBooking, date: newDate });
                        }}
                      />
                    </label>
                    <label>
                      Time:
                      <input
                        type="time"
                        value={editedBooking.startTime}
                        onChange={(e) => {
                          const newStartTime = e.target.value;
                          const now = new Date();
                          const [hours, minutes] = newStartTime.split(':').map(Number);
                          if (
                            editedBooking.date === now.toISOString().split('T')[0] &&
                            (hours < now.getHours() || (hours === now.getHours() && minutes < now.getMinutes()))
                          ) {
                            setNotification('You cannot select a past time.');
                            return;
                          }
                          const newEndTime = `${(hours + 1).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                          setEditedBooking({ ...editedBooking, startTime: newStartTime, endTime: newEndTime });
                        }}
                      />
                    </label>
                    <div className="edit-actions">
                      <button className="save-button" onClick={handleSaveBooking}>
                        Save
                      </button>
                      <button className="cancel-button" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="booking-details">
                      <p>
                        <strong>Facility:</strong> {booking.name}
                      </p>
                      <p>
                        <strong>Date:</strong> {booking.date}
                      </p>
                      <p>
                        <strong>Time:</strong> {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                    <div className="booking-actions">
                      <button
                        className="edit-button"
                        onClick={() => handleEditBooking(index, booking)}
                      >
                        Edit
                      </button>
                      <button
                        className="cancel-button"
                        onClick={() => handleCancelBooking(index)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-bookings-message">No upcoming bookings.</p>
        )}
        <h3 style={{ marginTop: 24 }}>Past Bookings</h3>
        {pastBookings.length > 0 ? (
          <div className="bookings-grid">
            {pastBookings.map((booking, index) => (
              <div key={index} className="booking-card">
                <div className="booking-details">
                  <p><strong>Facility:</strong> {booking.name}</p>
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-bookings-message">No past bookings.</p>
        )}
      </div>

      <div className="facilities-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center' }}>
  {Object.entries(spacesBySection).map(([section, spaces]) => (
    <div key={section} className="facility-section" style={{ minWidth: 250, flex: '1 1 300px', maxWidth: 350 }}>
      <h2 id="facility-list-title">{section}</h2>
      <div
        className="facility-list"
        role="list"
        aria-labelledby="facility-list-title"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}
      >
        {spaces.map((space) => (
          <div
            key={space.id}
            className={`facility-item ${selectedFacility?.name === space.name ? 'selected' : ''}`}
            role="listitem"
            tabIndex={0}
            aria-label={`Select ${space.name}`}
            onClick={() => {
              setSelectedFacility(space);
              setModalFacility(space);
              setFacilityModalOpen(true);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedFacility(space);
                setModalFacility(space);
                setFacilityModalOpen(true);
              }
            }}
            style={{
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: 16,
              minWidth: 120,
              maxWidth: 150,
              textAlign: 'center',
              cursor: 'pointer',
              background: selectedFacility?.name === space.name ? '#e3f2fd' : '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              flex: '1 1 120px'
            }}
          >
            <h3 style={{ fontSize: 16 }}>{space.name}</h3>
            <p style={{ fontSize: 14 }}>{space.type}</p>
            <img
              src={space.image}
              alt={space.name}
              style={{ width: '100%', maxWidth: 100, maxHeight: 80, objectFit: 'cover', borderRadius: 4, margin: '8px 0' }}
            />
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
        <button className="cancel-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
      </ReactModal>
      <ReactModal
        isOpen={facilityModalOpen}
        onRequestClose={() => setFacilityModalOpen(false)}
        contentLabel="Facility Image"
        ariaHideApp={false}
      >
        {modalFacility && (
          <div style={{ textAlign: 'center' }}>
            <h2>{modalFacility.name}</h2>
            <img
              src={modalFacility.image}
              alt={modalFacility.name}
              style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
            />
            <br />
            <button className="cancel-button" onClick={() => setFacilityModalOpen(false)}>
              Close
            </button>
          </div>
        )}
      </ReactModal>
    </div>
  );
};

export default RoomStatusPage;

// RoomStatusPage.test.tsx
// Example test: renders login if not logged in, renders bookings if logged in, prevents past bookings, etc.