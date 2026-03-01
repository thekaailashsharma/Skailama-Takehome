import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createEvent as createEventApi } from '../utils/api';
import { toUTC } from '../utils/timezone';
import MultiSelect from './MultiSelect';
import TimezoneSelect from './TimezoneSelect';
import TimePicker from './TimePicker';
import './CreateEventForm.css';

function CreateEventForm({ onEventCreated }) {
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [timezone, setTimezone] = useState('America/New_York');
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState('09:00');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setSelectedProfiles([]);
    setStartDate(null);
    setEndDate(null);
    setStartTime('09:00');
    setEndTime('09:00');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedProfiles.length === 0) {
      alert('Please select at least one profile');
      return;
    }
    if (!startDate || !endDate) {
      alert('Please select start and end dates');
      return;
    }

    const startDateStr = formatLocalDate(startDate);
    const endDateStr = formatLocalDate(endDate);
    const startUTC = toUTC(startDateStr, startTime, timezone);
    const endUTC = toUTC(endDateStr, endTime, timezone);

    if (new Date(endUTC) <= new Date(startUTC)) {
      alert('End time must be after start time');
      return;
    }

    setLoading(true);
    try {
      await createEventApi({
        profiles: selectedProfiles,
        timezone,
        startTime: startUTC,
        endTime: endUTC,
      });
      resetForm();
      onEventCreated();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Create Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Profiles</label>
          <MultiSelect selected={selectedProfiles} onChange={setSelectedProfiles} />
        </div>

        <div className="form-group">
          <label className="form-label">Timezone</label>
          <TimezoneSelect value={timezone} onChange={setTimezone} />
        </div>

        <div className="form-group">
          <label className="form-label">Start Date & Time</label>
          <div className="date-time-row">
            <div className="date-input-wrap">
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                placeholderText="Pick a date"
                dateFormat="MMMM do, yyyy"
                className="date-input"
              />
            </div>
            <TimePicker value={startTime} onChange={setStartTime} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">End Date & Time</label>
          <div className="date-time-row">
            <div className="date-input-wrap">
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                placeholderText="Pick a date"
                dateFormat="MMMM do, yyyy"
                className="date-input"
                minDate={startDate}
              />
            </div>
            <TimePicker value={endTime} onChange={setEndTime} />
          </div>
        </div>

        <button type="submit" className="btn-primary btn-full" disabled={loading}>
          <span>+</span> {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}

function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default CreateEventForm;
