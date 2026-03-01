import { useEffect, useCallback } from 'react';
import useStore from './store/useStore';
import { fetchProfiles, fetchEvents } from './utils/api';
import Header from './components/Header';
import CreateEventForm from './components/CreateEventForm';
import EventList from './components/EventList';
import './App.css';

function App() {
  const currentProfileId = useStore((s) => s.currentProfileId);
  const viewTimezone = useStore((s) => s.viewTimezone);
  const setProfiles = useStore((s) => s.setProfiles);
  const setEvents = useStore((s) => s.setEvents);
  const setViewTimezone = useStore((s) => s.setViewTimezone);

  const loadProfiles = useCallback(async () => {
    try {
      const data = await fetchProfiles();
      setProfiles(data.profiles);
    } catch (err) {
      console.error('Failed to load profiles:', err);
    }
  }, [setProfiles]);

  const loadEvents = useCallback(async () => {
    const state = useStore.getState();
    try {
      let data;
      if (state.currentProfileId) {
        data = await fetchEvents({ profileId: state.currentProfileId });
      } else {
        data = await fetchEvents({ timezone: state.viewTimezone });
      }
      setEvents(data.events);

      if (state.currentProfileId && data.events.length > 0) {
        const latestEvent = data.events[data.events.length - 1];
        setViewTimezone(latestEvent.timezone);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  }, [setEvents, setViewTimezone]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  useEffect(() => {
    loadEvents();
  }, [currentProfileId, loadEvents]);

  useEffect(() => {
    if (!currentProfileId) {
      loadEvents();
    }
  }, [viewTimezone, currentProfileId, loadEvents]);

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
