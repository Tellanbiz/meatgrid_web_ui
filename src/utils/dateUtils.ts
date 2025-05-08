export type DurationOption = "this_month" | "last_month" | "this_week" | "last_week";

export interface DateRange {
  start_date: string;
  end_date: string;
}

export const getDateRange = (duration: DurationOption): DateRange => {
  const today = new Date();
  const start = new Date(today);
  const end = new Date(today);

  switch (duration) {
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
      const prev = new Date(today);
      prev.setDate(prev.getDate() - 7);
      const prevDay = prev.getDay();
      const prevDiff = prev.getDate() - prevDay + (prevDay === 0 ? -6 : 1);
      start.setDate(prevDiff);
      end.setDate(prevDiff + 6);
      break;
    }
  }

  const format = (date: Date): string => date.toISOString().split("T")[0];

  return {
    start_date: format(start),
    end_date: format(end),
  };
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
}