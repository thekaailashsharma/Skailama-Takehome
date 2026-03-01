import { useState, useEffect } from 'react';
import { fetchEventLogs } from '../utils/api';
import { formatDateTime, getTimezoneLabel } from '../utils/timezone';
import useStore from '../store/useStore';
import Modal from './Modal';
import { ClockIcon } from './Icons';
import './EventLogsModal.css';

function EventLogsModal({ event, onClose }) {
  const { viewTimezone } = useStore();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [event._id]);

  const loadLogs = async () => {
    try {
      const data = await fetchEventLogs(event._id);
      setLogs(data.logs);
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const describeChange = (change) => {
    switch (change.field) {
      case 'startTime':
        return 'Start date/time updated';
      case 'endTime':
        return 'End date/time updated';
      case 'timezone':
        return `Timezone changed to ${getTimezoneLabel(change.newValue)}`;
      case 'profiles': {
        const names = Array.isArray(change.newValue)
          ? change.newValue.join(', ')
          : change.newValue;
        return `Profiles changed to ${names}`;
      }
      default:
        return `${change.field} updated`;
    }
  };

  return (
    <Modal title="Event Update History" onClose={onClose}>
      {loading ? (
        <p className="logs-loading">Loading...</p>
      ) : logs.length === 0 ? (
        <p className="logs-empty">No update history yet</p>
      ) : (
        <ul className="logs-list">
          {logs.map(log => (
            <li key={log._id} className="log-entry">
              <div className="log-time">
                <ClockIcon size={12} color="#555" />
                <span>{formatDateTime(log.createdAt, viewTimezone)}</span>
              </div>
              <ul className="log-changes">
                {log.changes.map((change, i) => (
                  <li key={i} className="log-change">
                    {describeChange(change)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

export default EventLogsModal;
