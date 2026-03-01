import { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { createProfile as createProfileApi } from '../utils/api';
import './ProfileSelector.css';

function ProfileSelector() {
  const { profiles, currentProfileId, setCurrentProfileId, addProfile } = useStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentProfile = profiles.find(p => p._id === currentProfileId);

  const filtered = profiles.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id) => {
    setCurrentProfileId(id);
    setOpen(false);
    setSearch('');
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      const data = await createProfileApi(newName.trim());
      addProfile(data.profile);
      setNewName('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="ps" ref={ref}>
      <button className="ps-trigger" onClick={() => setOpen(!open)}>
        <span>{currentProfile ? currentProfile.name : 'Select current profile...'}</span>
        <span className="ps-chevron">&#9662;</span>
      </button>

      {open && (
        <div className="ps-dropdown">
          <input
            type="text"
            placeholder="Search current profile..."
            className="ps-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="ps-list">
            {filtered.map(p => (
              <li
                key={p._id}
                className={`ps-item ${p._id === currentProfileId ? 'active' : ''}`}
                onClick={() => handleSelect(p._id)}
              >
                {p._id === currentProfileId && <span className="ps-check">&#10003;</span>}
                <span>{p.name}</span>
              </li>
            ))}
            {filtered.length === 0 && profiles.length > 0 && (
              <li className="ps-empty">No profiles found</li>
            )}
            {profiles.length === 0 && (
              <li className="ps-empty">No profiles yet. Add one below.</li>
            )}
          </ul>
          <div className="ps-add">
            <input
              type="text"
              placeholder="New profile name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="ps-add-input"
            />
            <button className="ps-add-btn" onClick={handleAdd}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileSelector;
