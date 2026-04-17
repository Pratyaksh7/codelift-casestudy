import { useState } from 'react';
import type { FormEvent } from 'react';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import type { BreadcrumbItem } from '../../components/Breadcrumb/Breadcrumb';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Toast from '../../components/Toast/Toast';
import type { ToastType } from '../../components/Toast/Toast';
import ProfileTab from './tabs/ProfileTab';
import NotificationsTab from './tabs/NotificationsTab';
import SecurityTab from './tabs/SecurityTab';
import { useSettingsForm } from './useSettingsForm';
import { useSettings } from '../../hooks/useSettings';
import type { TabKey } from './types';
import './Settings.css';

type ToastState = { message: string; type: ToastType } | null;

type TabDef = {
  key: TabKey;
  label: string;
  icon: string;
};

const TABS: TabDef[] = [
  { key: 'profile', label: 'Profile', icon: '\u{1F464}' },
  { key: 'notifications', label: 'Notifications', icon: '\u{1F514}' },
  { key: 'security', label: 'Security', icon: '\u{1F512}' },
];

function Settings() {
  const {
    settings,
    loading,
    error,
    saveProfile,
    saveNotifications,
    saveSecurity,
  } = useSettings();
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [toast, setToast] = useState<ToastState>(null);
  const {
    profileForm,
    notifForm,
    securityForm,
    formErrors,
    handleProfileChange,
    handleNotifChange,
    handleSecurityChange,
    validateProfile,
    resetErrors,
  } = useSettingsForm(settings);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    resetErrors();
  };

  const handleProfileSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateProfile()) return;
    try {
      await saveProfile(profileForm);
      showToast('Settings saved successfully', 'success');
    } catch {
      showToast('Failed to save settings', 'error');
    }
  };

  const handleNotifSave = async () => {
    try {
      await saveNotifications(notifForm);
      showToast('Settings saved successfully', 'success');
    } catch {
      showToast('Failed to save settings', 'error');
    }
  };

  const handleSecuritySave = async () => {
    try {
      await saveSecurity(securityForm);
      showToast('Settings saved successfully', 'success');
    } catch {
      showToast('Failed to save settings', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading settings..." />;
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Settings' },
  ];

  return (
    <div className="settings-page">
      <Breadcrumb items={breadcrumbItems} />

      <div className="settings-page__header">
        <h2>Settings</h2>
        <p className="settings-page__subtitle">Configure your application preferences</p>
      </div>

      {error ? (
        <div className="settings-page__error-banner" role="alert">
          {error}
        </div>
      ) : null}

      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      ) : null}

      <div className="settings-layout">
        <div className="settings-sidebar">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={'settings-tab-btn' + (activeTab === tab.key ? ' active' : '')}
              onClick={() => handleTabChange(tab.key)}
            >
              <span className="settings-tab-icon" aria-hidden="true">
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'profile' ? (
            <ProfileTab
              profileForm={profileForm}
              formErrors={formErrors}
              onChange={handleProfileChange}
              onSubmit={handleProfileSave}
            />
          ) : null}

          {activeTab === 'notifications' ? (
            <NotificationsTab
              notifForm={notifForm}
              onChange={handleNotifChange}
              onSave={handleNotifSave}
            />
          ) : null}

          {activeTab === 'security' ? (
            <SecurityTab
              securityForm={securityForm}
              onChange={handleSecurityChange}
              onSave={handleSecuritySave}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Settings;
