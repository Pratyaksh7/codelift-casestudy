import type { FormEvent } from 'react';
import FileUpload from '../../../components/FileUpload/FileUpload';
import type { FormErrors, ProfileSettings } from '../types';
import type { ProfileChangeEvent } from '../useSettingsForm';

export type ProfileTabProps = {
  profileForm: ProfileSettings;
  formErrors: FormErrors;
  onChange: (e: ProfileChangeEvent) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

function ProfileTab({ profileForm, formErrors, onChange, onSubmit }: ProfileTabProps) {
  return (
    <form onSubmit={onSubmit} className="settings-form">
      <div className="form-group">
        <label htmlFor="companyName">Company Name</label>
        <input
          id="companyName"
          type="text"
          name="companyName"
          className="form-input"
          value={profileForm.companyName}
          onChange={onChange}
        />
        {formErrors.companyName ? (
          <span className="field-error">{formErrors.companyName}</span>
        ) : null}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            className="form-input"
            value={profileForm.email}
            onChange={onChange}
          />
          {formErrors.email ? (
            <span className="field-error">{formErrors.email}</span>
          ) : null}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="text"
            name="phone"
            className="form-input"
            value={profileForm.phone}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <textarea
          id="address"
          name="address"
          className="form-input"
          rows={2}
          value={profileForm.address}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          name="website"
          className="form-input"
          value={profileForm.website}
          onChange={onChange}
          placeholder="https://"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="timezone">Timezone</label>
          <select
            id="timezone"
            name="timezone"
            className="form-input"
            value={profileForm.timezone}
            onChange={onChange}
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            name="currency"
            className="form-input"
            value={profileForm.currency}
            onChange={onChange}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (&euro;)</option>
            <option value="GBP">GBP (&pound;)</option>
          </select>
        </div>
      </div>

      <FileUpload label="Company Logo" accept="image/*" showUploadButton={false} />

      <div className="settings-actions">
        <button type="submit" className="btn btn-primary">
          Save Profile
        </button>
      </div>
    </form>
  );
}

export default ProfileTab;
