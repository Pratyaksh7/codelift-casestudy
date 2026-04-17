import type {
  NotificationSettings,
  ProfileSettings,
  SecuritySettings,
} from '../../pages/Settings/types';
import { client } from '../client';
import { endpoints } from '../endpoints';

export type SettingsBundle = {
  profile: ProfileSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
};

export function fetchSettings(signal?: AbortSignal): Promise<SettingsBundle> {
  return client.get<SettingsBundle>(endpoints.settings.root, { signal });
}

export function updateProfileSettings(
  payload: ProfileSettings,
): Promise<ProfileSettings> {
  return client.put<ProfileSettings>(endpoints.settings.profile, payload);
}

export function updateNotificationSettings(
  payload: NotificationSettings,
): Promise<NotificationSettings> {
  return client.put<NotificationSettings>(endpoints.settings.notifications, payload);
}

export function updateSecuritySettings(
  payload: SecuritySettings,
): Promise<SecuritySettings> {
  return client.put<SecuritySettings>(endpoints.settings.security, payload);
}
