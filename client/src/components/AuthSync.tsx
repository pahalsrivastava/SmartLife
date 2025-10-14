import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { CURRENT_USER_ID_STORAGE_KEY } from '../utils/userScopedStorage';

export default function AuthSync() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    const nextUserId = isSignedIn ? user?.id ?? 'anon' : 'anon';
    try {
      window.localStorage.setItem(CURRENT_USER_ID_STORAGE_KEY, nextUserId);
    } catch {
      // ignore
    }
    // Trigger a tick so persisted stores will pick the new scoped keys on next access.
    // Consumers should read fresh state after auth transitions.
  }, [isLoaded, isSignedIn, user?.id]);

  return null;
}

import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { CURRENT_USER_ID_STORAGE_KEY } from '../utils/userScopedStorage';

/**
 * Keeps the current Clerk userId in localStorage so that persisted Zustand stores
 * can be scoped per user. Also triggers a re-read by updating the key.
 */
export default function AuthSync() {
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    try {
      const prev = window.localStorage.getItem(CURRENT_USER_ID_STORAGE_KEY);
      const next = userId ?? 'anon';
      if (prev !== next) {
        window.localStorage.setItem(CURRENT_USER_ID_STORAGE_KEY, next);
      }
    } catch {
      // ignore
    }
  }, [isLoaded, userId]);

  return null;
}
