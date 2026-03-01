import { TIMEZONES } from '../utils/timezone';
import './TimezoneSelect.css';

function TimezoneSelect({ value, onChange }) {
  return (
    <select
      className="timezone-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {TIMEZONES.map(tz => (
        <option key={tz.value} value={tz.value}>
          {tz.label}
        </option>
      ))}
    </select>
  );
}

export default TimezoneSelect;
