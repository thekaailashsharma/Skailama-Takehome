import { useRef } from 'react';
import { ClockIcon } from './Icons';
import './TimePicker.css';

function TimePicker({ value, onChange }) {
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange('09:00');
  };

  return (
    <div className="time-picker" onClick={() => inputRef.current?.showPicker?.()}>
      <ClockIcon size={14} color="#999" />
      <input
        ref={inputRef}
        type="time"
        className="time-picker-input"
        value={value || '09:00'}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
      <button type="button" className="time-picker-clear" onClick={(e) => { e.stopPropagation(); handleClear(); }}>
        <ClockIcon size={14} color="#999" />
      </button>
    </div>
  );
}

export default TimePicker;
