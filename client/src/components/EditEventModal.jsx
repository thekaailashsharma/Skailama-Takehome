import { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { updateEvent as updateEventApi } from '../utils/api';
import { toUTC, fromUTC } from '../utils/timezone';
import Modal from './Modal';
import MultiSelect from './MultiSelect';
import TimezoneSelect from './TimezoneSelect';
import TimePicker from './TimePicker';
import './EditEventModal.css';

function EditEventModal({ event, onClose, onUpdated }) {
  const initial = useMemo(() => {
    const start = fromUTC(event.startTime, event.timezone);
    const end = fromUTC(event.endTime, event.timezone);
    return {
      profiles: event.profiles.map(p => p._id),
      timezone: event.timezone,
      startDate: new Date(event.startTime),
      startTime: start.time,
      endDate: new Date(event.endTime),
      endTime: end.time,
    };
  }, [event]);

  const [profiles, setProfiles] = useState(initial.profiles);
  const [timezone, setTimezone] = useState(initial.timezone);
  const [startDate, setStartDate] = useState(initial.startDate);
  const [startTime, setStartTime] = useState(initial.startTime);
  const [endDate, setEndDate] = useState(initial.endDate);
  const [endTime, setEndTime] = useState(initial.endTime);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profiles.length === 0) {
      alert('Select at least one profile');
      return;
    }
    if (!startDate || !endDate) {
      alert('Select start and end dates');
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
      await updateEventApi(event._id, {
        profiles,
        timezone,
        startTime: startUTC,
        endTime: endUTC,
      });
      onUpdated();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Edit Event" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Profiles</label>
          <MultiSelect selected={profiles} onChange={setProfiles} />
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
                dateFormat="MMMM do, yyyy"
                className="date-input"
                minDate={startDate}
              />
            </div>
            <TimePicker value={endTime} onChange={setEndTime} />
          </div>
        </div>

        <div className="edit-modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default EditEventModal;
