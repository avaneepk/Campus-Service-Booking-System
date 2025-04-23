import { format, isBefore, isAfter, parseISO } from 'date-fns';

/**
 * Formats a date string into a readable format.
 * @param date - The date string to format.
 * @param formatString - The format string (default: 'yyyy-MM-dd').
 * @returns The formatted date string.
 */
export const formatDate = (date: string | Date, formatString: string = 'yyyy-MM-dd'): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, formatString);
};

/**
 * Checks if a given date is before another date.
 * @param date1 - The first date.
 * @param date2 - The second date.
 * @returns True if date1 is before date2, false otherwise.
 */
export const isDateBefore = (date1: string | Date, date2: string | Date): boolean => {
  const parsedDate1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const parsedDate2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isBefore(parsedDate1, parsedDate2);
};

/**
 * Checks if a given date is after another date.
 * @param date1 - The first date.
 * @param date2 - The second date.
 * @returns True if date1 is after date2, false otherwise.
 */
export const isDateAfter = (date1: string | Date, date2: string | Date): boolean => {
  const parsedDate1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const parsedDate2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isAfter(parsedDate1, parsedDate2);
};

/**
 * Generates an array of time slots between a start and end time.
 * @param startTime - The start time in 'HH:mm' format.
 * @param endTime - The end time in 'HH:mm' format.
 * @param interval - The interval in minutes (default: 30).
 * @returns An array of time slots as strings in 'HH:mm' format.
 */
export const generateTimeSlots = (startTime: string, endTime: string, interval: number = 30): string[] => {
  const slots: string[] = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  let current = new Date();
  current.setHours(startHour, startMinute, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMinute, 0, 0);

  while (current <= end) {
    slots.push(format(current, 'HH:mm'));
    current.setMinutes(current.getMinutes() + interval);
  }

  return slots;
};