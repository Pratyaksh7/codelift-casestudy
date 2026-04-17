import type { NotifItem, NotificationSettings } from '../types';
import type { NotifChangeEvent } from '../useSettingsForm';

const NOTIF_ITEMS: NotifItem[] = [
  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
  { key: 'orderAlerts', label: 'Order Alerts', desc: 'Get notified when new orders arrive' },
  { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Alert when product stock is low' },
  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly summary report' },
  { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional emails' },
  { key: 'securityAlerts', label: 'Security Alerts', desc: 'Important security notifications' },
  { key: 'newUserAlerts', label: 'New User Alerts', desc: 'Notify when new users register' },
  { key: 'systemUpdates', label: 'System Updates', desc: 'Notifications about system updates' },
];

export type NotificationsTabProps = {
  notifForm: NotificationSettings;
  onChange: (e: NotifChangeEvent) => void;
  onSave: () => void;
};

function NotificationsTab({ notifForm, onChange, onSave }: NotificationsTabProps) {
  return (
    <div className="settings-form">
      <p className="settings-form__hint">
        Manage which notifications you receive. Some critical notifications cannot be disabled.
      </p>
      {NOTIF_ITEMS.map((item) => (
        <div key={item.key} className="notif-toggle-row">
          <div className="notif-toggle-info">
            <span className="notif-toggle-label">{item.label}</span>
            <span className="notif-toggle-desc">{item.desc}</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              name={item.key}
              checked={notifForm[item.key]}
              onChange={onChange}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      ))}
      <div className="settings-actions">
        <button type="button" className="btn btn-primary" onClick={onSave}>
          Save Notifications
        </button>
      </div>
    </div>
  );
}

export default NotificationsTab;
