import type { SecuritySettings } from '../types';
import type { SecurityChangeEvent } from '../useSettingsForm';

export type SecurityTabProps = {
  securityForm: SecuritySettings;
  onChange: (e: SecurityChangeEvent) => void;
  onSave: () => void;
};

function SecurityTab({ securityForm, onChange, onSave }: SecurityTabProps) {
  const lastChangedLabel = securityForm.lastPasswordChange
    ? new Date(securityForm.lastPasswordChange).toLocaleDateString()
    : 'Unknown';

  return (
    <div className="settings-form">
      <div className="notif-toggle-row">
        <div className="notif-toggle-info">
          <span className="notif-toggle-label">Two-Factor Authentication</span>
          <span className="notif-toggle-desc">
            Add an extra layer of security to your account
          </span>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            name="twoFactorEnabled"
            checked={securityForm.twoFactorEnabled}
            onChange={onChange}
          />
          <span className="toggle-slider" />
        </label>
      </div>

      <div className="form-group form-group--narrow settings-form__spaced">
        <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
        <input
          id="sessionTimeout"
          type="number"
          name="sessionTimeout"
          className="form-input form-input--narrow"
          value={securityForm.sessionTimeout}
          onChange={onChange}
          min={5}
          max={480}
        />
      </div>

      <div className="form-group form-group--narrow">
        <label htmlFor="passwordExpiry">Password Expiry (days)</label>
        <input
          id="passwordExpiry"
          type="number"
          name="passwordExpiry"
          className="form-input form-input--narrow"
          value={securityForm.passwordExpiry}
          onChange={onChange}
          min={30}
          max={365}
        />
        <p className="form-help">Last changed: {lastChangedLabel}</p>
      </div>

      <div className="form-group">
        <label htmlFor="ipWhitelist">IP Whitelist</label>
        <textarea
          id="ipWhitelist"
          name="ipWhitelist"
          className="form-input"
          rows={3}
          value={securityForm.ipWhitelist}
          onChange={onChange}
          placeholder="Enter IP addresses, one per line"
        />
        <p className="form-help">Leave empty to allow all IPs</p>
      </div>

      <div className="danger-zone">
        <h4 className="danger-zone__title">Danger Zone</h4>
        <p className="danger-zone__desc">
          These actions are irreversible. Please be careful.
        </p>
        <div className="danger-zone__actions">
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => {
              // TODO: wire to API — password reset
            }}
          >
            Reset Password
          </button>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => {
              // TODO: wire to API — terminate sessions
            }}
          >
            Terminate All Sessions
          </button>
        </div>
      </div>

      <div className="settings-actions">
        <button type="button" className="btn btn-primary" onClick={onSave}>
          Save Security Settings
        </button>
      </div>
    </div>
  );
}

export default SecurityTab;
