import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../api/client';
import {
  fetchSettings,
  updateNotificationSettings as updateNotificationSettingsRequest,
  updateProfileSettings as updateProfileSettingsRequest,
  updateSecuritySettings as updateSecuritySettingsRequest,
  type SettingsBundle,
} from '../api/services/settings';
import type {
  NotificationSettings,
  ProfileSettings,
  SecuritySettings,
} from '../pages/Settings/types';

// Legacy settingsActions falls back to this mock bundle on API failure —
// keeping it here means the form always has sane defaults even offline.
const MOCK_SETTINGS: SettingsBundle = {
  profile: {
    companyName: 'Acme Corporation',
    email: 'admin@acme.example',
    phone: '+1 555 0100',
    address: '123 Market St\nSan Francisco, CA 94103',
    website: 'https://acme.example',
    timezone: 'America/Los_Angeles',
    currency: 'USD',
    logo: null,
  },
  notifications: {
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    weeklyReport: false,
    marketingEmails: false,
    securityAlerts: true,
    newUserAlerts: false,
    systemUpdates: true,
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    ipWhitelist: '',
    lastPasswordChange: '2026-01-15T12:00:00.000Z',
  },
};

function messageFrom(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

export type UseSettingsResult = {
  settings: SettingsBundle;
  loading: boolean;
  saving: boolean;
  error: string | null;
  saveProfile: (payload: ProfileSettings) => Promise<void>;
  saveNotifications: (payload: NotificationSettings) => Promise<void>;
  saveSecurity: (payload: SecuritySettings) => Promise<void>;
};

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<SettingsBundle>(MOCK_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        const bundle = await fetchSettings(controller.signal);
        if (!cancelled) {
          setSettings(bundle);
          setError(null);
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        setSettings(MOCK_SETTINGS);
        setError(messageFrom(err, 'Failed to load settings'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const saveProfile = useCallback(async (payload: ProfileSettings) => {
    setSaving(true);
    try {
      const saved = await updateProfileSettingsRequest(payload);
      setSettings((prev) => ({ ...prev, profile: saved }));
      setError(null);
    } catch (err) {
      setError(messageFrom(err, 'Failed to save profile settings'));
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const saveNotifications = useCallback(async (payload: NotificationSettings) => {
    setSaving(true);
    try {
      const saved = await updateNotificationSettingsRequest(payload);
      setSettings((prev) => ({ ...prev, notifications: saved }));
      setError(null);
    } catch (err) {
      setError(messageFrom(err, 'Failed to save notification settings'));
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const saveSecurity = useCallback(async (payload: SecuritySettings) => {
    setSaving(true);
    try {
      const saved = await updateSecuritySettingsRequest(payload);
      setSettings((prev) => ({ ...prev, security: saved }));
      setError(null);
    } catch (err) {
      setError(messageFrom(err, 'Failed to save security settings'));
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    settings,
    loading,
    saving,
    error,
    saveProfile,
    saveNotifications,
    saveSecurity,
  };
}

export default useSettings;
