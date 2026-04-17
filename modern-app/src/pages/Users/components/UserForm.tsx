import type { ChangeEvent, FormEvent } from 'react';
import type { UserFormData, UserFormErrors } from '../types';

type Props = {
  formData: UserFormData;
  formErrors: UserFormErrors;
  isEditing: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function UserForm({
  formData,
  formErrors,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <form onSubmit={onSubmit}>
      <div className="users__form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          className="users__form-input"
          value={formData.name}
          onChange={onChange}
        />
        {formErrors.name && (
          <span className="users__field-error">{formErrors.name}</span>
        )}
      </div>
      <div className="users__form-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          className="users__form-input"
          value={formData.email}
          onChange={onChange}
        />
        {formErrors.email && (
          <span className="users__field-error">{formErrors.email}</span>
        )}
      </div>
      <div className="users__form-row">
        <div className="users__form-group">
          <label>Role</label>
          <select
            name="role"
            className="users__form-input"
            value={formData.role}
            onChange={onChange}
          >
            <option value="admin">Administrator</option>
            <option value="manager">Manager</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <div className="users__form-group">
          <label>Status</label>
          <select
            name="status"
            className="users__form-input"
            value={formData.status}
            onChange={onChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
      <div className="users__form-group">
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          className="users__form-input"
          value={formData.phone}
          onChange={onChange}
          placeholder="555-0100"
        />
      </div>
      <div className="users__form-actions">
        <button
          type="button"
          className="btn users__btn--secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

export default UserForm;
