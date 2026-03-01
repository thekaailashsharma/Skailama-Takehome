import { formatDate, formatTime, formatDateTime } from '../utils/timezone';
import { UserIcon, CalendarIcon, ClockIcon, EditIcon, LogsIcon } from './Icons';
import './EventCard.css';

function EventCard({ event, timezone, onEdit, onViewLogs }) {
  const profileNames = event.profiles.map(p => p.name).join(', ');

  return (
    <div className="event-card">
      <div className="ec-profiles">
        <UserIcon size={16} color="#555" />
        <span className="ec-profiles-text">{profileNames}</span>
      </div>

      <div className="ec-row">
        <CalendarIcon size={14} color="#555" />
        <span>Start: {formatDate(event.startTime, timezone)}</span>
      </div>
      <div className="ec-row ec-sub">
        <ClockIcon size={14} color="#999" />
        <span>{formatTime(event.startTime, timezone)}</span>
      </div>

      <div className="ec-row">
        <CalendarIcon size={14} color="#555" />
        <span>End: {formatDate(event.endTime, timezone)}</span>
      </div>
      <div className="ec-row ec-sub">
        <ClockIcon size={14} color="#999" />
        <span>{formatTime(event.endTime, timezone)}</span>
      </div>

      <div className="ec-meta">
        <span>Created: {formatDateTime(event.createdAt, timezone)}</span>
        <span>Updated: {formatDateTime(event.updatedAt, timezone)}</span>
      </div>

      <div className="ec-actions">
        <button className="ec-btn" onClick={onEdit}>
          <EditIcon size={14} /> Edit
        </button>
        <button className="ec-btn" onClick={onViewLogs}>
          <LogsIcon size={14} /> View Logs
        </button>
      </div>
    </div>
  );
}

export default EventCard;
