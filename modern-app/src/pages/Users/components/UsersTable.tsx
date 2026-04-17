import { StatusBadge } from './StatusBadge';
import { formatRelative } from '../formatRelative';
import type { User } from '../types';

type Props = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
};

export function UsersTable({ users, onEdit, onDelete }: Props) {
  return (
    <div className="users__table-wrap">
      <table className="users__table">
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
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="users__empty">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="users__name-cell">
                    <div className="users__avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {/* TODO: wire to router — legacy used <Link to={'/users/' + user.id}> */}
                    <a
                      href={`/users/${user.id}`}
                      className="users__name-link"
                    >
                      {user.name}
                    </a>
                  </div>
                </td>
                <td className="users__cell-email">{user.email}</td>
                <td>
                  <StatusBadge status={user.role} />
                </td>
                <td>
                  <StatusBadge status={user.status} />
                </td>
                <td className="users__cell-last-login">
                  {formatRelative(user.lastLogin)}
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary users__row-btn"
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;
