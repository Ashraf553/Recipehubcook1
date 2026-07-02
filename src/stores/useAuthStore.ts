import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

interface AuthState {
  user: Omit<User, 'passwordHash'> | null;
  users: User[];
  justLoggedIn: boolean;
  register: (username: string, email: string, password: string) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  clearJustLoggedIn: () => void;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      justLoggedIn: false,

      register: (username, email, password) => {
        const { users } = get();
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return { ok: false, error: 'email_taken' };
        }
        if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
          return { ok: false, error: 'username_taken' };
        }
        const newUser: User = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          username,
          email,
          passwordHash: simpleHash(password),
          createdAt: Date.now(),
        };
        const { passwordHash: _, ...publicUser } = newUser;
        set({ users: [...users, newUser], user: publicUser, justLoggedIn: true });
        return { ok: true };
      },

      login: (email, password) => {
        const { users } = get();
        const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!found) return { ok: false, error: 'not_found' };
        if (found.passwordHash !== simpleHash(password)) return { ok: false, error: 'wrong_password' };
        const { passwordHash: _, ...publicUser } = found;
        set({ user: publicUser, justLoggedIn: true });
        return { ok: true };
      },

      logout: () => set({ user: null }),

      clearJustLoggedIn: () => set({ justLoggedIn: false }),
    }),
    { name: 'recipehub-auth' },
  ),
);
