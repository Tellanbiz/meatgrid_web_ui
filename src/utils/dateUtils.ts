export type DurationOption =
  | "today"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "last_month"
  | "this_week"
  | "last_week"
  | "custom";

export interface DateRange {
  start_date: string;
  end_date: string;
}

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

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};
