import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const TIMEZONES = [
  { label: 'Eastern Time (ET)', value: 'America/New_York' },
  { label: 'Central Time (CT)', value: 'America/Chicago' },
  { label: 'Mountain Time (MT)', value: 'America/Denver' },
  { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
  { label: 'India (IST)', value: 'Asia/Kolkata' },
  { label: 'Japan (JST)', value: 'Asia/Tokyo' },
  { label: 'UK (GMT/BST)', value: 'Europe/London' },
  { label: 'Central Europe (CET)', value: 'Europe/Berlin' },
  { label: 'Australia Eastern (AEST)', value: 'Australia/Sydney' },
  { label: 'UTC', value: 'UTC' },
];

export function formatDate(utcDate, tz) {
  return dayjs.utc(utcDate).tz(tz).format('MMM D, YYYY');
}

export function formatTime(utcDate, tz) {
  return dayjs.utc(utcDate).tz(tz).format('hh:mm A');
}

export function formatDateTime(utcDate, tz) {
  return dayjs.utc(utcDate).tz(tz).format('MMM D, YYYY [at] hh:mm A');
}

export function toUTC(dateStr, timeStr, tz) {
  const combined = `${dateStr} ${timeStr}`;
  return dayjs.tz(combined, 'YYYY-MM-DD HH:mm', tz).utc().toISOString();
}

export function fromUTC(utcDate, tz) {
  const d = dayjs.utc(utcDate).tz(tz);
  return {
    date: d.format('YYYY-MM-DD'),
    time: d.format('HH:mm'),
  };
}

export function getTimezoneLabel(value) {
  const found = TIMEZONES.find(t => t.value === value);
  return found ? found.label : value;
}

export function getSystemTimezone() {
  const system = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const match = TIMEZONES.find(t => t.value === system);
  return match ? match.value : 'Asia/Kolkata';
}

export { dayjs };
