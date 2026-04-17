import {
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { Breadcrumb, type BreadcrumbItem } from './components/Breadcrumb';
import { SearchBar } from './components/SearchBar';
import { Modal } from './components/Modal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { UsersTable } from './components/UsersTable';
import { UserForm } from './components/UserForm';
import { useAutoDismiss } from './hooks/useAutoDismiss';
import { useDelayedFlag } from './hooks/useDelayedFlag';
import { useUsers } from '../../hooks/useUsers';
import type {
  User,
  UserFormData,
  UserFormErrors,
  UserRole,
} from './types';
import { validateEmail, validateRequired } from './validators';
import './Users.css';

const EMPTY_FORM: UserFormData = {
  name: '',
  email: '',
  role: 'viewer',
  phone: '',
  status: 'active',
};

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Users' },
];

type RoleFilter = 'all' | UserRole;

export function UsersPage() {
  const {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<UserFormErrors>({});

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Legacy used jQuery fade-in on .page-header with 100ms delay
  const headerVisible = useDelayedFlag(100);

  const clearToast = useCallback(() => setToastMessage(null), []);
  useAutoDismiss(toastMessage, 3000, clearToast);

  const filteredUsers = useMemo<User[]>(() => {
    let result = users;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term),
      );
    }
    if (roleFilter !== 'all') {
      result = result.filter((u) => u.role === roleFilter);
    }
    return result;
  }, [users, searchTerm, roleFilter]);

  const openAddModal = (): void => {
    setEditingUser(null);
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (user: User): void => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone ?? '',
      status: user.status,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const errors: UserFormErrors = {};
    if (!validateRequired(formData.name)) errors.name = 'Name is required';
    if (!validateEmail(formData.email))
      errors.email = 'Valid email is required';
    if (!validateRequired(formData.role)) errors.role = 'Role is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        setToastMessage('User updated successfully');
      } else {
        await createUser(formData);
        setToastMessage('User created successfully');
      }
      closeModal();
    } catch {
      // error surfaced via hook's error state; leave modal open so the user can retry
    }
  };

  const openDeleteConfirm = (userId: string): void => {
    setDeleteTargetId(userId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (deleteTargetId !== null) {
      try {
        await deleteUser(deleteTargetId);
      } catch {
        // error surfaced via hook's error state
      }
    }
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  const handleDeleteCancel = (): void => {
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  const headerClassName = `users__page-header${headerVisible ? ' is-visible' : ''}`;

  return (
    <div className="users-page">
      <Breadcrumb items={BREADCRUMB_ITEMS} />

      <div className={headerClassName}>
        <h2>User Management</h2>
        <p className="users__page-subtitle">
          Manage user accounts and permissions
        </p>
      </div>

      {toastMessage && <div className="users__toast">{toastMessage}</div>}

      {error ? (
        <div className="users__error-banner" role="alert">
          {error}
        </div>
      ) : null}

      <div className="users__toolbar">
        <div className="users__toolbar-left">
          <SearchBar
            placeholder="Search users..."
            onChange={setSearchTerm}
            instant
          />
          <select
            className="users__filter-select"
            value={roleFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setRoleFilter(e.target.value as RoleFilter)
            }
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={openAddModal}
        >
          + Add User
        </button>
      </div>

      {loading ? (
        <p className="users__loading">Loading users...</p>
      ) : (
        <UsersTable
          users={filteredUsers}
          onEdit={openEditModal}
          onDelete={openDeleteConfirm}
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingUser ? 'Edit User' : 'Add New User'}
        showFooter={false}
      >
        <UserForm
          formData={formData}
          formErrors={formErrors}
          isEditing={editingUser !== null}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        type="danger"
        confirmText="Delete"
      />
    </div>
  );
}

export default UsersPage;
