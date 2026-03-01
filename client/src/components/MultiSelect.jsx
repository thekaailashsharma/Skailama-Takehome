import { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { createProfile as createProfileApi } from '../utils/api';
import './MultiSelect.css';

function MultiSelect({ selected, onChange }) {
  const { profiles, addProfile } = useStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setShowAdd(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = profiles.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      const data = await createProfileApi(newName.trim());
      addProfile(data.profile);
      onChange([...selected, data.profile._id]);
      setNewName('');
      setShowAdd(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const selectedCount = selected.length;
  const label = selectedCount > 0
    ? `${selectedCount} profiles selected`
    : 'Select profiles...';

  return (
    <div className="multi-select" ref={ref}>
      <button
        type="button"
        className={`multi-select-trigger ${selectedCount > 0 ? 'has-value' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span>{label}</span>
        <span className="ms-chevron">&#9662;</span>
      </button>

      {open && (
        <div className="multi-select-dropdown">
          <input
            type="text"
            placeholder="Search profiles..."
            className="multi-select-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="multi-select-list">
            {filtered.map(p => (
              <li
                key={p._id}
                className={`multi-select-item ${selected.includes(p._id) ? 'active' : ''}`}
                onClick={() => toggle(p._id)}
              >
                {selected.includes(p._id) && <span className="ms-check">&#10003;</span>}
                <span>{p.name}</span>
              </li>
            ))}
          </ul>

          {!showAdd ? (
            <button
              type="button"
              className="multi-select-add-trigger"
              onClick={() => setShowAdd(true)}
            >
              + Add Profile
            </button>
          ) : (
            <div className="multi-select-add-row">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Profile name"
                className="multi-select-add-input"
                autoFocus
              />
              <button type="button" onClick={handleAdd} className="multi-select-add-btn">Add</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
