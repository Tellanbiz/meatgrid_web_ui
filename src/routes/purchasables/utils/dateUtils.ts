/**
 * Converts UTC date string to local date
 * @param utcDateString - UTC date string from API
 * @returns Local date object
 */
export const convertUTCToLocal = (utcDateString: string): Date => {
  const utcDate = new Date(utcDateString);
  return new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));
};

/**
 * Formats date for display in local time
 * @param utcDateString - UTC date string from API
 * @returns Formatted local date string
 */
export const formatLocalDate = (utcDateString: string): string => {
  const localDate = convertUTCToLocal(utcDateString);
  return localDate.toLocaleDateString();
};

/**
 * Formats date and time for display in local time
 * @param utcDateString - UTC date string from API
 * @returns Formatted local date and time string
 */
export const formatLocalDateTime = (utcDateString: string): string => {
  const localDate = convertUTCToLocal(utcDateString);
  return localDate.toLocaleString();
};

/**
 * Checks if a date falls within a date range (inclusive)
 * @param date - Date to check
 * @param startDate - Start of range (optional)
 * @param endDate - End of range (optional)
 * @returns True if date is within range
 */
export const isDateInRange = (date: Date, startDate?: Date | null, endDate?: Date | null): boolean => {
  if (!startDate && !endDate) return true;
  
  if (startDate && endDate) {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    return date >= startOfDay && date <= endOfDay;
  } else if (startDate) {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    return date >= startOfDay;
  } else if (endDate) {
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    return date <= endOfDay;
  }
  
  return true;
}; 