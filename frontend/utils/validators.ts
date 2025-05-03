/**
 * Validates if a string is a valid email address.
 * @param email - The email string to validate.
 * @returns True if the email is valid, false otherwise.
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validates if a password meets the required criteria.
   * @param password - The password string to validate.
   * @returns True if the password is valid, false otherwise.
   */
  export const isValidPassword = (password: string): boolean => {
    // Example criteria: at least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };
  
  /**
   * Validates if a username meets the required criteria.
   * @param username - The username string to validate.
   * @returns True if the username is valid, false otherwise.
   */
  export const isValidUsername = (username: string): boolean => {
    // Example criteria: only alphanumeric characters, 3-20 characters
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    return usernameRegex.test(username);
  };
  
  /**
   * Validates if a date string is in the correct format and is a valid date.
   * @param date - The date string to validate (format: 'yyyy-MM-dd').
   * @returns True if the date is valid, false otherwise.
   */
  export const isValidDate = (date: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
  
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };
  
  /**
   * Validates if a time string is in the correct format.
   * @param time - The time string to validate (format: 'HH:mm').
   * @returns True if the time is valid, false otherwise.
   */
  export const isValidTime = (time: string): boolean => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
  };