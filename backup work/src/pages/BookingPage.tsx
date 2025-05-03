import React, { useState } from 'react';

interface Booking {
  name: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface BookingPageProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

const BookingPage: React.FC<BookingPageProps> = ({ bookings, setBookings }) => {
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editedDate, setEditedDate] = useState<string>('');
  const [editedStartTime, setEditedStartTime] = useState<string>('');
  const [editedEndTime, setEditedEndTime] = useState<string>('');

  const handleDelete = (bookingToDelete: Booking) => {
    setBookings((prev) => prev.filter((booking) => booking !== bookingToDelete));
    alert(`Booking for ${bookingToDelete.name} has been deleted.`);
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setEditedDate(booking.date);
    setEditedStartTime(booking.startTime);
    setEditedEndTime(booking.endTime);
  };

  const handleSaveEdit = () => {
    if (!editedDate || !editedStartTime || !editedEndTime) {
      alert('Please fill in all fields.');
      return;
    }

    const isDuplicate = bookings.some(
      (booking) =>
        booking !== editingBooking &&
        booking.name === editingBooking?.name &&
        booking.date === editedDate &&
        booking.startTime === editedStartTime &&
        booking.endTime === editedEndTime
    );

    if (isDuplicate) {
      alert('This booking already exists. Please make changes to avoid duplicates.');
      return;
    }

    const updatedBookings = bookings.map((booking) =>
      booking === editingBooking
        ? { ...booking, date: editedDate, startTime: editedStartTime, endTime: editedEndTime }
        : booking
    );

    setBookings(updatedBookings);
    setEditingBooking(null);
    alert('Booking has been updated.');
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
  };

  return (
    <div className="booking-page-container">
      <h1>Manage Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul className="booking-list">
          {bookings.map((booking, index) => (
            <li key={index} className="booking-item">
              <div>
                <strong>{booking.name}</strong> ({booking.type})<br />
                Date: {booking.date}<br />
                Time: {booking.startTime} - {booking.endTime}
              </div>
              <div className="booking-actions">
                <button onClick={() => handleEdit(booking)} className="edit-button">Edit</button>
                <button onClick={() => handleDelete(booking)} className="delete-button">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingBooking && (
        <div className="edit-booking-form">
          <h2>Edit Booking</h2>
          <label>
            Date:
            <input
              type="date"
              value={editedDate}
              onChange={(e) => setEditedDate(e.target.value)}
            />
          </label>
          <label>
            Start Time:
            <input
              type="time"
              value={editedStartTime}
              onChange={(e) => setEditedStartTime(e.target.value)}
            />
          </label>
          <label>
            End Time:
            <input
              type="time"
              value={editedEndTime}
              onChange={(e) => setEditedEndTime(e.target.value)}
            />
          </label>
          <div className="edit-actions">
            <button onClick={handleSaveEdit} className="save-button">Save</button>
            <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;