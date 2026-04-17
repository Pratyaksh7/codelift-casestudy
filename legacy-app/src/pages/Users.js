import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import $ from 'jquery';
import { fetchUsers, createUser, updateUser, deleteUser } from '../redux/actions/userActions';
import SearchBar from '../components/SearchBar';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Breadcrumb from '../components/Breadcrumb';
import { USER_ROLES, ROLE_LABELS } from '../utils/constants';
import { validateEmail, validateRequired } from '../utils/validators';
import './Users.css';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      roleFilter: 'all',
      showModal: false,
      showDeleteConfirm: false,
      deleteTargetId: null,
      editingUser: null,
      formData: {
        name: '',
        email: '',
        role: 'viewer',
        phone: '',
        status: 'active',
      },
      formErrors: {},
      toastMessage: null,
    };
  }

  componentDidMount() {
    console.log('[Users] Component mounted, fetching users');
    this.props.fetchUsers();

    // animate the page header
    setTimeout(function() {
      $('.users-page .page-header').css('opacity', 0).animate({ opacity: 1 }, 500);
    }, 100);
  }

  handleSearch = (value) => {
    this.setState({ searchTerm: value });
  }

  handleRoleFilter = (e) => {
    this.setState({ roleFilter: e.target.value });
  }

  openAddModal = () => {
    this.setState({
      showModal: true,
      editingUser: null,
      formData: { name: '', email: '', role: 'viewer', phone: '', status: 'active' },
      formErrors: {},
    });
  }

  openEditModal = (user) => {
    console.log('editing user', user.id);
    this.setState({
      showModal: true,
      editingUser: user,
      formData: {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        status: user.status,
      },
      formErrors: {},
    });
  }

  closeModal = () => {
    this.setState({ showModal: false, editingUser: null });
  }

  handleFormChange = (e) => {
    var formData = Object.assign({}, this.state.formData);
    formData[e.target.name] = e.target.value;
    this.setState({ formData: formData });
  }

  validateForm() {
    var { formData } = this.state;
    var errors = {};

    if (!validateRequired(formData.name)) {
      errors.name = 'Name is required';
    }
    if (!validateEmail(formData.email)) {
      errors.email = 'Valid email is required';
    }
    if (!validateRequired(formData.role)) {
      errors.role = 'Role is required';
    }

    this.setState({ formErrors: errors });
    return Object.keys(errors).length === 0;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.validateForm()) return;

    var { formData, editingUser } = this.state;

    if (editingUser) {
      this.props.updateUser(editingUser.id, formData);
    } else {
      this.props.createUser(formData);
    }

    this.closeModal();
    this.setState({ toastMessage: editingUser ? 'User updated successfully' : 'User created successfully' });

    // clear toast after 3 seconds
    var self = this;
    setTimeout(function() {
      self.setState({ toastMessage: null });
    }, 3000);
  }

  openDeleteConfirm = (userId) => {
    this.setState({ showDeleteConfirm: true, deleteTargetId: userId });
  }

  handleDeleteConfirm = () => {
    this.props.deleteUser(this.state.deleteTargetId);
    this.setState({ showDeleteConfirm: false, deleteTargetId: null });
  }

  handleDeleteCancel = () => {
    this.setState({ showDeleteConfirm: false, deleteTargetId: null });
  }

  getFilteredUsers() {
    var { searchTerm, roleFilter } = this.state;
    var users = this.props.users;

    if (searchTerm) {
      var term = searchTerm.toLowerCase();
      users = users.filter(function(u) {
        return u.name.toLowerCase().indexOf(term) !== -1 ||
               u.email.toLowerCase().indexOf(term) !== -1;
      });
    }

    if (roleFilter !== 'all') {
      users = users.filter(function(u) {
        return u.role === roleFilter;
      });
    }

    return users;
  }

  render() {
    var { loading } = this.props;
    var { showModal, showDeleteConfirm, editingUser, formData, formErrors, roleFilter, toastMessage } = this.state;
    var filteredUsers = this.getFilteredUsers();

    var breadcrumbItems = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Users' },
    ];

    return (
      <div className="users-page">
        <Breadcrumb items={breadcrumbItems} />

        <div className="page-header">
          <h2>User Management</h2>
          <p className="page-subtitle">Manage user accounts and permissions</p>
        </div>

        {toastMessage && (
          <div style={{ background: '#d4edda', color: '#155724', padding: '10px 16px', borderRadius: 4, marginBottom: 16, border: '1px solid #c3e6cb' }}>
            {toastMessage}
          </div>
        )}

        <div className="users-toolbar">
          <div className="users-toolbar-left">
            <SearchBar
              placeholder="Search users..."
              onChange={this.handleSearch}
              instant={true}
            />
            <select className="filter-select" value={roleFilter} onChange={this.handleRoleFilter}>
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={this.openAddModal}>+ Add User</button>
        </div>

        {loading ? (
          <p style={{ color: '#888', padding: 20 }}>Loading users...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#aaa', padding: 40 }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(function(user) {
                  return (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%', backgroundColor: '#4a90d9',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 600,
                          }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <Link to={'/users/' + user.id} style={{ color: '#4a90d9', textDecoration: 'none', fontWeight: 500 }}>
                            {user.name}
                          </Link>
                        </div>
                      </td>
                      <td style={{ color: '#666' }}>{user.email}</td>
                      <td><StatusBadge status={user.role} /></td>
                      <td><StatusBadge status={user.status} /></td>
                      <td style={{ color: '#888', fontSize: 13 }}>
                        {user.lastLogin ? moment(user.lastLogin).fromNow() : 'Never'}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-primary" style={{ marginRight: 6 }} onClick={function() { this.openEditModal(user); }.bind(this)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={function() { this.openDeleteConfirm(user.id); }.bind(this)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                }.bind(this))
              )}
            </tbody>
          </table>
        )}

        {/* Add/Edit User Modal */}
        <Modal
          isOpen={showModal}
          onClose={this.closeModal}
          title={editingUser ? 'Edit User' : 'Add New User'}
          showFooter={false}
        >
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={this.handleFormChange} />
              {formErrors.name && <span className="field-error">{formErrors.name}</span>}
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" className="form-input" value={formData.email} onChange={this.handleFormChange} />
              {formErrors.email && <span className="field-error">{formErrors.email}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <select name="role" className="form-input" value={formData.role} onChange={this.handleFormChange}>
                  <option value="admin">Administrator</option>
                  <option value="manager">Manager</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" className="form-input" value={formData.status} onChange={this.handleFormChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" className="form-input" value={formData.phone} onChange={this.handleFormChange} placeholder="555-0100" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button type="button" className="btn" style={{ background: '#eee', color: '#555' }} onClick={this.closeModal}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingUser ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onConfirm={this.handleDeleteConfirm}
          onCancel={this.handleDeleteCancel}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
          type="danger"
          confirmText="Delete"
        />
      </div>
    );
  }
}

Users.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  fetchUsers: PropTypes.func.isRequired,
  createUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  users: state.users.items,
  loading: state.users.loading,
});

export default connect(mapStateToProps, { fetchUsers, createUser, updateUser, deleteUser })(Users);
