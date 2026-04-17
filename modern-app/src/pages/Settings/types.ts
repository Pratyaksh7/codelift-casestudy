export type TabKey = 'profile' | 'notifications' | 'security';

export type ProfileSettings = {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  timezone: string;
  currency: string;
  logo: string | null;
};

export type NotificationSettings = {
  emailNotifications: boolean;
  orderAlerts: boolean;
  lowStockAlerts: boolean;
  weeklyReport: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  newUserAlerts: boolean;
  systemUpdates: boolean;
};

export type SecuritySettings = {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  ipWhitelist: string;
  lastPasswordChange: string;
};

export type NotifItem = {
  key: keyof NotificationSettings;
  label: string;
  desc: string;
};

export type FormErrors = Partial<Record<keyof ProfileSettings, string>>;
