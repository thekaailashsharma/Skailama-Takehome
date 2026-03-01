import { useState } from 'react';
import useStore from '../store/useStore';
import TimezoneSelect from './TimezoneSelect';
import EventCard from './EventCard';
import EditEventModal from './EditEventModal';
import EventLogsModal from './EventLogsModal';
import './EventList.css';

function EventList({ onEventUpdated }) {
  const { events, viewTimezone, setViewTimezone, setCurrentProfileId, currentProfileId } = useStore();
  const [editingEvent, setEditingEvent] = useState(null);
  const [logsEvent, setLogsEvent] = useState(null);

  const handleTimezoneChange = (tz) => {
    setCurrentProfileId(null);
    setViewTimezone(tz);
  };

  const label = currentProfileId
    ? 'Events for selected profile'
    : 'Events';

  return (
    <div className="card">
      <h2 className="card-title">{label}</h2>

      <div className="form-group">
        <label className="form-label">View in Timezone</label>
        <TimezoneSelect value={viewTimezone} onChange={handleTimezoneChange} />
      </div>

      <div className="event-list">
        {events.length === 0 ? (
          <p className="no-events">No events found</p>
        ) : (
          events.map(event => (
            <EventCard
              key={event._id}
              event={event}
              timezone={viewTimezone}
              onEdit={() => setEditingEvent(event)}
              onViewLogs={() => setLogsEvent(event)}
            />
          ))
        )}
      </div>

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onUpdated={() => {
            setEditingEvent(null);
            onEventUpdated();
          }}
        />
      )}

      {logsEvent && (
        <EventLogsModal
          event={logsEvent}
          onClose={() => setLogsEvent(null)}
        />
      )}
    </div>
  );
}

export default EventList;
