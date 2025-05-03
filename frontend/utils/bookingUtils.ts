export const isOverlapping = (
    bookings: { name: string; date: string; startTime: string; endTime: string }[],
    newBooking: { name: string; date: string; startTime: string; endTime: string },
    excludeBooking?: { name: string; date: string; startTime: string; endTime: string }
  ) => {
    return bookings.some((booking) => {
      if (excludeBooking && booking === excludeBooking) return false;
  
      return (
        booking.name === newBooking.name &&
        booking.date === newBooking.date &&
        (
          (newBooking.startTime >= booking.startTime && newBooking.startTime < booking.endTime) ||
          (newBooking.endTime > booking.startTime && newBooking.endTime <= booking.endTime) ||
          (newBooking.startTime <= booking.startTime && newBooking.endTime >= booking.endTime)
        )
      );
    });
  };