/**
 * Example usage of date utilities
 * This file demonstrates how to use the date utilities in different scenarios
 */

import {
    utcToLocal,
    localToUtc,
    localToUtcDate,
    formatDateSmart,
    getCurrentLocalDate,
    getStartOfDay,
    getEndOfDay,
    isToday,
    isYesterday,
} from './dateUtils';

// Example 1: Display server date in local time
export const displayServerDate = (serverDateString: string) => {
    // Server sends: "2024-01-15T10:30:00Z"
    const localDate = utcToLocal(serverDateString, 'datetime');
    // Result: "Jan 15, 2024, 1:30 PM" (assuming UTC+3)

    const relativeTime = utcToLocal(serverDateString, 'relative');
    // Result: "2 hours ago" or "yesterday" etc.

    const smartFormat = formatDateSmart(serverDateString);
    // Result: "Today at 1:30 PM" or "Yesterday at 1:30 PM" etc.

    return { localDate, relativeTime, smartFormat };
};

// Example 2: Send local date to server
export const sendDateToServer = (localDate: Date) => {
    // Convert local date to UTC for API
    const utcDateString = localToUtc(localDate);
    // Result: "2024-01-15T10:30:00.000Z"

    // For date-only fields (no time)
    const utcDateOnly = localToUtcDate(localDate);
    // Result: "2024-01-15"

    return { utcDateString, utcDateOnly };
};

// Example 3: Date range filtering
export const createDateRangeFilter = (startDate: Date, endDate: Date) => {
    const startOfDay = getStartOfDay(startDate);
    const endOfDay = getEndOfDay(endDate);

    const filterParams = {
        start_date: localToUtcDate(startOfDay),
        end_date: localToUtcDate(endOfDay),
    };

    return filterParams;
};

// Example 4: Smart date display in components
export const renderDateInComponent = (serverDateString: string) => {
    const date = new Date(serverDateString);

    if (isToday(date)) {
        return `Today at ${utcToLocal(serverDateString, 'time')}`;
    }

    if (isYesterday(date)) {
        return `Yesterday at ${utcToLocal(serverDateString, 'time')}`;
    }

    return utcToLocal(serverDateString, 'date');
};

// Example 5: Form date handling
export const handleFormDateSubmission = (formData: any) => {
    const localDate = new Date(formData.date);

    return {
        ...formData,
        date: localToUtcDate(localDate), // For date-only fields
        datetime: localToUtc(localDate), // For datetime fields
    };
};

// Example 6: Table date display
export const formatTableDate = (serverDateString: string) => {
    return {
        display: utcToLocal(serverDateString, 'datetime'),
        sort: new Date(serverDateString).getTime(), // For sorting
        tooltip: formatDateSmart(serverDateString), // For tooltips
    };
};

// Example 7: Date picker integration
export const handleDatePickerChange = (selectedDate: Date) => {
    // For API calls
    const apiDate = localToUtcDate(selectedDate);

    // For display
    const displayDate = selectedDate.toLocaleDateString('en-KE');

    return { apiDate, displayDate };
};

// Example 8: Current date utilities
export const getCurrentDateInfo = () => {
    const now = getCurrentLocalDate();
    const startOfToday = getStartOfDay();
    const endOfToday = getEndOfDay();

    return {
        now: localToUtc(now),
        startOfDay: localToUtc(startOfToday),
        endOfDay: localToUtc(endOfToday),
    };
}; 