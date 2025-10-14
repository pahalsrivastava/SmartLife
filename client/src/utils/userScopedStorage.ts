import type { StateStorage } from 'zustand/middleware';

export const CURRENT_USER_ID_STORAGE_KEY = 'sl_current_user_id';

function getCurrentUserId(): string {
  if (typeof window === 'undefined') return 'anon';
  try {
    const value = window.localStorage.getItem(CURRENT_USER_ID_STORAGE_KEY);
    return value && value.length > 0 ? value : 'anon';
  } catch {
    return 'anon';
  }
}

function getScopedKey(baseName: string): string {
  const userId = getCurrentUserId();
  return `${baseName}:${userId}`;
}

// A localStorage adapter that scopes persisted keys by the current Clerk userId.
// It also adopts legacy unscoped keys the first time a scoped read occurs.
export const userScopedStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    const scopedKey = getScopedKey(name);
    return window.localStorage.getItem(scopedKey);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    const scopedKey = getScopedKey(name);
    try {
      window.localStorage.setItem(scopedKey, value);
    } catch {
      // ignore
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    const scopedKey = getScopedKey(name);
    try {
      window.localStorage.removeItem(scopedKey);
    } catch {
      // ignore
    }
  },
};
