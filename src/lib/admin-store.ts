import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAdmin: boolean;
  adminUsername: string | null;
  showAdminPanel: boolean;
  showLoginModal: boolean;
  login: (username: string) => void;
  logout: () => void;
  setShowAdminPanel: (show: boolean) => void;
  setShowLoginModal: (show: boolean) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdmin: false,
      adminUsername: null,
      showAdminPanel: false,
      showLoginModal: false,
      login: (username: string) => set({ isAdmin: true, adminUsername: username, showLoginModal: false }),
      logout: () => set({ isAdmin: false, adminUsername: null, showAdminPanel: false }),
      setShowAdminPanel: (show: boolean) => set({ showAdminPanel: show }),
      setShowLoginModal: (show: boolean) => set({ showLoginModal: show }),
    }),
    {
      name: 'la-burratina-admin',
    }
  )
);
