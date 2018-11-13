import sortBy from "lodash/sortBy";
import setDay from "date-fns/set_day";
import isMonday from "date-fns/is_monday";
import isWednesday from "date-fns/is_wednesday";

function getCookie(name) {
  if (!document.cookie) {
    return null;
  }

  const xsrfCookies = document.cookie
    .split(";")
    .map(c => c.trim())
    .filter(c => c.startsWith(name + "="));

  if (xsrfCookies.length === 0) {
    return null;
  }

  return decodeURIComponent(xsrfCookies[0].split("=")[1]);
}

const getReminders = () => {
  const TODAY = new Date();
  const Sunday = setDay(TODAY, 7);
  const Monday = setDay(TODAY, 1, { weekStartsOn: 1 });

  const REMINDERS = [
    // Core
    {
      copy: "Tomorrow, 9am",
      key: "tomorrowMorning",
      order: 2,
      reminderDate: new Date(
        TODAY.getFullYear(),
        TODAY.getMonth(),
        TODAY.getDate() + 1,
        9
      ),
    },
    {
      copy: "Sunday, 5pm",
      key: "endOfWeek",
      order: 7,
      reminderDate: new Date(
        Sunday.getFullYear(),
        Sunday.getMonth(),
        Sunday.getDate(),
        17,
        0
      ),
    },
    {
      copy: "Monday, 9am",
      key: "mondayMorning",
      order: 8,
      reminderDate: new Date(
        Monday.getFullYear(),
        Monday.getMonth(),
        Monday.getDate() + 7,
        9,
        0
      ),
    },
  ];

  if (TODAY.getHours() < 12) {
    const THIS_EVENING_REMINDER = {
      copy: "This evening, 5pm",
      key: "endOfDay",
      order: 1,
      reminderDate: new Date(
        TODAY.getFullYear(),
        TODAY.getMonth(),
        TODAY.getDate(),
        17,
        0
      ),
    };
    REMINDERS.push(THIS_EVENING_REMINDER);
  }

  if (isMonday(TODAY)) {
    const wednesday = setDay(TODAY, 3, { weekStartsOn: 1 });
    const MIDWEEK_REMINDER = {
      copy: "Wednesday, 9am",
      key: "midweek",
      order: 3,
      reminderDate: new Date(
        wednesday.getFullYear(),
        wednesday.getMonth(),
        wednesday.getDate(),
        9,
        0
      ),
    };
    REMINDERS.push(MIDWEEK_REMINDER);
  } else if (isWednesday(TODAY)) {
    const friday = setDay(TODAY, 5, { weekStartsOn: 1 });
    const END_OF_WEEK_REMINDER = {
      copy: "Friday, 9am",
      key: "end_of_week",
      order: 3,
      reminderDate: new Date(
        friday.getFullYear(),
        friday.getMonth(),
        friday.getDate(),
        9,
        0
      ),
    };
    REMINDERS.push(END_OF_WEEK_REMINDER);
  }

  return sortBy(REMINDERS, "order");
};

window.getReminders = getReminders;

function getUserDisplay({ username, prefix, first_name, last_name }) {
  if (!first_name && !last_name) return username;
  if (!last_name) return first_name;
  if (!prefix) return last_name;
  return `${prefix} ${last_name}`;
}
export { getCookie, getReminders, getUserDisplay };
