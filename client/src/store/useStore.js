import { create } from 'zustand';

const useStore = create((set) => ({
  profiles: [],
  currentProfileId: null,
  events: [],
  viewTimezone: 'America/New_York',

  setProfiles: (profiles) => set({ profiles }),
  addProfile: (profile) => set((state) => ({
    profiles: [...state.profiles, profile]
  })),
  setCurrentProfileId: (id) => set({ currentProfileId: id }),
  setEvents: (events) => set({ events }),
  setViewTimezone: (tz) => set({ viewTimezone: tz }),
}));

export default useStore;
