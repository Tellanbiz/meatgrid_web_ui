/**
 * Date utility functions for handling UTC and local time conversions
 */

/**
 * Convert UTC date string to local date string
 * @param utcDateString - UTC date string from server (e.g., "2024-01-15T10:30:00Z")
 * @param format - Output format: 'date', 'datetime', 'time', 'relative'
 * @returns Formatted local date string
 */
export const utcToLocal = (
  utcDateString: string,
  format: 'date' | 'datetime' | 'time' | 'relative' = 'datetime'
): string => {
  if (!utcDateString) return '';

  const utcDate = new Date(utcDateString);

  switch (format) {
    case 'date':
      return utcDate.toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });

    case 'datetime':
      return utcDate.toLocaleString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

    case 'time':
      return utcDate.toLocaleTimeString('en-KE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

    case 'relative':
      return getRelativeTime(utcDate);

    default:
      return utcDate.toLocaleString('en-KE');
  }
};

/**
 * Convert local date to UTC date string for API calls
 * @param localDate - Local Date object
 * @returns UTC date string in ISO format
 */
export const localToUtc = (localDate: Date): string => {
  return localDate.toISOString();
};

/**
 * Convert local date to UTC date string (date only, no time)
 * @param localDate - Local Date object
 * @returns UTC date string in YYYY-MM-DD format
 */
export const localToUtcDate = (localDate: Date): string => {
  const utcDate = new Date(
    localDate.getTime() - localDate.getTimezoneOffset() * 60000
  );
  return utcDate.toISOString().split('T')[0];
};

/**
 * Get relative time (e.g., "2 hours ago", "yesterday")
 * @param date - Date object
 * @returns Relative time string
 */
const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

/**
 * Format date range for display
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range string
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = startDate.toLocaleDateString('en-KE', {
    month: 'short',
    day: '2-digit',
  });

  const end = endDate.toLocaleDateString('en-KE', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  return `${start} - ${end}`;
};

/**
 * Get current date in local timezone
 * @returns Current local date
 */
export const getCurrentLocalDate = (): Date => {
  return new Date();
};

/**
 * Get start of day in local timezone
 * @param date - Date object (optional, defaults to current date)
 * @returns Start of day date
 */
export const getStartOfDay = (date: Date = new Date()): Date => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

/**
 * Get end of day in local timezone
 * @param date - Date object (optional, defaults to current date)
 * @returns End of day date
 */
export const getEndOfDay = (date: Date = new Date()): Date => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns True if date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is yesterday
 * @param date - Date to check
 * @returns True if date is yesterday
 */
export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Parse date string and return local date
 * @param dateString - Date string (can be UTC or local)
 * @returns Local Date object
 */
export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Format date for API requests (YYYY-MM-DD)
 * @param date - Date object
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Format datetime for API requests (ISO string)
 * @param date - Date object
 * @returns ISO date string
 */
export const formatDateTimeForAPI = (date: Date): string => {
  return date.toISOString();
};

/**
 * Get timezone offset in minutes
 * @returns Timezone offset in minutes
 */
export const getTimezoneOffset = (): number => {
  return new Date().getTimezoneOffset();
};

/**
 * Convert date to user-friendly format with smart detection
 * @param dateString - UTC date string from server
 * @returns User-friendly date string
 */
export const formatDateSmart = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (isToday(date)) {
    return `Today at ${date.toLocaleTimeString('en-KE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })}`;
  }

  if (isYesterday(date)) {
    return `Yesterday at ${date.toLocaleTimeString('en-KE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })}`;
  }

  return utcToLocal(dateString, 'datetime');
};

/**
 * Legacy formatDate function for backward compatibility
 * @param dateString - UTC date string from server
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return utcToLocal(dateString, 'datetime');
};

/**
 * Convert 12-hour time format to 24-hour format
 * @param time12 - Time in 12-hour format (e.g., "2:30PM")
 * @returns Time in 24-hour format (e.g., "14:30")
 */
export const convert12to24 = (time12: string): string => {
  const match = time12?.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
  if (!match) return "";
  const [, hours, minutes, period] = match;
  let hour = parseInt(hours);

  if (period.toUpperCase() === "PM" && hour < 12) hour += 12;
  if (period.toUpperCase() === "AM" && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, "0")}:${minutes}`;
};

/**
 * Convert 24-hour time format to 12-hour format
 * @param time24 - Time in 24-hour format (e.g., "14:30")
 * @returns Time in 12-hour format (e.g., "2:30PM")
 */
export const convert24to12 = (time24: string): string => {
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes}${suffix}`;
};

/**
 * Duration options for date ranges
 */
export type DurationOption =
  | "today"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "last_month"
  | "this_week"
  | "last_week"
  | "custom";

/**
 * Date range interface
 */
export interface DateRange {
  start_date: string;
  end_date: string;
}

/**
 * Get date range based on duration option
 * @param duration - Duration option
 * @returns Tuple of [start_date, end_date] in YYYY-MM-DD format
 */
export const getDateRange = (duration: DurationOption): [string, string] => {
  const today = new Date();
  const start = new Date(today);
  const end = new Date(today);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  switch (duration) {
    case "today": {
      break;
    }

    case "last_7_days": {
      start.setDate(start.getDate() - 6);
      break;
    }

    case "last_30_days": {
      start.setDate(start.getDate() - 29);
      break;
    }

    case "this_month": {
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      break;
    }

    case "last_month": {
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      end.setDate(0);
      break;
    }

    case "this_week": {
      const thisDay = today.getDay();
      const thisDiff = today.getDate() - thisDay + (thisDay === 0 ? -6 : 1);
      start.setDate(thisDiff);
      end.setDate(thisDiff + 6);
      break;
    }

    case "last_week": {
      start.setDate(
        start.getDate() - 7 - start.getDay() + (start.getDay() === 0 ? -6 : 1)
      );
      end.setDate(start.getDate() + 6);
      break;
    }

    case "custom": {
      throw new Error(
        '"custom" duration requires explicit start_date and end_date. Use a different function to handle custom ranges.'
      );
    }
  }

  const format = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return [format(start), format(end)];
};
