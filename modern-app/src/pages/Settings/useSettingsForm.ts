import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type {
  FormErrors,
  NotificationSettings,
  ProfileSettings,
  SecuritySettings,
} from './types';

export type SettingsFormInitial = {
  profile: ProfileSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

function validateEmail(value: string): boolean {
  if (!value) return false;
  return EMAIL_REGEX.test(value);
}

export type ProfileChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;
export type NotifChangeEvent = ChangeEvent<HTMLInputElement>;
export type SecurityChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type UseSettingsForm = {
  profileForm: ProfileSettings;
  notifForm: NotificationSettings;
  securityForm: SecuritySettings;
  formErrors: FormErrors;
  handleProfileChange: (e: ProfileChangeEvent) => void;
  handleNotifChange: (e: NotifChangeEvent) => void;
  handleSecurityChange: (e: SecurityChangeEvent) => void;
  validateProfile: () => boolean;
  resetErrors: () => void;
};

export function useSettingsForm(initial: SettingsFormInitial): UseSettingsForm {
  const [profileForm, setProfileForm] = useState<ProfileSettings>(initial.profile);
  const [notifForm, setNotifForm] = useState<NotificationSettings>(initial.notifications);
  const [securityForm, setSecurityForm] = useState<SecuritySettings>(initial.security);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  // Re-sync local form state when the upstream settings bundle identity changes
  // (e.g. after fetchSettings resolves). Tracks each section's last-seen reference.
  const [syncedProfile, setSyncedProfile] = useState(initial.profile);
  const [syncedNotif, setSyncedNotif] = useState(initial.notifications);
  const [syncedSecurity, setSyncedSecurity] = useState(initial.security);
  if (initial.profile !== syncedProfile) {
    setSyncedProfile(initial.profile);
    setProfileForm(initial.profile);
  }
  if (initial.notifications !== syncedNotif) {
    setSyncedNotif(initial.notifications);
    setNotifForm(initial.notifications);
  }
  if (initial.security !== syncedSecurity) {
    setSyncedSecurity(initial.security);
    setSecurityForm(initial.security);
  }

  const handleProfileChange = (e: ProfileChangeEvent) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotifChange = (e: NotifChangeEvent) => {
    const { name, checked } = e.target;
    setNotifForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSecurityChange = (e: SecurityChangeEvent) => {
    const target = e.target;
    const name = target.name;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setSecurityForm((prev) => ({ ...prev, [name]: target.checked }));
      return;
    }
    if (target.type === 'number') {
      setSecurityForm((prev) => ({ ...prev, [name]: Number(target.value) }));
      return;
    }
    setSecurityForm((prev) => ({ ...prev, [name]: target.value }));
  };

  const validateProfile = (): boolean => {
    const errors: FormErrors = {};
    if (!validateRequired(profileForm.companyName)) {
      errors.companyName = 'Company name is required';
    }
    if (!validateEmail(profileForm.email)) {
      errors.email = 'Valid email is required';
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }
    setFormErrors({});
    return true;
  };

  const resetErrors = () => setFormErrors({});

  return {
    profileForm,
    notifForm,
    securityForm,
    formErrors,
    handleProfileChange,
    handleNotifChange,
    handleSecurityChange,
    validateProfile,
    resetErrors,
  };
}
