import { create } from 'zustand';
import { getSystemTimezone } from '../utils/timezone';

const useStore = create((set) => ({
  profiles: [],
  currentProfileId: null,
  events: [],
  viewTimezone: getSystemTimezone(),

  setProfiles: (profiles) => set({ profiles }),
  addProfile: (profile) => set((state) => ({
    profiles: [...state.profiles, profile]
  })),
  setCurrentProfileId: (id) => set({ currentProfileId: id }),
  setEvents: (events) => set({ events }),
  setViewTimezone: (tz) => set({ viewTimezone: tz }),
}));

export default useStore;
