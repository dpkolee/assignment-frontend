import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const subtractYearFromNow = (year: number) => {
  return dayjs().subtract(year, "year");
};

export const FormatDateFromNow = (date: Date) => {
  return dayjs(new Date(date)).fromNow();
};
