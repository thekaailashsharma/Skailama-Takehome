import { useEffect, useCallback } from 'react';
import useStore from './store/useStore';
import { fetchProfiles, fetchEvents } from './utils/api';
import Header from './components/Header';
import CreateEventForm from './components/CreateEventForm';
import EventList from './components/EventList';
import './App.css';

function App() {
  const currentProfileId = useStore((s) => s.currentProfileId);
  const setProfiles = useStore((s) => s.setProfiles);
  const setEvents = useStore((s) => s.setEvents);

  const loadProfiles = useCallback(async () => {
    try {
      const data = await fetchProfiles();
      setProfiles(data.profiles);
    } catch (err) {
      console.error('Failed to load profiles:', err);
    }
  }, [setProfiles]);

  const loadEvents = useCallback(async () => {
    const profileId = useStore.getState().currentProfileId;
    if (!profileId) return;
    try {
      const data = await fetchEvents(profileId);
      setEvents(data.events);
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  }, [setEvents]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  useEffect(() => {
    if (currentProfileId) {
      loadEvents();
    } else {
      setEvents([]);
    }
  }, [currentProfileId, loadEvents, setEvents]);

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <CreateEventForm onEventCreated={loadEvents} />
        <EventList onEventUpdated={loadEvents} />
      </main>
    </div>
  );
}

export default App;
